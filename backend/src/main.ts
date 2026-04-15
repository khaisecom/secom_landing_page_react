import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  const rootDir = process.env.ROOT_UPLOAD_DIR || join(process.cwd(), 'file_storage');
  app.useStaticAssets(join(rootDir, 'upload'), { prefix: '/upload' });
  app.useStaticAssets(join(rootDir, 'secured'), { prefix: '/secured' });
  app.useStaticAssets(join(process.cwd(), 'images'), { prefix: '/images' });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
