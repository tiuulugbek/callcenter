import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebSocketGateway } from '../common/websocket/websocket.gateway';
import { CallsService } from '../calls/calls.service';

/**
 * AsteriskService - CTI Monitoring System
 * 
 * Bu tizim PBX emas, faqat monitoring/CTI tizimi.
 * Asterisk faqat ARI orqali event larni kuzatadi va loglaydi.
 * 
 * Qo'ng'iroqlar tashqi SIP server (bell.uz) orqali keladi.
 * Bu tizim qo'ng'iroqlarni boshlaydi yoki boshqarmaydi.
 */
@Injectable()
export class AsteriskService {
  private readonly logger = new Logger(AsteriskService.name);

  constructor(
    private configService: ConfigService,
    private wsGateway: WebSocketGateway,
    private callsService: CallsService,
  ) {}

  /**
   * StasisStart event - yangi qo'ng'iroq boshlanganda
   * Faqat call record yaratadi, qo'ng'iroqni javob bermaydi yoki boshqarmaydi
   */
  async handleStasisStart(event: any) {
    const channelId = event.channel.id;
    
    // Event args dan ma'lumotlarni olish
    const args = event.args || [];
    let callId = args[0];
    let direction = args[1];
    let fromNumber = args[2];
    let toNumber = args[3];
    
    // Agar callId bo'sh bo'lsa, channelId ni ishlatamiz
    if (!callId || callId === '') {
      callId = channelId;
    }
    
    // Agar direction yo'q bo'lsa, dialplan dan olamiz
    if (!direction || direction.match(/^\d+$/)) {
      const appData = event.channel.dialplan?.app_data || '';
      const appDataParts = appData.split(',');
      if (appDataParts.length >= 3) {
        direction = appDataParts[1] || 'kiruvchi';
        fromNumber = appDataParts[2] || fromNumber || event.channel.caller?.number || 'Noma\'lum';
        toNumber = appDataParts[3] || toNumber || event.channel.dialplan?.exten || 'Noma\'lum';
      } else {
        direction = direction || 'kiruvchi';
      }
    }
    
    // Fallback values
    fromNumber = fromNumber || event.channel.caller?.number || event.channel.caller?.name || 'Noma\'lum';
    toNumber = toNumber || event.channel.dialplan?.exten || event.channel.connected?.number || 'Noma\'lum';

    this.logger.log(`StasisStart: ${channelId}, CallId: ${callId}, Direction: ${direction}, From: ${fromNumber}, To: ${toNumber}`);

    // Faqat call record yaratish - qo'ng'iroqni javob bermaydi yoki boshqarmaydi
    try {
      const recordingPath = `/var/spool/asterisk/recordings/call_${callId}.wav`;
      
      const call = await this.callsService.create({
        direction,
        fromNumber,
        toNumber,
        callId: callId || channelId,
        recordingPath,
        startTime: new Date(),
        status: 'kelyapti',
      });

      this.logger.log(`Call record created: ${call.id}, CallId: ${call.callId}, Direction: ${direction}, From: ${fromNumber}, To: ${toNumber}`);

      // WebSocket event emit qilish
      if (direction === 'kiruvchi') {
        this.wsGateway.emitIncomingCall({
          callId: call.id,
          fromNumber,
          toNumber,
          direction,
          startTime: call.startTime.toISOString(),
          state: 'kelyapti',
        });
      } else {
        this.wsGateway.emitCallStatus({
          callId: call.id,
          state: 'kelyapti',
        });
      }

      return call;
    } catch (error: any) {
      this.logger.error('Error creating call record:', error.message || error);
      throw error;
    }
  }

  /**
   * ChannelStateChange event - channel holati o'zgarganda
   * Faqat call record ni yangilaydi
   */
  async handleChannelStateChange(event: any) {
    const channelId = event.channel.id;
    const state = event.channel.state;

    this.logger.log(`ChannelStateChange: ${channelId}, State: ${state}`);

    // Agar channel "Up" bo'lsa, qo'ng'iroq "suhbatda" deb belgilanadi
    if (state === 'Up') {
      try {
        // Call record ni topish va yangilash
        const call = await this.callsService.findByCallId(channelId);
        if (call) {
          await this.callsService.update(call.id, {
            status: 'suhbatda',
          });

          this.wsGateway.emitCallStatus({
            callId: call.id,
            state: 'suhbatda',
          });
        }
      } catch (error: any) {
        this.logger.debug(`Call record not found for channelId: ${channelId}`);
      }
    }

    // WebSocket event emit qilish
    this.wsGateway.emitCallStatus({
      channelId,
      state,
    });
  }

  /**
   * ChannelDestroyed event - qo'ng'iroq tugaganda
   * Faqat call record ni yangilaydi va duration ni hisoblaydi
   */
  async handleChannelDestroyed(event: any) {
    const channelId = event.channel.id;
    const callId = event.channel.id || event.channel.name?.split('-')[0] || channelId;

    this.logger.log(`ChannelDestroyed: ${channelId}, CallId: ${callId}`);

    // Call record ni yangilash
    try {
      const endTime = new Date();
      
      const call = await this.callsService.updateByCallId(callId, {
        endTime,
        status: 'yakunlandi',
      });

      if (call) {
        // Duration ni hisoblash
        const duration = Math.floor((endTime.getTime() - new Date(call.startTime).getTime()) / 1000);
        await this.callsService.update(call.id, {
          duration: duration > 0 ? duration : 0,
          status: 'yakunlandi',
        });

        this.logger.log(`Call record updated: ${call.id}, Duration: ${duration}s`);
        
        // WebSocket event emit qilish
        this.wsGateway.emitCallStatus({
          callId: call.id,
          state: 'yakunlandi',
        });
      } else {
        this.logger.warn(`Call record not found for callId: ${callId}`);
      }
    } catch (error: any) {
      this.logger.error('Error updating call record:', error.response?.data || error.message || error);
    }
    
    // WebSocket event emit qilish
    this.wsGateway.emitCallStatus({
      channelId,
      state: 'yakunlandi',
    });
  }
}
