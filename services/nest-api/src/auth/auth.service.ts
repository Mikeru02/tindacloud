import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Merchant } from '../entities/merchant.entity';
import { MerchantMember } from '../entities/merchant-member.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

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
    const { email, password, first_name, last_name, phone, store_name } = signupDto;

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
      store_name,
      publicity: false,
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
      merchant: {
        id: merchantMember.merchant.id,
        store_name: merchantMember.merchant.store_name,
        role: merchantMember.role,
      },
    };
  }
}
