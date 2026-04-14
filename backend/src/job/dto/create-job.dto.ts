import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  title_en?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  description_en?: string;

  @IsNumber()
  @IsOptional()
  vacancies?: number;

  @IsString()
  @IsOptional()
  locations?: string;

  @IsString()
  @IsOptional()
  deadline?: string;

  @IsNumber()
  @IsOptional()
  from_salary?: number;

  @IsNumber()
  @IsOptional()
  to_salary?: number;

  @IsBoolean()
  @IsOptional()
  is_negotiable?: boolean;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsArray()
  @IsOptional()
  attribute_ids?: number[];
}
