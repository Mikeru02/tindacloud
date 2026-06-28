import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MerchantMembersService } from './merchant-members.service';
import { MerchantMembersController } from './merchant-members.controller';
import { MerchantMember } from '../entities/merchant-member.entity';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([MerchantMember]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [MerchantMembersController],
  providers: [MerchantMembersService, JwtStrategy],
  exports: [MerchantMembersService],
})
export class MerchantMembersModule {}
