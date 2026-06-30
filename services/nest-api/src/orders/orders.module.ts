import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { MerchantMember } from '../entities/merchant-member.entity';
import { JwtStrategy } from '../auth/jwt.strategy';
import { MerchantAuthModule } from '../auth/merchant-auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product, MerchantMember]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
    MerchantAuthModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, JwtStrategy],
  exports: [OrdersService],
})
export class OrdersModule {}
