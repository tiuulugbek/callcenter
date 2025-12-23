import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KerioService } from './kerio.service';
import { KerioController } from './kerio.controller';
import { PrismaModule } from '../common/prisma/prisma.module';
import { CallsModule } from '../calls/calls.module';
import { WebSocketModule } from '../common/websocket/websocket.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    CallsModule,
    WebSocketModule,
  ],
  providers: [KerioService],
  controllers: [KerioController],
  exports: [KerioService],
})
export class KerioModule {}

