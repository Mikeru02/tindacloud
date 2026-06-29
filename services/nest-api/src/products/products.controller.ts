import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Request() req, @Query('page') page: string = '1', @Query('limit') limit: string = '10', @Query('search') search?: string) {
    const merchantId = req.user.merchantId;
    return this.productsService.findAll(
      merchantId,
      parseInt(page),
      parseInt(limit),
      search,
    );
  }

  @Get('low-stock/alerts')
  getLowStockAlerts(@Request() req) {
    const merchantId = req.user.merchantId;
    return this.productsService.getLowStockProducts(merchantId);
  }

  @Get('total/count')
  getTotalCount(@Request() req) {
    const merchantId = req.user.merchantId;
    return this.productsService.getTotalProducts(merchantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const merchantId = req.user.merchantId;
    return this.productsService.findOne(+id, merchantId);
  }

  @Post()
  create(@Body() productData: any, @Request() req) {
    const merchantId = req.user.merchantId;
    return this.productsService.create({ ...productData, merchant_id: merchantId });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() productData: any, @Request() req) {
    const merchantId = req.user.merchantId;
    return this.productsService.update(+id, merchantId, productData);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const merchantId = req.user.merchantId;
    return this.productsService.remove(+id, merchantId);
  }
}
