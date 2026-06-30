import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantInvitationsController } from './merchant-invitations.controller';
import { MerchantInvitationsService } from './merchant-invitations.service';
import { MerchantInvitation } from '../entities/merchant-invitation.entity';
import { MerchantMember } from '../entities/merchant-member.entity';
import { User } from '../entities/user.entity';
import { Merchant } from '../entities/merchant.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantInvitation, MerchantMember, User, Merchant]), EmailModule],
  controllers: [MerchantInvitationsController],
  providers: [MerchantInvitationsService],
  exports: [MerchantInvitationsService],
})
export class MerchantInvitationsModule {}
