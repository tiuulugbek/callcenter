import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { WebSocketGateway } from '../common/websocket/websocket.gateway';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AsteriskService {
  private readonly logger = new Logger(AsteriskService.name);
  private readonly ariUrl: string;
  private readonly ariUsername: string;
  private readonly ariPassword: string;

  constructor(
    private configService: ConfigService,
    private wsGateway: WebSocketGateway,
    private prisma: PrismaService,
  ) {
    this.ariUrl = this.configService.get('ASTERISK_ARI_URL') || 'http://localhost:8088/ari';
    this.ariUsername = this.configService.get('ASTERISK_ARI_USERNAME') || 'backend';
    this.ariPassword = this.configService.get('ASTERISK_ARI_PASSWORD') || 'secure_password';
  }

  private getAriClient() {
    return axios.create({
      baseURL: this.ariUrl,
      auth: {
        username: this.ariUsername,
        password: this.ariPassword,
      },
    });
  }

  async makeOutboundCall(data: { fromNumber: string; toNumber: string; extension?: string; trunkName?: string }) {
    try {
      const ari = this.getAriClient();
      const app = 'call-center';
      
      // Trunk nomini aniqlash
      let trunkName = data.trunkName;
      
      // Agar trunk nomi berilmagan bo'lsa, database dan birinchi faol trunk ni topish
      if (!trunkName) {
        try {
          const trunks = await this.prisma.sipTrunk.findMany({
            take: 1,
            orderBy: { createdAt: 'desc' },
          });
          
          if (trunks.length > 0) {
            // Trunk nomini tozalash (bo'sh joylarni olib tashlash)
            trunkName = trunks[0].name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9-]/g, '');
            this.logger.log(`Using trunk from database: ${trunkName}`);
          } else {
            // Default trunk nomi
            trunkName = 'SIPnomer';
            this.logger.warn(`No trunk found in database, using default: ${trunkName}`);
          }
        } catch (error: any) {
          // Default trunk nomi
          trunkName = 'SIPnomer';
          this.logger.warn(`Error fetching trunk from database, using default: ${trunkName}, error: ${error.message}`);
        }
      }
      
      // Format: Local/number@context - dialplan orqali qo'ng'iroq qilish
      // Bu yaxshiroq, chunki dialplan trunk ni avtomatik aniqlaydi va Stasis orqali boshqaradi
      const endpoint = `Local/${data.toNumber}@outbound`;
      
      this.logger.log(`Originating call: ${endpoint}, From: ${data.fromNumber}, To: ${data.toNumber}, Trunk: ${trunkName}`);
      
      // Originate call via ARI (dialplan orqali)
      const response = await ari.post(`/channels`, {
        endpoint: endpoint,
        app: app,
        appArgs: `chiquvchi,${data.fromNumber},${data.toNumber}`,
        callerId: data.fromNumber,
        timeout: 30,
      });

      this.logger.log(`Call originated: ${response.data.id}`);

      return {
        success: true,
        channelId: response.data.id,
        trunkName: trunkName,
        message: 'Qo\'ng\'iroq boshlanmoqda',
      };
    } catch (error: any) {
      this.logger.error('Outbound call error:', error.response?.data || error.message || error);
      throw new Error(`Qo'ng'iroq boshlashda xatolik: ${error.response?.data?.message || error.message || 'Noma\'lum xatolik'}`);
    }
  }

  async handleStasisStart(event: any, callsService: any) {
    const channelId = event.channel.id;
    
    // Parse event args - format: [callId, direction, fromNumber, toNumber]
    // Agar args[0] bo'sh bo'lsa yoki callId bo'lmasa, channelId ni ishlatamiz
    const args = event.args || [];
    let callId = args[0];
    let direction = args[1];
    let fromNumber = args[2];
    let toNumber = args[3];
    
    // Agar callId bo'sh bo'lsa yoki yo'q bo'lsa, channelId ni ishlatamiz
    if (!callId || callId === '') {
      callId = channelId;
    }
    
    // Agar direction yo'q bo'lsa yoki raqam bo'lsa (noto'g'ri parse), dialplan dan olamiz
    if (!direction || direction.match(/^\d+$/)) {
      // Dialplan app_data dan parse qilish
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
    this.logger.log(`Event args: ${JSON.stringify(event.args)}`);
    this.logger.log(`Channel caller: ${JSON.stringify(event.channel.caller)}`);
    this.logger.log(`Channel dialplan: ${JSON.stringify(event.channel.dialplan)}`);

    // Answer the channel
    try {
      const ari = this.getAriClient();
      await ari.post(`/channels/${channelId}/answer`);
      this.logger.log(`Channel ${channelId} answered`);
      
      // Start recording
      await ari.post(`/channels/${channelId}/record`, {
        name: `call_${callId}`,
        format: 'wav',
        maxDurationSeconds: 3600,
      });
      this.logger.log(`Recording started for ${channelId}`);
    } catch (error: any) {
      this.logger.error('Error handling StasisStart:', error.message || error);
    }

    // Create call record via injected service
    // Upsert ishlatamiz - agar callId mavjud bo'lsa yangilash, yo'q bo'lsa yaratish
    if (callsService) {
      try {
        const recordingPath = `/var/spool/asterisk/recordings/call_${callId}.wav`;
        // Upsert ishlatamiz - bu 409 Conflict muammosini hal qiladi
        const call = await callsService.create({
          direction,
          fromNumber,
          toNumber,
          callId,
          recordingPath,
          startTime: new Date(),
          status: 'javob berildi',
        });

        this.logger.log(`Call record created: ${call.id}, Direction: ${direction}, From: ${fromNumber}, To: ${toNumber}`);

        // Emit WebSocket event
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
            state: 'suhbatda',
          });
        }

        return call;
      } catch (error: any) {
        this.logger.error('Error creating call record:', error.message || error);
        throw error;
      }
    } else {
      this.logger.error('CallsService not available');
    }
  }

  async handleChannelStateChange(event: any) {
    const channelId = event.channel.id;
    const state = event.channel.state;

    this.logger.log(`ChannelStateChange: ${channelId}, State: ${state}`);

    // Emit status update
    this.wsGateway.emitCallStatus({
      channelId,
      state,
    });
  }

  async handleChannelDestroyed(event: any, callsService: any) {
    const channelId = event.channel.id;
    const callId = event.channel.id || event.channel.name?.split('-')[0] || channelId;

    this.logger.log(`ChannelDestroyed: ${channelId}, CallId: ${callId}`);

    // Update call record
    if (callsService) {
      try {
        const endTime = new Date();
        
        // Find call by callId
        const call = await callsService.updateByCallId(callId, {
          endTime,
          status: 'yakunlandi',
        });

        if (call) {
          // Calculate duration
          const duration = Math.floor((endTime.getTime() - new Date(call.startTime).getTime()) / 1000);
          await callsService.update(call.id, {
            duration: duration > 0 ? duration : 0,
            status: 'yakunlandi',
          });

          this.logger.log(`Call record updated: ${call.id}, Duration: ${duration}s`);
          
          // Emit WebSocket event
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
    }
    
    this.wsGateway.emitCallStatus({
      channelId,
      state: 'yakunlandi',
    });
  }
}
