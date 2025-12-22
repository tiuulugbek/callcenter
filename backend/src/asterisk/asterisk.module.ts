import { Module } from '@nestjs/common';
import { AsteriskService } from './asterisk.service';
import { AsteriskGateway } from './asterisk.gateway';
import { WebSocketModule } from '../common/websocket/websocket.module';

@Module({
  imports: [WebSocketModule],
  providers: [AsteriskService, AsteriskGateway],
  exports: [AsteriskService],
})
export class AsteriskModule {}
