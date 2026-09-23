import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ChatsService } from '../chats.service';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);
  private botToken: string;
  private apiUrl: string;
  private isPolling = false;
  private lastUpdateId = 0;
  private pollingTimeout: NodeJS.Timeout | null = null;

  constructor(
    private configService: ConfigService,
    private chatsService: ChatsService,
    private prisma: PrismaService,
  ) {
    this.botToken = this.configService.get('TELEGRAM_BOT_TOKEN') || '';
    this.updateApiUrl();
  }

  onModuleInit() {
    const webhookUrl = this.configService.get('TELEGRAM_WEBHOOK_URL');
    const enablePolling = this.configService.get('TELEGRAM_POLLING');

    // Agar webhook URL ko'rsatilmagan bo'lsa yoki TELEGRAM_POLLING=true bo'lsa, polling yoqiladi
    if (this.botToken && (!webhookUrl || enablePolling === 'true')) {
      this.logger.log('Telegram bot uchun Polling rejimi faollashmoqda...');
      this.startPolling();
    }
  }

  onModuleDestroy() {
    this.stopPolling();
  }

  private updateApiUrl() {
    this.apiUrl = this.botToken ? `https://api.telegram.org/bot${this.botToken}` : '';
  }

  setBotToken(token: string) {
    this.botToken = token;
    this.updateApiUrl();
    this.logger.log('Telegram bot token yangilandi');
    if (this.isPolling) {
      this.stopPolling();
      this.startPolling();
    }
  }

  getBotToken(): string {
    return this.botToken || this.configService.get('TELEGRAM_BOT_TOKEN') || '';
  }

  startPolling() {
    if (!this.botToken) return;
    this.isPolling = true;
    this.pollUpdates();
  }

  stopPolling() {
    this.isPolling = false;
    if (this.pollingTimeout) {
      clearTimeout(this.pollingTimeout);
      this.pollingTimeout = null;
    }
  }

  private async pollUpdates() {
    if (!this.isPolling || !this.apiUrl) return;

    try {
      const response = await axios.get(`${this.apiUrl}/getUpdates`, {
        params: {
          offset: this.lastUpdateId ? this.lastUpdateId + 1 : undefined,
          timeout: 25,
        },
        timeout: 30000,
      });

      if (response.data?.ok && Array.isArray(response.data.result)) {
        for (const update of response.data.result) {
          this.lastUpdateId = update.update_id;
          await this.handleWebhook(update);
        }
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        this.logger.warn('Telegram webhook faol. Polling uchun avval webhook o\'chirilishi kerak.');
      } else {
        this.logger.debug(`Telegram polling xatosi: ${error.message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    if (this.isPolling) {
      this.pollingTimeout = setTimeout(() => this.pollUpdates(), 1000);
    }
  }

  async handleWebhook(update: any) {
    if (update.message) {
      const message = update.message;
      const chatId = message.chat.id.toString();

      let text = message.text || '';
      let senderPhone: string | null = null;
      let matchedContactId: string | null = null;

      if (message.contact) {
        senderPhone = message.contact.phone_number;
        text = `📞 Telefon raqam: ${senderPhone}`;
      } else if (message.photo) {
        text = `📷 Rasm ${message.caption ? ': ' + message.caption : ''}`;
      } else if (message.voice) {
        text = '🎤 Ovozli xabar';
      } else if (message.document) {
        text = `📄 Hujjat: ${message.document.file_name || ''} ${message.caption ? ': ' + message.caption : ''}`;
      }

      if (!text) {
        text = '📎 Yangi xabar';
      }

      const userName =
        message.from.first_name || message.from.username
          ? `${message.from.first_name || ''} ${message.from.last_name || ''} ${message.from.username ? '(@' + message.from.username + ')' : ''}`.trim()
          : 'Telegram Foydalanuvchi';

      // Agar telefon yuborilgan bo'lsa, CRM kontaktga bog'lash
      if (senderPhone) {
        try {
          const cleanPhone = senderPhone.replace(/\D/g, '').slice(-9);
          let contact = await this.prisma.contact.findFirst({
            where: { phone: { contains: cleanPhone } },
          });

          if (!contact) {
            contact = await this.prisma.contact.create({
              data: {
                name: userName,
                phone: senderPhone,
                notes: 'Telegram orqali kelgan yangi mijoz',
              },
            });
          }
          matchedContactId = contact.id;
        } catch (err: any) {
          this.logger.warn(`Error linking contact: ${err.message}`);
        }
      }

      this.logger.log(`Telegram message received: ${chatId} - ${text}`);

      // Find or create chat
      const chat = await this.chatsService.findOrCreateChat('telegram', chatId, userName, matchedContactId || undefined);

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
    this.stopPolling();
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

  async deleteWebhook() {
    const token = this.getBotToken();
    if (!token) return;
    try {
      await axios.post(`https://api.telegram.org/bot${token}/deleteWebhook`);
      this.logger.log('Telegram webhook o\'chirildi. Polling rejimiga o\'tilmoqda.');
      this.startPolling();
    } catch (e: any) {
      this.logger.warn(`Failed to delete webhook: ${e.message}`);
    }
  }
}
