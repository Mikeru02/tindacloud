import { Controller, Post, Get, Body, Query, UseGuards, Request } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import type { BatchUpdateRequest } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('batch-update')
  async batchUpdate(@Body() request: BatchUpdateRequest, @Request() req) {
    const merchantId = req.user.merchantId;
    const userId = req.user.userId;
    return this.inventoryService.batchUpdate(merchantId, userId, request);
  }

  @Get('movements')
  async getMovements(@Request() req, @Query('product_id') productId?: string) {
    const merchantId = req.user.merchantId;
    return this.inventoryService.getMovements(merchantId, productId ? +productId : undefined);
  }
}
