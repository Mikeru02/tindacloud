import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findOrCreate(categoryName: string): Promise<Category> {
    // Sanitize category name: lowercase and replace spaces with hyphens
    const sanitizedName = categoryName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    // Try to find existing category
    let category = await this.categoriesRepository.findOne({
      where: { name: sanitizedName },
    });

    // If not found, create new category
    if (!category) {
      category = this.categoriesRepository.create({
        name: sanitizedName,
      });
      category = await this.categoriesRepository.save(category);
    }

    return category;
  }

  async findAll() {
    return this.categoriesRepository.find({
      order: { name: 'ASC' },
    });
  }
}
