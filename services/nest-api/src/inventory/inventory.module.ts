import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { Product } from '../entities/product.entity';
import { InventoryMovement } from '../entities/inventory-movement.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { MerchantMember } from '../entities/merchant-member.entity';
import { MerchantAuthModule } from '../auth/merchant-auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, InventoryMovement, Order, OrderItem, MerchantMember]), MerchantAuthModule],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
