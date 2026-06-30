import { Controller, Post, Get, Body, Query, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import type { BatchUpdateRequest } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MerchantAuthGuard } from '../auth/merchant-auth.guard';

@Controller('inventory')
@UseGuards(JwtAuthGuard, MerchantAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('batch-update')
  async batchUpdate(@Body() request: BatchUpdateRequest, @Request() req) {
    if (!request.merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    const userId = req.user.userId;
    return this.inventoryService.batchUpdate(request.merchantId, userId, request);
  }

  @Get('movements')
  async getMovements(@Request() req, @Query('merchantId') merchantId: string, @Query('product_id') productId?: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.inventoryService.getMovements(parseInt(merchantId), productId ? +productId : undefined);
  }
}
