import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname } from 'path';
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
    @Query('sort') sort?: string,
  ) {
    return this.postService.findAll({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 9,
      search: search || '',
      type: type || '',
      categorySlug: categorySlug || '',
      sort: sort === 'asc' ? 'asc' : 'desc',
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
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './upload',
      filename: (_req, file, cb) => {
        const uuid = randomUUID();
        const ext = extname(file.originalname);
        cb(null, `${uuid}${ext}`);
      },
    }),
    fileFilter: (_req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'), false);
      }
    },
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return { url: `/upload/${file.filename}` };
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
