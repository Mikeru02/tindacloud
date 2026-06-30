import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from '../entities/product.entity';
import { InventoryMovement } from '../entities/inventory-movement.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';

export interface BatchUpdateItem {
  product_id: number;
  new_stock: number;
}

export interface BatchUpdateRequest {
  merchantId: number;
  items: BatchUpdateItem[];
  reason: 'SALE' | 'RESTOCK' | 'DAMAGED' | 'EXPIRED' | 'LOST' | 'ADJUSTMENT';
  remarks?: string;
}

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(InventoryMovement)
    private inventoryMovementsRepository: Repository<InventoryMovement>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private dataSource: DataSource,
  ) {}

  async batchUpdate(merchantId: number, userId: number, request: BatchUpdateRequest) {
    const { items, reason, remarks } = request;

    if (!items || items.length === 0) {
      throw new BadRequestException('No items to update');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const movements: InventoryMovement[] = [];
      let orderId: number | null = null;

      // If reason is SALE, create an order first
      if (reason === 'SALE') {
        const order = queryRunner.manager.create(Order, {
          merchant_id: merchantId,
          user_id: userId,
          amount: 0,
          status: 'completed',
          source: 'INVENTORY',
        });
        const savedOrder = await queryRunner.manager.save(order);
        orderId = savedOrder.id;
      }

      let totalAmount = 0;

      // Process each product update
      for (const item of items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.product_id, merchant_id: merchantId },
        });

        if (!product) {
          throw new BadRequestException(`Product ${item.product_id} not found`);
        }

        const quantityBefore = product.stock;
        const quantityAfter = item.new_stock;
        const quantityDifference = quantityAfter - quantityBefore;

        // Update product stock
        product.stock = quantityAfter;
        await queryRunner.manager.save(product);

        // Create inventory movement
        const movement = queryRunner.manager.create(InventoryMovement, {
          merchant_id: merchantId,
          product_id: item.product_id,
          quantity_before: quantityBefore,
          quantity_after: quantityAfter,
          quantity_difference: quantityDifference,
          movement_type: reason,
          reference_type: 'INVENTORY',
          reference_id: orderId || undefined,
          remarks,
          created_by: userId,
        });
        const savedMovement = await queryRunner.manager.save(movement);
        movements.push(savedMovement);

        // If reason is SALE, create order items
        if (reason === 'SALE' && quantityDifference < 0 && orderId) {
          const saleQuantity = Math.abs(quantityDifference);
          const orderItem = queryRunner.manager.create(OrderItem, {
            order_id: orderId,
            product_id: item.product_id,
            quantity: saleQuantity,
            price: product.price,
          });
          await queryRunner.manager.save(orderItem);
          totalAmount += saleQuantity * Number(product.price);
        }
      }

      // Update order total amount if sale
      if (reason === 'SALE' && orderId) {
        await queryRunner.manager.update(Order, orderId, {
          amount: totalAmount,
        });
      }

      await queryRunner.commitTransaction();

      return {
        success: true,
        movements: movements.map((m) => ({
          id: m.id,
          product_id: m.product_id,
          quantity_before: m.quantity_before,
          quantity_after: m.quantity_after,
          quantity_difference: m.quantity_difference,
          movement_type: m.movement_type,
        })),
        order_id: orderId,
        total_amount: totalAmount,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getMovements(merchantId: number, productId?: number) {
    const queryBuilder = this.inventoryMovementsRepository
      .createQueryBuilder('movement')
      .leftJoinAndSelect('movement.product', 'product')
      .leftJoinAndSelect('movement.user', 'user')
      .where('movement.merchant_id = :merchantId', { merchantId })
      .orderBy('movement.created_at', 'DESC');

    if (productId) {
      queryBuilder.andWhere('movement.product_id = :productId', { productId });
    }

    return queryBuilder.getMany();
  }
}
