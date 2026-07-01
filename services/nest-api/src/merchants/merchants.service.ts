import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from '../entities/merchant.entity';
import { MerchantMember } from '../entities/merchant-member.entity';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { CreateMerchantDto } from './dto/create-merchant.dto';

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

  async findAllByUserId(userId: number) {
    const merchantMembers = await this.merchantMemberRepository.find({
      where: { user_id: userId },
      relations: { merchant: true },
    });

    return merchantMembers.map(mm => ({
      id: mm.merchant.id,
      store_name: mm.merchant.store_name,
      store_type: mm.merchant.store_type,
      role: mm.role,
      status: mm.status,
    }));
  }

  async updateByUserId(userId: number, updateMerchantDto: UpdateMerchantDto) {
    const merchant = await this.findByUserId(userId);

    Object.assign(merchant, updateMerchantDto);

    return this.merchantRepository.save(merchant);
  }

  async findOne(id: string) {
    const merchant = await this.merchantRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    return merchant;
  }

  async update(id: string, updateMerchantDto: UpdateMerchantDto) {
    const merchant = await this.findOne(id);

    Object.assign(merchant, updateMerchantDto);

    return this.merchantRepository.save(merchant);
  }

  async create(userId: number, createMerchantDto: CreateMerchantDto) {
    const merchant = this.merchantRepository.create(createMerchantDto);
    const savedMerchant = await this.merchantRepository.save(merchant);

    // Automatically add the creator as an owner
    const merchantMember = this.merchantMemberRepository.create({
      user_id: userId,
      merchant_id: savedMerchant.id,
      role: 'owner',
    });
    await this.merchantMemberRepository.save(merchantMember);

    return {
      id: savedMerchant.id,
      store_name: savedMerchant.store_name,
      store_type: savedMerchant.store_type,
      role: 'owner',
    };
  }
}
