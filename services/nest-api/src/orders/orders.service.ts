import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(merchantId: number, createOrderDto: any) {
    const { items, total_amount, discount, tax } = createOrderDto;

    // Create the order
    const order = this.ordersRepository.create({
      merchant_id: merchantId,
      user_id: 1, // Default to admin user for POS orders
      amount: total_amount,
      status: 'completed',
      source: 'POS',
    });

    const savedOrder = await this.ordersRepository.save(order);

    // Create order items
    const orderItems = items.map((item: any) =>
      this.orderItemsRepository.create({
        order_id: savedOrder.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }),
    );

    await this.orderItemsRepository.save(orderItems);

    // Update product stock
    for (const item of items) {
      const product = await this.productsRepository.findOne({
        where: { id: item.product_id },
      });
      
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        await this.productsRepository.update(item.product_id, { stock: newStock });
      }
    }

    return savedOrder;
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
      relations: { product: true },
    });

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
