import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  store_type: string;

  @IsString()
  store_name: string;

  @IsString()
  @IsOptional()
  store_description?: string;

  @IsString()
  @IsOptional()
  store_address?: string;

  @IsString()
  @IsOptional()
  store_phone?: string;

  @IsString()
  @IsOptional()
  store_email?: string;

  @IsBoolean()
  @IsOptional()
  publicity?: boolean;

  @IsOptional()
  notification_settings?: Record<string, boolean>;
}
