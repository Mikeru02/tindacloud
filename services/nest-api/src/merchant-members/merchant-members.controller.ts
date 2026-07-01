import { Controller, Get, Delete, Patch, Param, UseGuards, Request, Query, BadRequestException, Body } from '@nestjs/common';
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
    return this.merchantMembersService.remove(
      parseInt(merchantId), 
      +userId, 
      req.user.userId, 
      req.user.role
    );
  }

  @Patch(':userId/role')
  updateRole(
    @Param('userId') userId: string, 
    @Request() req, 
    @Query('merchantId') merchantId: string,
    @Body() body: { role: string }
  ) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    if (!body.role) {
      throw new BadRequestException('role is required');
    }
    return this.merchantMembersService.updateRole(
      parseInt(merchantId), 
      +userId, 
      body.role,
      req.user.userId, 
      req.user.role
    );
  }

  @Patch(':userId/status')
  updateStatus(
    @Param('userId') userId: string, 
    @Request() req, 
    @Query('merchantId') merchantId: string,
    @Body() body: { status: string }
  ) {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }
    if (!body.status) {
      throw new BadRequestException('status is required');
    }
    if (!['active', 'inactive'].includes(body.status)) {
      throw new BadRequestException('status must be either active or inactive');
    }
    return this.merchantMembersService.updateStatus(
      parseInt(merchantId), 
      +userId, 
      body.status,
      req.user.userId, 
      req.user.role
    );
  }
}
