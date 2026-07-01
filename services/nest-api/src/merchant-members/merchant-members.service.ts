import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
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

  async remove(merchantId: number, userId: number, currentUserId: number, currentUserRole: string) {
    // Prevent owner/co-owner from deleting themselves
    if (userId === currentUserId) {
      throw new ForbiddenException('You cannot delete yourself from the store');
    }

    // Get the target member to check their role
    const targetMember = await this.merchantMemberRepository.findOne({
      where: { merchant_id: merchantId, user_id: userId },
    });

    if (!targetMember) {
      throw new BadRequestException('Staff member not found');
    }

    // Prevent manager from deleting owner/co-owner
    if (currentUserRole === 'manager' && (targetMember.role === 'owner' || targetMember.role === 'co-owner')) {
      throw new ForbiddenException('Managers cannot delete the owner or co-owner');
    }

    await this.merchantMemberRepository.delete({
      merchant_id: merchantId,
      user_id: userId,
    });
  }

  async updateRole(merchantId: number, userId: number, newRole: string, currentUserId: number, currentUserRole: string) {
    // Prevent owner/co-owner from modifying their own role
    if (userId === currentUserId) {
      throw new ForbiddenException('You cannot modify your own role');
    }

    // Get the target member to check their role
    const targetMember = await this.merchantMemberRepository.findOne({
      where: { merchant_id: merchantId, user_id: userId },
    });

    if (!targetMember) {
      throw new BadRequestException('Staff member not found');
    }

    // Prevent manager from modifying owner/co-owner's role
    if (currentUserRole === 'manager' && (targetMember.role === 'owner' || targetMember.role === 'co-owner')) {
      throw new ForbiddenException('Managers cannot modify the owner or co-owner');
    }

    // Update the role
    targetMember.role = newRole;
    await this.merchantMemberRepository.save(targetMember);
    
    return targetMember;
  }

  async updateStatus(merchantId: number, userId: number, newStatus: string, currentUserId: number, currentUserRole: string) {
    // Prevent owner/co-owner from modifying their own status
    if (userId === currentUserId) {
      throw new ForbiddenException('You cannot modify your own status');
    }

    // Get the target member to check their role
    const targetMember = await this.merchantMemberRepository.findOne({
      where: { merchant_id: merchantId, user_id: userId },
    });

    if (!targetMember) {
      throw new BadRequestException('Staff member not found');
    }

    // Prevent manager from modifying owner/co-owner's status
    if (currentUserRole === 'manager' && (targetMember.role === 'owner' || targetMember.role === 'co-owner')) {
      throw new ForbiddenException('Managers cannot modify the owner or co-owner');
    }

    // Update the merchant member status
    targetMember.status = newStatus;
    await this.merchantMemberRepository.save(targetMember);
    
    return targetMember;
  }
}
