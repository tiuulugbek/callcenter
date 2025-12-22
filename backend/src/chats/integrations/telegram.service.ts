import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ChatsService } from '../chats.service';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private botToken: string;
  private apiUrl: string;

  constructor(
    private configService: ConfigService,
    private chatsService: ChatsService,
  ) {
    this.botToken = this.configService.get('TELEGRAM_BOT_TOKEN') || '';
    this.updateApiUrl();
  }

  private updateApiUrl() {
    this.apiUrl = this.botToken ? `https://api.telegram.org/bot${this.botToken}` : '';
  }

  setBotToken(token: string) {
    this.botToken = token;
    this.updateApiUrl();
    this.logger.log('Telegram bot token yangilandi');
  }

  getBotToken(): string {
    return this.botToken || this.configService.get('TELEGRAM_BOT_TOKEN') || '';
  }

  async handleWebhook(update: any) {
    if (update.message) {
      const message = update.message;
      const chatId = message.chat.id.toString();
      const text = message.text || '';
      const userName = message.from.username || message.from.first_name || 'Foydalanuvchi';

      this.logger.log(`Telegram message received: ${chatId} - ${text}`);

      // Find or create chat
      const chat = await this.chatsService.findOrCreateChat('telegram', chatId, userName);

      // Save message
      await this.chatsService.createMessage(chat.id, 'mijoz', text);

      return { ok: true };
    }

    return { ok: true };
  }

  async sendMessage(chatId: string, text: string) {
    const token = this.getBotToken();
    if (!token) {
      throw new Error('Telegram bot token sozlanmagan');
    }
    const apiUrl = `https://api.telegram.org/bot${token}`;
    
    try {
      const response = await axios.post(`${apiUrl}/sendMessage`, {
        chat_id: chatId,
        text: text,
      });

      return response.data;
    } catch (error: any) {
      this.logger.error('Error sending Telegram message:', error.response?.data || error.message);
      throw error;
    }
  }

  async setWebhook(url: string, token?: string) {
    const botToken = token || this.getBotToken();
    if (!botToken) {
      throw new Error('Telegram bot token sozlanmagan');
    }
    const apiUrl = `https://api.telegram.org/bot${botToken}`;
    
    try {
      const response = await axios.post(`${apiUrl}/setWebhook`, {
        url: url,
      });

      this.logger.log(`Telegram webhook o'rnatildi: ${url}`);
      return response.data;
    } catch (error: any) {
      this.logger.error('Error setting Telegram webhook:', error.response?.data || error.message);
      throw error;
    }
  }
}

