import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MerchantMember } from '../entities/merchant-member.entity';

@Injectable()
export class MerchantMembersService {
  constructor(
    @InjectRepository(MerchantMember)
    private merchantMemberRepository: Repository<MerchantMember>,
  ) {}

  async findAll(merchantId: number) {
    const members = await this.merchantMemberRepository.find({
      where: { merchant_id: merchantId },
      relations: { user: true },
    });
    return members;
  }

  async findOne(merchantId: number, userId: number) {
    return this.merchantMemberRepository.findOne({
      where: { merchant_id: merchantId, user_id: userId },
      relations: { user: true },
    });
  }

  async remove(merchantId: number, userId: number) {
    await this.merchantMemberRepository.delete({
      merchant_id: merchantId,
      user_id: userId,
    });
  }
}
