import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TelegramService } from './integrations/telegram.service';
import { FacebookService } from './integrations/facebook.service';
import { WebSocketModule } from '../common/websocket/websocket.module';

@Module({
  imports: [WebSocketModule],
  providers: [ChatsService, TelegramService, FacebookService],
  controllers: [ChatsController],
  exports: [ChatsService],
})
export class ChatsModule {}

