import { Controller, Get, Delete, Param, UseGuards, Request, Query, BadRequestException } from '@nestjs/common';
import { MerchantMembersService } from './merchant-members.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MerchantAuthGuard } from '../auth/merchant-auth.guard';

@Controller('merchant-members')
@UseGuards(JwtAuthGuard, MerchantAuthGuard)
export class MerchantMembersController {
  constructor(private readonly merchantMembersService: MerchantMembersService) {}

  @Get()
  findAll(@Request() req, @Query('merchantId') merchantId: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.merchantMembersService.findAll(parseInt(merchantId));
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string, @Request() req, @Query('merchantId') merchantId: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.merchantMembersService.findOne(parseInt(merchantId), +userId);
  }

  @Delete(':userId')
  remove(@Param('userId') userId: string, @Request() req, @Query('merchantId') merchantId: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.merchantMembersService.remove(parseInt(merchantId), +userId);
  }
}
