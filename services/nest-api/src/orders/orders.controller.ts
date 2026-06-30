import { Controller, Get, Post, Param, Query, UseGuards, Request, Body, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MerchantAuthGuard } from '../auth/merchant-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard, MerchantAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Request() req, @Body() createOrderDto: any, @Query('merchantId') merchantId: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.ordersService.create(parseInt(merchantId), createOrderDto);
  }

  @Get()
  findAll(@Request() req, @Query('merchantId') merchantId: string, @Query('page') page: string = '1', @Query('limit') limit: string = '10', @Query('dateRange') dateRange?: 'all' | '7days' | 'month') {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.ordersService.findAll(
      parseInt(merchantId),
      parseInt(page),
      parseInt(limit),
      dateRange,
    );
  }

  @Get('dashboard/stats')
  getDashboardStats(@Request() req, @Query('merchantId') merchantId: string, @Query('dateRange') dateRange?: 'all' | '7days' | 'month' | 'today') {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.ordersService.getDashboardStats(parseInt(merchantId), dateRange);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOneWithItems(+id);
  }
}
