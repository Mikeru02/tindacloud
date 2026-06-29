import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private categoriesService: CategoriesService,
  ) {}

  async findAll(merchantId: number, page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    
    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.merchant_id = :merchantId', { merchantId });

    if (search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.sku ILIKE :search OR product.price::text ILIKE :search OR category.name ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [products, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('product.created_at', 'DESC')
      .getManyAndCount();

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number, merchantId: number) {
    return this.productsRepository.findOne({
      where: { id, merchant_id: merchantId },
    });
  }

  async create(productData: Partial<Product> & { category_name?: string }) {
    let categoryId = productData.category_id;

    // If category name is provided instead of ID, find or create the category
    if (productData.category_name && !categoryId) {
      const category = await this.categoriesService.findOrCreate(productData.category_name);
      categoryId = category.id;
    }

    const product = this.productsRepository.create({
      ...productData,
      category_id: categoryId,
    });
    return this.productsRepository.save(product);
  }

  async update(id: number, merchantId: number, productData: Partial<Product>) {
    await this.productsRepository.update(
      { id, merchant_id: merchantId },
      productData,
    );
    return this.findOne(id, merchantId);
  }

  async remove(id: number, merchantId: number) {
    await this.productsRepository.delete({ id, merchant_id: merchantId });
  }

  async getLowStockProducts(merchantId: number) {
    return this.productsRepository
      .createQueryBuilder('product')
      .where('product.merchant_id = :merchantId', { merchantId })
      .andWhere('product.stock <= product.low_stock_threshold')
      .orderBy('product.stock', 'ASC')
      .getMany();
  }

  async getTotalProducts(merchantId: number) {
    return this.productsRepository.count({
      where: { merchant_id: merchantId },
    });
  }
}
