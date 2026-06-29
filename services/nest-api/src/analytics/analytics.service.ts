import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async getRevenueThisMonth(merchantId: number) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthRevenue = await this.ordersRepository
      .createQueryBuilder('order')
      .select('SUM(order.amount)', 'total')
      .where('order.merchant_id = :merchantId', { merchantId })
      .andWhere('order.created_at >= :startOfMonth', { startOfMonth })
      .getRawOne();

    const lastMonthRevenue = await this.ordersRepository
      .createQueryBuilder('order')
      .select('SUM(order.amount)', 'total')
      .where('order.merchant_id = :merchantId', { merchantId })
      .andWhere('order.created_at >= :startOfLastMonth', { startOfLastMonth })
      .andWhere('order.created_at <= :endOfLastMonth', { endOfLastMonth })
      .getRawOne();

    const currentRevenue = thisMonthRevenue.total ? parseFloat(thisMonthRevenue.total) : 0;
    const previousRevenue = lastMonthRevenue.total ? parseFloat(lastMonthRevenue.total) : 0;

    let percentageChange = 0;
    if (previousRevenue > 0) {
      percentageChange = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    }

    return {
      revenue: currentRevenue,
      percentageChange: percentageChange.toFixed(1),
    };
  }

  async getAverageOrderValue(merchantId: number) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthResult = await this.ordersRepository
      .createQueryBuilder('order')
      .select('AVG(order.amount)', 'avg')
      .where('order.merchant_id = :merchantId', { merchantId })
      .andWhere('order.created_at >= :startOfMonth', { startOfMonth })
      .getRawOne();

    const lastMonthResult = await this.ordersRepository
      .createQueryBuilder('order')
      .select('AVG(order.amount)', 'avg')
      .where('order.merchant_id = :merchantId', { merchantId })
      .andWhere('order.created_at >= :startOfLastMonth', { startOfLastMonth })
      .andWhere('order.created_at <= :endOfLastMonth', { endOfLastMonth })
      .getRawOne();

    const currentAOV = thisMonthResult.avg ? parseFloat(thisMonthResult.avg) : 0;
    const previousAOV = lastMonthResult.avg ? parseFloat(lastMonthResult.avg) : 0;

    let percentageChange = 0;
    if (previousAOV > 0) {
      percentageChange = ((currentAOV - previousAOV) / previousAOV) * 100;
    }

    return {
      averageOrderValue: currentAOV,
      percentageChange: percentageChange.toFixed(1),
    };
  }

  async getConversionRate(merchantId: number) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthOrders = await this.ordersRepository
      .createQueryBuilder('order')
      .where('order.merchant_id = :merchantId', { merchantId })
      .andWhere('order.created_at >= :startOfMonth', { startOfMonth })
      .getCount();

    const lastMonthOrders = await this.ordersRepository
      .createQueryBuilder('order')
      .where('order.merchant_id = :merchantId', { merchantId })
      .andWhere('order.created_at >= :startOfLastMonth', { startOfLastMonth })
      .andWhere('order.created_at <= :endOfLastMonth', { endOfLastMonth })
      .getCount();

    const currentRate = thisMonthOrders;
    const previousRate = lastMonthOrders;

    let percentageChange = 0;
    if (previousRate > 0) {
      percentageChange = ((currentRate - previousRate) / previousRate) * 100;
    }

    return {
      conversionRate: currentRate,
      percentageChange: percentageChange.toFixed(1),
    };
  }

  async getDailySalesLast7Days(merchantId: number) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailySales = await this.ordersRepository
      .createQueryBuilder('order')
      .select('DATE(order.created_at)', 'date')
      .addSelect('SUM(order.amount)', 'total')
      .where('order.merchant_id = :merchantId', { merchantId })
      .andWhere('order.created_at >= :sevenDaysAgo', { sevenDaysAgo })
      .groupBy('DATE(order.created_at)')
      .orderBy('DATE(order.created_at)', 'ASC')
      .getRawMany();

    const result = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toLocaleDateString('en-CA'); // en-CA gives YYYY-MM-DD format
      result[dateStr] = 0;
    }

    dailySales.forEach((sale) => {
      const dateStr = sale.date.toLocaleDateString('en-CA');
      if (result.hasOwnProperty(dateStr)) {
        result[dateStr] = parseFloat(sale.total);
      }
    });

    return result;
  }

  async getSalesByCategory(merchantId: number) {
    const salesByCategory = await this.orderItemsRepository
      .createQueryBuilder('orderItem')
      .select('category.name', 'category')
      .addSelect('SUM(orderItem.quantity * orderItem.price)', 'total')
      .leftJoin('orderItem.product', 'product')
      .leftJoin('product.category', 'category')
      .leftJoin('orderItem.order', 'order')
      .where('order.merchant_id = :merchantId', { merchantId })
      .groupBy('category.id')
      .orderBy('total', 'DESC')
      .getRawMany();

    const totalSales = salesByCategory.reduce((sum, item) => sum + parseFloat(item.total), 0);

    return salesByCategory.map((item) => ({
      category: item.category || 'Other',
      amount: parseFloat(item.total),
      percentage: totalSales > 0 ? ((parseFloat(item.total) / totalSales) * 100).toFixed(1) : 0,
    }));
  }

  async getTopProducts(merchantId: number, limit: number = 5) {
    const topProducts = await this.orderItemsRepository
      .createQueryBuilder('orderItem')
      .select('product.name', 'name')
      .addSelect('SUM(orderItem.quantity)', 'totalSold')
      .addSelect('SUM(orderItem.quantity * orderItem.price)', 'totalRevenue')
      .leftJoin('orderItem.product', 'product')
      .leftJoin('orderItem.order', 'order')
      .where('order.merchant_id = :merchantId', { merchantId })
      .groupBy('product.id')
      .orderBy('totalRevenue', 'DESC')
      .limit(limit)
      .getRawMany();

    return topProducts.map((item) => ({
      name: item.name,
      sales: parseInt(item.totalSold),
      revenue: parseFloat(item.totalRevenue),
    }));
  }

  async getAllAnalytics(merchantId: number) {
    const [revenue, aov, conversionRate, dailySales, salesByCategory, topProducts] = await Promise.all([
      this.getRevenueThisMonth(merchantId),
      this.getAverageOrderValue(merchantId),
      this.getConversionRate(merchantId),
      this.getDailySalesLast7Days(merchantId),
      this.getSalesByCategory(merchantId),
      this.getTopProducts(merchantId),
    ]);

    return {
      revenue,
      averageOrderValue: aov,
      conversionRate,
      dailySales,
      salesByCategory,
      topProducts,
    };
  }
}
