import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Post('telegram')
  async updateTelegram(@Body() body: { botToken: string; webhookUrl?: string }) {
    return this.settingsService.updateTelegramSettings(body.botToken, body.webhookUrl);
  }

  @Post('telegram/test')
  async testTelegram(@Body() body: { botToken: string }) {
    return this.settingsService.testTelegramConnection(body.botToken);
  }

  @Post('facebook')
  async updateFacebook(@Body() body: { pageAccessToken: string; appSecret: string; verifyToken: string }) {
    // Facebook sozlamalarini yangilash
    // Eslatma: Bu faqat ma'lumotlarni qaytaradi, .env faylini o'zgartirmaydi
    return {
      success: true,
      message: 'Facebook sozlamalari yangilandi. Iltimos, .env faylini ham yangilang.',
    };
  }

  @Get('sip-extensions')
  getSipExtensions() {
    return this.settingsService.getSipExtensions();
  }

  @Post('sip-extensions')
  async createSipExtension(@Body() body: { operatorId: string; extension: string; password: string }) {
    return this.settingsService.createSipExtension(body.operatorId, body.extension, body.password);
  }

  @Get('sip-trunks')
  getSipTrunks() {
    return this.settingsService.getSipTrunks();
  }

  @Post('sip-trunks')
  async createSipTrunk(@Body() body: {
    name: string;
    host: string;
    username: string;
    password: string;
    port?: number;
    transport?: 'udp' | 'tcp' | 'tls';
  }) {
    return this.settingsService.createSipTrunk(body);
  }
}

