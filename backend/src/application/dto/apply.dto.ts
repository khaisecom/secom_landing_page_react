import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ApplyDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  job_category_id: string;

  @IsString()
  @IsOptional()
  location?: string;
}
