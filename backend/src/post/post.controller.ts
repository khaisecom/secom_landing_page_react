import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { PostService } from './post.service.js';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('categorySlug') categorySlug?: string,
  ) {
    return this.postService.findAll({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 9,
      search: search || '',
      type: type || '',
      categorySlug: categorySlug || '',
    });
  }

  @Get('featured')
  findFeatured() {
    return this.postService.findFeatured();
  }

  @Get('categories')
  getCategories() {
    return this.postService.getCategories();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.postService.findBySlug(slug);
  }

  @Post(':id/like')
  likePost(@Param('id') id: string) {
    return this.postService.likePost(parseInt(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROLE_ADMIN')
  @Post()
  create(@Body() dto: CreatePostDto, @Request() req: any) {
    return this.postService.create(dto, req.user.email);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROLE_ADMIN')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: CreatePostDto, @Request() req: any) {
    return this.postService.update(parseInt(id), dto, req.user.email);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROLE_ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(parseInt(id));
  }
}
