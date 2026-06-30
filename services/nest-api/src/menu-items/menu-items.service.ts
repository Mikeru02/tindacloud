import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from '../entities/menu-item.entity';
import { Merchant } from '../entities/merchant.entity';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
  ) {}

  async create(merchantId: number, createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
    if (!merchantId) {
      throw new NotFoundException('Merchant ID is required');
    }

    const merchant = await this.merchantRepository.findOne({ where: { id: merchantId } });
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    if (merchant.store_type.toLowerCase() !== 'restaurant') {
      throw new ForbiddenException('Menu items are only available for restaurant stores');
    }

    const menuItem = this.menuItemRepository.create({
      ...createMenuItemDto,
      merchant_id: merchantId,
      merchant,
    });

    return this.menuItemRepository.save(menuItem);
  }

  async findAll(
    merchantId: number,
    page: number = 1,
    limit: number = 10,
    search?: string,
    category?: string,
    status?: string,
  ): Promise<{ menuItems: MenuItem[]; total: number; page: number; limit: number; totalPages: number }> {
    const merchant = await this.merchantRepository.findOne({ where: { id: merchantId } });
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    if (merchant.store_type.toLowerCase() !== 'restaurant') {
      throw new ForbiddenException('Menu items are only available for restaurant stores');
    }

    const queryBuilder = this.menuItemRepository
      .createQueryBuilder('menu_item')
      .where('menu_item.merchant_id = :merchantId', { merchantId });

    if (search) {
      queryBuilder.andWhere(
        '(menu_item.name ILIKE :search OR menu_item.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category) {
      queryBuilder.andWhere('menu_item.category = :category', { category });
    }

    if (status) {
      queryBuilder.andWhere('menu_item.status = :status', { status });
    }

    const [menuItems, total] = await queryBuilder
      .orderBy('menu_item.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      menuItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number, merchantId: number): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.findOne({
      where: { id, merchant_id: merchantId },
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    return menuItem;
  }

  async update(id: number, merchantId: number, updateMenuItemDto: UpdateMenuItemDto): Promise<MenuItem> {
    const menuItem = await this.findOne(id, merchantId);
    
    Object.assign(menuItem, updateMenuItemDto);
    
    return this.menuItemRepository.save(menuItem);
  }

  async remove(id: number, merchantId: number): Promise<void> {
    const menuItem = await this.findOne(id, merchantId);
    await this.menuItemRepository.remove(menuItem);
  }

  async getCategories(merchantId: number): Promise<string[]> {
    const merchant = await this.merchantRepository.findOne({ where: { id: merchantId } });
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    if (merchant.store_type.toLowerCase() !== 'restaurant') {
      throw new ForbiddenException('Menu items are only available for restaurant stores');
    }

    const result = await this.menuItemRepository
      .createQueryBuilder('menu_item')
      .select('DISTINCT menu_item.category', 'category')
      .where('menu_item.merchant_id = :merchantId', { merchantId })
      .andWhere('menu_item.category IS NOT NULL')
      .getRawMany();

    return result.map((r) => r.category).filter(Boolean);
  }
}
