import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  getAllAnalytics(@Request() req) {
    const merchantId = req.user.merchantId;
    return this.analyticsService.getAllAnalytics(merchantId);
  }

  @Get('revenue')
  getRevenue(@Request() req) {
    const merchantId = req.user.merchantId;
    return this.analyticsService.getRevenueThisMonth(merchantId);
  }

  @Get('average-order-value')
  getAverageOrderValue(@Request() req) {
    const merchantId = req.user.merchantId;
    return this.analyticsService.getAverageOrderValue(merchantId);
  }

  @Get('conversion-rate')
  getConversionRate(@Request() req) {
    const merchantId = req.user.merchantId;
    return this.analyticsService.getConversionRate(merchantId);
  }

  @Get('daily-sales')
  getDailySales(@Request() req) {
    const merchantId = req.user.merchantId;
    return this.analyticsService.getDailySalesLast7Days(merchantId);
  }

  @Get('sales-by-category')
  getSalesByCategory(@Request() req) {
    const merchantId = req.user.merchantId;
    return this.analyticsService.getSalesByCategory(merchantId);
  }

  @Get('top-products')
  getTopProducts(@Request() req) {
    const merchantId = req.user.merchantId;
    return this.analyticsService.getTopProducts(merchantId);
  }
}
