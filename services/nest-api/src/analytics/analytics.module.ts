import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { MerchantMember } from '../entities/merchant-member.entity';
import { MerchantAuthModule } from '../auth/merchant-auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product, MerchantMember]), MerchantAuthModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
