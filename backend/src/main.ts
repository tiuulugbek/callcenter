import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4001',
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Backend server running on port ${port}`);

  // Kerio Operator logikasi endi faqat Settings sahifasidagi Kerio Operator tabida ishlatiladi
  // Avtomatik sync va polling o'chirildi - faqat qo'lda boshqariladi
}

bootstrap();

