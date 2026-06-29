import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FileInterceptor('image'))
  create(@UploadedFile() file: any, @Body() productData: any, @Request() req) {
    const merchantId = req.user.merchantId;
    return this.productsService.create({ ...productData, merchant_id: merchantId }, file);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: string, @UploadedFile() file: any, @Body() productData: any, @Request() req) {
    const merchantId = req.user.merchantId;
    return this.productsService.update(+id, merchantId, productData, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const merchantId = req.user.merchantId;
    return this.productsService.remove(+id, merchantId);
  }
}
