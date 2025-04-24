import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(graphqlUploadExpress({ maxFileSize: 10_000_000, maxFiles: 1 }));

  // Servir imágenes
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  await app.listen(3000);
}

bootstrap();
