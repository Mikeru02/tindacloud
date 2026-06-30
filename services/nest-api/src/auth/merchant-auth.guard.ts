import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MerchantMember } from '../entities/merchant-member.entity';

@Injectable()
export class MerchantAuthGuard implements CanActivate {
  private readonly logger = new Logger(MerchantAuthGuard.name);

  constructor(
    @InjectRepository(MerchantMember)
    private merchantMemberRepository: Repository<MerchantMember>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const merchantId = request.params?.merchantId || request.query?.merchantId || request.body?.merchantId;

    this.logger.log(`MerchantAuthGuard: user=${JSON.stringify(user)}, merchantId=${merchantId}`);

    if (!merchantId) {
      return true; // No merchant ID required for this endpoint
    }

    const merchantMember = await this.merchantMemberRepository.findOne({
      where: {
        user_id: user.userId,
        merchant_id: parseInt(merchantId),
      },
    });

    this.logger.log(`MerchantAuthGuard: merchantMember=${JSON.stringify(merchantMember)}`);

    if (!merchantMember) {
      throw new ForbiddenException('You do not have access to this merchant');
    }

    request.merchantRole = merchantMember.role;
    return true;
  }
}
