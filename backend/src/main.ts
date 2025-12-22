import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { KerioService } from './kerio/kerio.service';

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

  // Kerio Operator avtomatik sync ni ishga tushirish
  try {
    const kerioService = app.get(KerioService);
    const syncInterval = parseInt(process.env.KERIO_SYNC_INTERVAL || '5', 10);
    kerioService.startAutoSync(syncInterval);
    console.log(`Kerio Operator auto-sync started (every ${syncInterval} minutes)`);
  } catch (error) {
    console.warn('Kerio Operator service not available:', error);
  }
}

bootstrap();

