import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MerchantInvitation } from '../entities/merchant-invitation.entity';
import { MerchantMember } from '../entities/merchant-member.entity';
import { User } from '../entities/user.entity';
import { Merchant } from '../entities/merchant.entity';
import { EmailService } from '../email/email.service';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MerchantInvitationsService {
  constructor(
    @InjectRepository(MerchantInvitation)
    private merchantInvitationRepository: Repository<MerchantInvitation>,
    @InjectRepository(MerchantMember)
    private merchantMemberRepository: Repository<MerchantMember>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
    private emailService: EmailService,
  ) {}

  async create(merchantId: number, email: string, role: string, invitedBy: number) {
    // Check if email already belongs to this merchant
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (user) {
      const existingMember = await this.merchantMemberRepository.findOne({
        where: { merchant_id: merchantId, user_id: user.id },
      });

      if (existingMember) {
        throw new BadRequestException('User is already a member of this merchant');
      }
    }

    // Check for existing pending invitation
    const existingInvitation = await this.merchantInvitationRepository.findOne({
      where: { merchant_id: merchantId, email, status: 'pending' },
    });

    if (existingInvitation) {
      throw new BadRequestException('A pending invitation already exists for this email');
    }

    // Get merchant details for email
    const merchant = await this.merchantRepository.findOne({ where: { id: merchantId } });
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    // Generate secure random token
    const token = randomBytes(32).toString('hex');

    // Set expiration to 7 days from now
    const expireAt = new Date();
    expireAt.setDate(expireAt.getDate() + 7);

    const invitation = this.merchantInvitationRepository.create({
      merchant_id: merchantId,
      email,
      role,
      token,
      expire_at: expireAt,
      status: 'pending',
      invited_by: invitedBy,
    });

    const savedInvitation = await this.merchantInvitationRepository.save(invitation);

    // Send invitation email
    try {
      await this.emailService.sendInvitationEmail(email, token, merchant.store_name, role);
    } catch (error) {
      console.error('Failed to send invitation email:', error);
      // Don't throw error - invitation is still created
    }

    return savedInvitation;
  }

  async findByToken(token: string) {
    const invitation = await this.merchantInvitationRepository.findOne({
      where: { token },
      relations: { merchant: true },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    // Check if invitation is expired
    if (new Date() > invitation.expire_at) {
      await this.merchantInvitationRepository.update(invitation.id, { status: 'expired' });
      throw new BadRequestException('Invitation has expired');
    }

    // Check if invitation is still pending
    if (invitation.status !== 'pending') {
      throw new BadRequestException(`Invitation is ${invitation.status}`);
    }

    return invitation;
  }

  async cancel(id: number, merchantId: number) {
    const invitation = await this.merchantInvitationRepository.findOne({
      where: { id, merchant_id: merchantId },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== 'pending') {
      throw new BadRequestException('Can only cancel pending invitations');
    }

    await this.merchantInvitationRepository.update(id, {
      status: 'cancelled',
      cancelled_at: new Date(),
    });

    return { message: 'Invitation cancelled successfully' };
  }

  async resend(id: number, merchantId: number) {
    const invitation = await this.merchantInvitationRepository.findOne({
      where: { id, merchant_id: merchantId },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== 'pending') {
      throw new BadRequestException('Can only resend pending invitations');
    }

    // Get merchant details for email
    const merchant = await this.merchantRepository.findOne({ where: { id: merchantId } });
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    // Generate new expiration date (7 days from now)
    const expireAt = new Date();
    expireAt.setDate(expireAt.getDate() + 7);

    await this.merchantInvitationRepository.update(id, {
      expire_at: expireAt,
    });

    // Send invitation email again
    try {
      await this.emailService.sendInvitationEmail(invitation.email, invitation.token, merchant.store_name, invitation.role);
    } catch (error) {
      console.error('Failed to resend invitation email:', error);
      // Don't throw error - invitation expiration is still updated
    }

    return { message: 'Invitation resent successfully' };
  }

  async findByMerchant(merchantId: number) {
    return this.merchantInvitationRepository.find({
      where: { merchant_id: merchantId },
      order: { created_at: 'DESC' },
    });
  }

  async accept(token: string, userId: number, userEmail: string) {
    const invitation = await this.findByToken(token);

    // Verify email matches
    if (invitation.email.toLowerCase() !== userEmail.toLowerCase()) {
      throw new BadRequestException('Email does not match invitation');
    }

    // Check if user is already a member
    const existingMember = await this.merchantMemberRepository.findOne({
      where: { merchant_id: invitation.merchant_id, user_id: userId },
    });

    if (existingMember) {
      throw new BadRequestException('User is already a member of this merchant');
    }

    // Create merchant member
    const merchantMember = this.merchantMemberRepository.create({
      merchant_id: invitation.merchant_id,
      user_id: userId,
      role: invitation.role,
    });

    await this.merchantMemberRepository.save(merchantMember);

    // Update invitation status
    await this.merchantInvitationRepository.update(invitation.id, {
      status: 'accepted',
      accepted_at: new Date(),
    });

    return { message: 'Invitation accepted successfully' };
  }

  async acceptWithRegistration(token: string, userData: any) {
    const invitation = await this.findByToken(token);

    // Verify email matches
    if (invitation.email.toLowerCase() !== userData.email.toLowerCase()) {
      throw new BadRequestException('Email does not match invitation');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Create user, merchant member, and update invitation in a transaction
    await this.merchantInvitationRepository.manager.transaction(async (transactionalEntityManager) => {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const user = transactionalEntityManager.create(User, {
        email: userData.email,
        password: hashedPassword,
        first_name: userData.first_name,
        last_name: userData.last_name,
      });
      const savedUser = await transactionalEntityManager.save(user);

      // Create merchant member
      const merchantMember = transactionalEntityManager.create(MerchantMember, {
        merchant_id: invitation.merchant_id,
        user_id: savedUser.id,
        role: invitation.role,
      });
      await transactionalEntityManager.save(merchantMember);

      // Update invitation
      await transactionalEntityManager.update(MerchantInvitation, invitation.id, {
        status: 'accepted',
        accepted_at: new Date(),
      });
    });

    return { message: 'Registration and invitation accepted successfully' };
  }
}
