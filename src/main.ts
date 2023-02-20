if (!process.env.DEV_MODE) {
  require('module-alias/register');
}
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './@core/filters/exception-filter';
import { exceptionFactory } from './@core/utils/custom-exception-factory';
import { DataSource } from 'typeorm';

const PORT = process.env.PORT;

export let dataSource: DataSource;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.set('trust proxy', 1);
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory,
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());

  dataSource = app.get(DataSource);

  await app.listen(PORT || 8000, '0.0.0.0');
}

bootstrap();
