import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { WebSocketGateway } from '../common/websocket/websocket.gateway';

@Injectable()
export class ChatsService {
  constructor(
    private prisma: PrismaService,
    private wsGateway: WebSocketGateway,
  ) {}

  async findAll() {
    const chats = await this.prisma.chat.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    return chats;
  }

  async findById(id: string) {
    return this.prisma.chat.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async findOrCreateChat(channel: string, externalUserId: string, userName?: string) {
    let chat = await this.prisma.chat.findUnique({
      where: {
        channel_externalUserId: {
          channel,
          externalUserId,
        },
      },
    });

    if (!chat) {
      chat = await this.prisma.chat.create({
        data: {
          channel,
          externalUserId,
          userName,
        },
      });
    }

    return chat;
  }

  async createMessage(chatId: string, sender: string, message: string) {
    const newMessage = await this.prisma.message.create({
      data: {
        chatId,
        sender,
        message,
      },
      include: {
        chat: true,
      },
    });

    // Update chat updatedAt
    await this.prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    // Emit WebSocket event
    this.wsGateway.emitNewMessage({
      chatId,
      message: newMessage,
    });

    return newMessage;
  }

  async sendMessage(chatId: string, message: string, channel: string) {
    // Create message in database
    const dbMessage = await this.createMessage(chatId, 'operator', message);
    return dbMessage;
  }
}
