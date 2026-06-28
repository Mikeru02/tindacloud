import { Controller, Get, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { MerchantMembersService } from './merchant-members.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('merchant-members')
@UseGuards(JwtAuthGuard)
export class MerchantMembersController {
  constructor(private readonly merchantMembersService: MerchantMembersService) {}

  @Get()
  findAll(@Request() req) {
    const merchantId = req.user.merchantId;
    return this.merchantMembersService.findAll(merchantId);
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string, @Request() req) {
    const merchantId = req.user.merchantId;
    return this.merchantMembersService.findOne(merchantId, +userId);
  }

  @Delete(':userId')
  remove(@Param('userId') userId: string, @Request() req) {
    const merchantId = req.user.merchantId;
    return this.merchantMembersService.remove(merchantId, +userId);
  }
}
