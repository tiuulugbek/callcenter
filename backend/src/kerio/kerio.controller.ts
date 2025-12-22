import { Controller, Get, Post, Query, Param } from '@nestjs/common';
import { KerioService } from './kerio.service';

@Controller('kerio')
export class KerioController {
  constructor(private readonly kerioService: KerioService) {}

  /**
   * Kerio Operator autentifikatsiyasini tekshirish
   */
  @Get('auth/verify')
  async verifyAuth() {
    const isAuthenticated = await this.kerioService.authenticate();
    return {
      authenticated: isAuthenticated,
      message: isAuthenticated
        ? 'Kerio Operator ga muvaffaqiyatli ulandi'
        : 'Kerio Operator ga ulanib bo\'lmadi',
    };
  }

  /**
   * Call records ni sync qilish
   */
  @Post('sync')
  async syncCalls(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('extension') extension?: string,
  ) {
    const params: any = {};

    if (startDate) {
      params.startDate = new Date(startDate);
    }
    if (endDate) {
      params.endDate = new Date(endDate);
    }
    if (extension) {
      params.extension = extension;
    }

    const syncedCount = await this.kerioService.syncCallRecords(params);

    return {
      success: true,
      message: `${syncedCount} ta qo'ng'iroq ma'lumotlari yangilandi`,
      syncedCount,
    };
  }

  /**
   * Call recording ni olish
   */
  @Get('calls/:pbxCallId/recording')
  async getRecording(@Param('pbxCallId') pbxCallId: string) {
    const recording = await this.kerioService.getCallRecording(pbxCallId);

    if (!recording) {
      return {
        success: false,
        message: 'Yozuv topilmadi',
      };
    }

    return {
      success: true,
      recording: recording.toString('base64'),
    };
  }
}

