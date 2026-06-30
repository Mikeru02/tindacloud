import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { Merchant } from '../entities/merchant.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(MenuItem)
    private menuItemsRepository: Repository<MenuItem>,
    @InjectRepository(Merchant)
    private merchantsRepository: Repository<Merchant>,
    private dataSource: DataSource,
  ) {}

  async create(merchantId: number, createOrderDto: any) {
    const { items, total_amount, discount, tax } = createOrderDto;

    // Get merchant to check store type
    const merchant = await this.merchantsRepository.findOne({
      where: { id: merchantId },
    });

    if (!merchant) {
      throw new Error('Merchant not found');
    }

    const isRestaurant = merchant.store_type.toLowerCase() === 'restaurant';

    // Create the order
    const order = this.ordersRepository.create({
      merchant_id: merchantId,
      user_id: 1, // Default to admin user for POS orders
      amount: total_amount,
      status: 'completed',
      source: 'POS',
    });

    const savedOrder = await this.ordersRepository.save(order);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create order items and handle inventory
      for (const item of items) {
        const orderItem = queryRunner.manager.create(OrderItem, {
          order_id: savedOrder.id,
          product_id: item.item_type === 'product' ? item.item_id : null,
          menu_item_id: item.item_type === 'menu_item' ? item.item_id : null,
          quantity: item.quantity,
          price: item.price,
          item_type: item.item_type || 'product',
        });
        await queryRunner.manager.save(orderItem);

        if (isRestaurant && item.item_type === 'menu_item') {
          // Deduct ingredients for menu items
          const menuItem = await queryRunner.manager.findOne(MenuItem, {
            where: { id: item.item_id, merchant_id: merchantId },
          });

          console.log('Menu item found:', menuItem?.name, 'ID:', item.item_id);
          console.log('Menu item ingredients (raw):', menuItem?.ingredients);

          // Parse ingredients if it's a string (TypeORM sometimes returns JSONB as string)
          let ingredients = menuItem?.ingredients;
          if (typeof ingredients === 'string') {
            try {
              ingredients = JSON.parse(ingredients);
            } catch (e) {
              console.error('Failed to parse ingredients JSON:', e);
              ingredients = [];
            }
          }

          console.log('Menu item ingredients (parsed):', ingredients);

          if (ingredients && ingredients.length > 0) {
            for (const ingredient of ingredients) {
              if (!ingredient.product_id) {
                console.error('Ingredient has undefined product_id:', ingredient);
                continue;
              }

              const product = await queryRunner.manager.findOne(Product, {
                where: { id: ingredient.product_id, merchant_id: merchantId },
              });

              if (product) {
                const quantityToDeduct = ingredient.quantity * item.quantity;
                const newStock = Math.max(0, product.stock - quantityToDeduct);
                console.log(`Deducting ${quantityToDeduct} from product ${product.name} (ID: ${product.id}), new stock: ${newStock}`);
                await queryRunner.manager.update(Product, ingredient.product_id, { stock: newStock });
              } else {
                console.error('Product not found for ingredient:', ingredient.product_id);
              }
            }
          } else {
            console.log('Menu item has no ingredients or ingredients array is empty');
          }
        } else {
          // Deduct product stock for regular products
          if (!item.item_id) {
            console.error('Item has undefined item_id:', item);
            continue;
          }

          const product = await queryRunner.manager.findOne(Product, {
            where: { id: item.item_id, merchant_id: merchantId },
          });

          if (product) {
            const newStock = Math.max(0, product.stock - item.quantity);
            await queryRunner.manager.update(Product, item.item_id, { stock: newStock });
          }
        }
      }

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(merchantId: number, page: number = 1, limit: number = 10, dateRange?: 'all' | '7days' | 'month') {
    const skip = (page - 1) * limit;
    
    const queryBuilder = this.ordersRepository.createQueryBuilder('order')
      .where('order.merchant_id = :merchantId', { merchantId })
      .leftJoinAndSelect('order.user', 'user');

    if (dateRange === '7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      queryBuilder.andWhere('order.created_at >= :sevenDaysAgo', { sevenDaysAgo });
    } else if (dateRange === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      queryBuilder.andWhere('order.created_at >= :oneMonthAgo', { oneMonthAgo });
    }

    queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('order.created_at', 'DESC');

    const [orders, total] = await queryBuilder.getManyAndCount();

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    return this.ordersRepository.findOne({
      where: { id },
      relations: { user: true },
    });
  }

  async findOneWithItems(id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!order) {
      return null;
    }

    const orderItems = await this.orderItemsRepository.find({
      where: { order_id: id },
      relations: { product: true, menuItem: true },
    });

    console.log('Order items:', JSON.stringify(orderItems, null, 2));

    return {
      ...order,
      items: orderItems,
    };
  }

  async getDashboardStats(merchantId: number, dateRange?: 'all' | '7days' | 'month' | 'today') {
    const queryBuilder = this.ordersRepository.createQueryBuilder('order')
      .where('order.merchant_id = :merchantId', { merchantId });

    if (dateRange === '7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      queryBuilder.andWhere('order.created_at >= :sevenDaysAgo', { sevenDaysAgo });
    } else if (dateRange === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      queryBuilder.andWhere('order.created_at >= :oneMonthAgo', { oneMonthAgo });
    } else if (dateRange === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      queryBuilder.andWhere('order.created_at >= :today', { today });
    }

    const totalOrders = await queryBuilder.getCount();

    const totalSalesResult = await queryBuilder
      .select('SUM(order.amount)', 'total')
      .getRawOne();

    const totalSales = totalSalesResult.total ? parseFloat(totalSalesResult.total) : 0;

    return {
      totalOrders,
      totalSales,
    };
  }
}
