import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SettingsService {
  constructor(
    private configService: ConfigService,
  ) {}

  async getSettings() {
    return {
      telegram: {
        botToken: this.configService.get('TELEGRAM_BOT_TOKEN') || '',
        webhookUrl: this.configService.get('TELEGRAM_WEBHOOK_URL') || '',
      },
      facebook: {
        pageAccessToken: this.configService.get('FACEBOOK_PAGE_ACCESS_TOKEN') || '',
        appSecret: this.configService.get('FACEBOOK_APP_SECRET') || '',
        verifyToken: this.configService.get('FACEBOOK_VERIFY_TOKEN') || '',
      },
    };
  }

  async updateTelegramSettings(botToken: string, webhookUrl?: string) {
    // Telegram webhook o'rnatish
    if (!botToken) {
      throw new Error('Bot token kiritilmagan');
    }

    // Webhook URL ni tayyorlash
    let finalWebhookUrl = webhookUrl;
    if (!finalWebhookUrl) {
      // Development uchun default webhook URL
      const backendUrl = this.configService.get('BACKEND_URL') || 'http://localhost:4000';
      finalWebhookUrl = `${backendUrl}/chats/webhook/telegram`;
    }

    try {
      // Webhook o'rnatish
      const response = await axios.post(
        `https://api.telegram.org/bot${botToken}/setWebhook`,
        {
          url: finalWebhookUrl,
        },
      );

      // TelegramService ga token ni yangilash (agar inject qilingan bo'lsa)
      // Bu yerda TelegramService ni inject qilish kerak, lekin circular dependency bo'lmasligi uchun
      // faqat webhook o'rnatamiz

      return {
        success: true,
        message: `Telegram webhook muvaffaqiyatli o'rnatildi: ${finalWebhookUrl}`,
        webhookUrl: finalWebhookUrl,
        data: response.data,
        note: 'Iltimos, backend .env faylida TELEGRAM_BOT_TOKEN ni yangilang va serverni qayta ishga tushiring',
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.description || error.message;
      throw new Error(`Telegram webhook o'rnatishda xatolik: ${errorMessage}`);
    }
  }

  async testTelegramConnection(botToken: string) {
    try {
      const response = await axios.get(`https://api.telegram.org/bot${botToken}/getMe`);
      return {
        success: true,
        bot: response.data.result,
      };
    } catch (error) {
      throw new Error(`Telegram ulanishi xatosi: ${error.message}`);
    }
  }
}

