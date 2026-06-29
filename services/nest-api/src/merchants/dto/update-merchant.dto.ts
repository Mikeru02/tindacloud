import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateMerchantDto {
  @IsString()
  @IsOptional()
  store_type?: string;

  @IsString()
  @IsOptional()
  store_name?: string;

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

  @IsString()
  @IsOptional()
  operating_hours?: string;
}
