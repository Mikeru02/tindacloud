import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Request() req, @Query('page') page: string = '1', @Query('limit') limit: string = '10', @Query('dateRange') dateRange?: 'all' | '7days' | 'month') {
    const merchantId = req.user.merchantId;
    return this.ordersService.findAll(
      merchantId,
      parseInt(page),
      parseInt(limit),
      dateRange,
    );
  }

  @Get('dashboard/stats')
  getDashboardStats(@Request() req, @Query('dateRange') dateRange?: 'all' | '7days' | 'month') {
    const merchantId = req.user.merchantId;
    return this.ordersService.getDashboardStats(merchantId, dateRange);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }
}
