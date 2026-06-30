import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request, Query, BadRequestException } from '@nestjs/common';
import { MerchantInvitationsService } from './merchant-invitations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MerchantAuthGuard } from '../auth/merchant-auth.guard';

@Controller('merchant-invitations')
export class MerchantInvitationsController {
  constructor(private readonly merchantInvitationsService: MerchantInvitationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, MerchantAuthGuard)
  create(@Request() req, @Body() body: { email: string; role: string }, @Query('merchantId') merchantId: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.merchantInvitationsService.create(
      parseInt(merchantId),
      body.email,
      body.role,
      req.user.userId,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, MerchantAuthGuard)
  findAll(@Request() req, @Query('merchantId') merchantId: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.merchantInvitationsService.findByMerchant(parseInt(merchantId));
  }

  @Get(':token')
  findByToken(@Param('token') token: string) {
    return this.merchantInvitationsService.findByToken(token);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard, MerchantAuthGuard)
  cancel(@Param('id') id: string, @Request() req, @Query('merchantId') merchantId: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.merchantInvitationsService.cancel(parseInt(id), parseInt(merchantId));
  }

  @Post(':id/resend')
  @UseGuards(JwtAuthGuard, MerchantAuthGuard)
  resend(@Param('id') id: string, @Request() req, @Query('merchantId') merchantId: string) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    return this.merchantInvitationsService.resend(parseInt(id), parseInt(merchantId));
  }

  @Post(':token/accept')
  @UseGuards(JwtAuthGuard)
  accept(@Param('token') token: string, @Request() req) {
    return this.merchantInvitationsService.accept(token, req.user.userId, req.user.email);
  }

  @Post(':token/accept-with-registration')
  acceptWithRegistration(@Param('token') token: string, @Body() userData: any) {
    return this.merchantInvitationsService.acceptWithRegistration(token, userData);
  }
}
