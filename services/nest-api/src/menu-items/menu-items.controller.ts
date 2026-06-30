import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MerchantAuthGuard } from '../auth/merchant-auth.guard';

@Controller('menu-items')
@UseGuards(JwtAuthGuard, MerchantAuthGuard)
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post()
  create(@Body('merchantId') merchantId: number, @Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemsService.create(merchantId, createMenuItemDto);
  }

  @Get()
  findAll(
    @Query('merchantId') merchantId: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('status') status?: string,
  ) {
    return this.menuItemsService.findAll(
      merchantId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      search,
      category,
      status,
    );
  }

  @Get('categories')
  getCategories(@Query('merchantId') merchantId: number) {
    return this.menuItemsService.getCategories(merchantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('merchantId') merchantId: number) {
    return this.menuItemsService.findOne(+id, merchantId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Query('merchantId') merchantId: number,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.menuItemsService.update(+id, merchantId, updateMenuItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('merchantId') merchantId: number) {
    return this.menuItemsService.remove(+id, merchantId);
  }
}
