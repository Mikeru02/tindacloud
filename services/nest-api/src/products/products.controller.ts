import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MerchantAuthGuard } from '../auth/merchant-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard, MerchantAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Request() req, @Query('merchantId') merchantId: string, @Query('page') page: string = '1', @Query('limit') limit: string = '10', @Query('search') search?: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.productsService.findAll(
      parseInt(merchantId),
      parseInt(page),
      parseInt(limit),
      search,
    );
  }

  @Get('low-stock/alerts')
  getLowStockAlerts(@Request() req, @Query('merchantId') merchantId: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.productsService.getLowStockProducts(parseInt(merchantId));
  }

  @Get('total/count')
  getTotalCount(@Request() req, @Query('merchantId') merchantId: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.productsService.getTotalProducts(parseInt(merchantId));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req, @Query('merchantId') merchantId: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.productsService.findOne(+id, parseInt(merchantId));
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@UploadedFile() file: any, @Body() productData: any, @Request() req, @Query('merchantId') merchantId: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.productsService.create({ ...productData, merchant_id: parseInt(merchantId) }, file);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: string, @UploadedFile() file: any, @Body() productData: any, @Request() req, @Query('merchantId') merchantId: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.productsService.update(+id, parseInt(merchantId), productData, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req, @Query('merchantId') merchantId: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.productsService.remove(+id, parseInt(merchantId));
  }
}
