import { Controller, Get, UseGuards, Request, Query, BadRequestException } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MerchantAuthGuard } from '../auth/merchant-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard, MerchantAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  getAllAnalytics(@Request() req, @Query('merchantId') merchantId: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.analyticsService.getAllAnalytics(parseInt(merchantId));
  }

  @Get('revenue')
  getRevenue(@Request() req, @Query('merchantId') merchantId: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.analyticsService.getRevenueThisMonth(parseInt(merchantId));
  }

  @Get('average-order-value')
  getAverageOrderValue(@Request() req, @Query('merchantId') merchantId: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.analyticsService.getAverageOrderValue(parseInt(merchantId));
  }

  @Get('conversion-rate')
  getConversionRate(@Request() req, @Query('merchantId') merchantId: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.analyticsService.getConversionRate(parseInt(merchantId));
  }

  @Get('daily-sales')
  getDailySales(@Request() req, @Query('merchantId') merchantId: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.analyticsService.getDailySalesLast7Days(parseInt(merchantId));
  }

  @Get('sales-by-category')
  getSalesByCategory(@Request() req, @Query('merchantId') merchantId: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.analyticsService.getSalesByCategory(parseInt(merchantId));
  }

  @Get('top-products')
  getTopProducts(@Request() req, @Query('merchantId') merchantId: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.analyticsService.getTopProducts(parseInt(merchantId));
  }

  @Get('product-sales')
  getProductSales(@Request() req, @Query('merchantId') merchantId: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.analyticsService.getProductSalesData(parseInt(merchantId));
  }
}
