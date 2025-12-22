import { Controller, Get, Post, Param, Body, UseGuards, Query, Logger } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { TelegramService } from './integrations/telegram.service';
import { FacebookService } from './integrations/facebook.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chats')
export class ChatsController {
  private readonly logger = new Logger(ChatsController.name);

  constructor(
    private chatsService: ChatsService,
    private telegramService: TelegramService,
    private facebookService: FacebookService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.chatsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/messages')
  findMessages(@Param('id') id: string) {
    return this.chatsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/send')
  async sendMessage(
    @Param('id') id: string,
    @Body() body: { message: string },
  ) {
    const chat = await this.chatsService.findById(id);
    if (!chat) {
      throw new Error('Chat topilmadi');
    }

    // Send message via appropriate channel
    if (chat.channel === 'telegram') {
      await this.telegramService.sendMessage(chat.externalUserId, body.message);
    } else if (chat.channel === 'instagram' || chat.channel === 'facebook') {
      await this.facebookService.sendMessage(chat.externalUserId, body.message, chat.channel);
    }

    return this.chatsService.createMessage(id, 'operator', body.message);
  }

  // Webhook endpoints (no auth required)
  @Post('webhook/telegram')
  async telegramWebhook(@Body() body: any) {
    this.logger.log('Telegram webhook received:', JSON.stringify(body));
    try {
      return await this.telegramService.handleWebhook(body);
    } catch (error) {
      this.logger.error('Telegram webhook error:', error);
      return { ok: false, error: error.message };
    }
  }

  @Post('webhook/facebook')
  async facebookWebhook(@Body() body: any, @Query() query: any) {
    return this.facebookService.handleWebhook(body, query);
  }
}
