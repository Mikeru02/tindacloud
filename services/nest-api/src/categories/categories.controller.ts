import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('find-or-create')
  async findOrCreate(@Body('name') name: string) {
    return this.categoriesService.findOrCreate(name);
  }

  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }
}
