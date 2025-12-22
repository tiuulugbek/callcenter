import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KerioService } from './kerio.service';
import { KerioController } from './kerio.controller';
import { PrismaModule } from '../common/prisma/prisma.module';
import { CallsModule } from '../calls/calls.module';

@Module({
  imports: [ConfigModule, PrismaModule, CallsModule],
  providers: [KerioService],
  controllers: [KerioController],
  exports: [KerioService],
})
export class KerioModule {}

