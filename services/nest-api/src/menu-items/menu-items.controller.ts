import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Query('merchantId') merchantId: number,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('Request body:', body);
    console.log('Uploaded file:', file);

    if (!merchantId) {
      throw new Error('Merchant ID is required');
    }

    if (!body.name) {
      throw new Error('Name is required');
    }

    if (!body.price) {
      throw new Error('Price is required');
    }

    const createMenuItemDto: CreateMenuItemDto = {
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      category: body.category,
      status: body.status || 'available',
      image_url: body.image_url,
      ingredients: body.ingredients ? (typeof body.ingredients === 'string' ? JSON.parse(body.ingredients) : body.ingredients) : undefined,
    };

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
