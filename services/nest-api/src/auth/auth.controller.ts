import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Put('password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.authService.updatePassword(req.user.userId, updatePasswordDto);
  }
}
