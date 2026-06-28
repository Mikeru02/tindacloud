import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

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

  async getDashboardStats(merchantId: number, dateRange?: 'all' | '7days' | 'month') {
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
