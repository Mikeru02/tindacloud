import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MerchantsService } from './merchants.service';
import { UpdateMerchantDto } from './dto/update-merchant.dto';

@Controller('merchants')
@UseGuards(JwtAuthGuard)
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Get('me')
  async getMyMerchant(@Request() req) {
    return this.merchantsService.findByUserId(req.user.userId);
  }

  @Put('me')
  async updateMyMerchant(@Request() req, @Body() updateMerchantDto: UpdateMerchantDto) {
    return this.merchantsService.updateByUserId(req.user.userId, updateMerchantDto);
  }
}
