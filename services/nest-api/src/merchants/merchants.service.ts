import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from '../entities/merchant.entity';
import { MerchantMember } from '../entities/merchant-member.entity';
import { UpdateMerchantDto } from './dto/update-merchant.dto';

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
    @InjectRepository(MerchantMember)
    private merchantMemberRepository: Repository<MerchantMember>,
  ) {}

  async findByUserId(userId: number) {
    const merchantMember = await this.merchantMemberRepository.findOne({
      where: { user_id: userId },
      relations: { merchant: true },
    });

    if (!merchantMember) {
      throw new NotFoundException('Merchant not found for this user');
    }

    return merchantMember.merchant;
  }

  async updateByUserId(userId: number, updateMerchantDto: UpdateMerchantDto) {
    const merchant = await this.findByUserId(userId);
    
    Object.assign(merchant, updateMerchantDto);
    
    return this.merchantRepository.save(merchant);
  }
}
