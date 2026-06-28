import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Merchant } from '../entities/merchant.entity';
import { MerchantMember } from '../entities/merchant-member.entity';
import { Product } from '../entities/product.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Category } from '../entities/category.entity';
import { InventoryMovement } from '../entities/inventory-movement.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'tindacloud',
        entities: [User, Merchant, MerchantMember, Product, Order, OrderItem, Category, InventoryMovement],
        synchronize: false,
        logging: true,
      }),
    }),
    TypeOrmModule.forFeature([User, Merchant, MerchantMember, Product, Order, OrderItem, Category, InventoryMovement]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
