import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  short_description?: string;

  @IsOptional()
  @IsString()
  html_desc?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  podcast_url?: string;

  @IsOptional()
  @IsString()
  article_link?: string;

  @IsOptional()
  @IsString()
  news_website_name?: string;

  @IsOptional()
  @IsString()
  event_date?: string;

  @IsOptional()
  @IsBoolean()
  active_on_home?: boolean;

  @IsOptional()
  @IsNumber()
  post_category_id?: number;
}
