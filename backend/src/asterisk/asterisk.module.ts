import { Module } from '@nestjs/common';
import { AsteriskService } from './asterisk.service';
import { AsteriskGateway } from './asterisk.gateway';
import { WebSocketModule } from '../common/websocket/websocket.module';
import { PrismaModule } from '../common/prisma/prisma.module';
import { SettingsModule } from '../settings/settings.module';
import { CallsModule } from '../calls/calls.module';

@Module({
  imports: [WebSocketModule, PrismaModule, SettingsModule, CallsModule],
  providers: [AsteriskService, AsteriskGateway],
  exports: [AsteriskService],
})
export class AsteriskModule {}
