import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantMember } from '../entities/merchant-member.entity';
import { MerchantAuthGuard } from './merchant-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantMember])],
  providers: [MerchantAuthGuard],
  exports: [MerchantAuthGuard],
})
export class MerchantAuthModule {}
