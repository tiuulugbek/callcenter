import { Module } from '@nestjs/common';
import { AsteriskService } from './asterisk.service';
import { AsteriskGateway } from './asterisk.gateway';
import { WebSocketModule } from '../common/websocket/websocket.module';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [WebSocketModule, PrismaModule],
  providers: [AsteriskService, AsteriskGateway],
  exports: [AsteriskService],
})
export class AsteriskModule {}
