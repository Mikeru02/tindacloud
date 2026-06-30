import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Merchant } from '../entities/merchant.entity';
import { MerchantMember } from '../entities/merchant-member.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
    @InjectRepository(MerchantMember)
    private merchantMemberRepository: Repository<MerchantMember>,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { 
      email, 
      password, 
      first_name, 
      last_name, 
      phone, 
      store_type,
      store_name,
      store_description,
      store_address,
      store_phone,
      store_email,
      publicity,
      notification_settings,
    } = signupDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      first_name,
      last_name,
      phone,
      status: 'active',
    });

    const savedUser = await this.userRepository.save(user);

    // Create merchant (store)
    const merchant = this.merchantRepository.create({
      store_type,
      store_name,
      store_description,
      store_address,
      store_phone,
      store_email,
      publicity: publicity ?? false,
      notification_settings: notification_settings ?? {
        email_orders: true,
        email_low_stock: true,
        email_inquiries: false,
        sms_urgent: false,
      },
    });

    const savedMerchant = await this.merchantRepository.save(merchant);

    // Create merchant member with owner role
    const merchantMember = this.merchantMemberRepository.create({
      merchant_id: savedMerchant.id,
      user_id: savedUser.id,
      role: 'owner',
    });

    await this.merchantMemberRepository.save(merchantMember);

    // Generate JWT token
    const payload = { sub: savedUser.id, email: savedUser.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        first_name: savedUser.first_name,
        last_name: savedUser.last_name,
      },
      merchant: {
        id: savedMerchant.id,
        store_name: savedMerchant.store_name,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get merchant membership
    const merchantMember = await this.merchantMemberRepository.findOne({
      where: { user_id: user.id },
      relations: { merchant: true },
    });

    if (!merchantMember) {
      throw new UnauthorizedException('User is not associated with any merchant');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    };
  }

  async updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto) {
    const { current_password, new_password } = updatePasswordDto;

    // Find user
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(current_password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(new_password, user.password);
    if (isSamePassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update password
    user.password = hashedPassword;
    await this.userRepository.save(user);

    return { message: 'Password updated successfully' };
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Don't return password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update only provided fields
    if (updateProfileDto.first_name !== undefined) {
      user.first_name = updateProfileDto.first_name;
    }
    if (updateProfileDto.last_name !== undefined) {
      user.last_name = updateProfileDto.last_name;
    }
    if (updateProfileDto.phone !== undefined) {
      user.phone = updateProfileDto.phone;
    }

    await this.userRepository.save(user);

    // Don't return password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
