import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AsteriskModule } from './asterisk/asterisk.module';
import { CallsModule } from './calls/calls.module';
import { ChatsModule } from './chats/chats.module';
import { OperatorsModule } from './operators/operators.module';
import { AuthModule } from './auth/auth.module';
import { SettingsModule } from './settings/settings.module';
import { ContactsModule } from './contacts/contacts.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { WebSocketModule } from './common/websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    WebSocketModule,
    CallsModule,
    AsteriskModule,
    ChatsModule,
    OperatorsModule,
    AuthModule,
    SettingsModule,
    ContactsModule,
  ],
})
export class AppModule {}
