import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { mkdirSync } from 'fs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ApplicationService } from './application.service.js';
import { ApplyDto } from './dto/apply.dto.js';

@Controller('applications')
export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROLE_ADMIN')
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.applicationService.findAll({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      search: search || '',
    });
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('cv', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const dir = join(process.env.ROOT_UPLOAD_DIR || './file_storage', 'secured');
          mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          const cleanName = file.originalname
            .replace(extname(file.originalname), '')
            .replace(/[^a-zA-Z0-9_\-\u00C0-\u024F\u1E00-\u1EFF]/g, '-');
          cb(null, `${cleanName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (file.mimetype.match(/\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)$/)) {
          cb(null, true);
        } else {
          cb(null, false);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  apply(
    @Body() dto: ApplyDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const cvUrl = file ? `/secured/${file.filename}` : undefined;
    return this.applicationService.apply(dto, cvUrl);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROLE_ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationService.remove(parseInt(id));
  }
}
