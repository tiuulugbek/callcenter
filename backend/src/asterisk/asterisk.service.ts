import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { WebSocketGateway } from '../common/websocket/websocket.gateway';
import { PrismaService } from '../common/prisma/prisma.service';
import { SipTrunkService } from '../settings/sip-trunk.service';
import { CallsService } from '../calls/calls.service';

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
    private sipTrunkService: SipTrunkService,
    private callsService: CallsService,
  ) {
    this.ariUrl = this.configService.get('ASTERISK_ARI_URL') || 'http://localhost:8088/ari';
    this.ariUsername = this.configService.get('ASTERISK_ARI_USERNAME') || 'backend';
    this.ariPassword = this.configService.get('ASTERISK_ARI_PASSWORD') || 'CallCenter2025';
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

  async handleStasisStart(event: any) {
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

    // Answer the channel va trunk orqali qo'ng'iroq qilish
    try {
      const ari = this.getAriClient();
      
      // Channel ni answer qilish
      await ari.post(`/channels/${channelId}/answer`);
      this.logger.log(`Channel ${channelId} answered`);
      
      // Agar chiquvchi qo'ng'iroq bo'lsa, trunk orqali qo'ng'iroq qilish
      if (direction === 'chiquvchi') {
        await this.handleOutboundCall(ari, channelId, callId, fromNumber, toNumber);
      }
      
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
      try {
        const recordingPath = `/var/spool/asterisk/recordings/call_${callId}.wav`;
      
      const call = await this.callsService.create({
          direction,
          fromNumber,
          toNumber,
        callId: callId || channelId,
          recordingPath,
          startTime: new Date(),
          status: 'javob berildi',
        });

      this.logger.log(`Call record created/updated: ${call.id}, CallId: ${call.callId}, Direction: ${direction}, From: ${fromNumber}, To: ${toNumber}`);

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

  private async handleOutboundCall(ari: any, channelId: string, callId: string, fromNumber: string, toNumber: string) {
    // Trunk nomini aniqlash
    let trunkName = 'SIPnomer';
    try {
      const trunks = await this.prisma.sipTrunk.findMany({
        take: 1,
        orderBy: { createdAt: 'desc' },
      });
      if (trunks.length > 0) {
        trunkName = trunks[0].name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9-]/g, '');
        this.logger.log(`Using trunk: ${trunkName}`);
      }
    } catch (error: any) {
      this.logger.warn(`Error fetching trunk, using default: ${trunkName}`);
    }

    // 1-usul: To'g'ridan-to'g'ri PJSIP endpoint orqali qo'ng'iroq qilish
    const outboundEndpoint = `PJSIP/${toNumber}@${trunkName}`;
    this.logger.log(`Originating outbound call via PJSIP: ${outboundEndpoint}, From: ${fromNumber}, To: ${toNumber}, Trunk: ${trunkName}`);

    let outboundChannelId: string | null = null;

    try {
      const pjsipResponse = await ari.post(`/channels`, {
        endpoint: outboundEndpoint,
        app: 'call-center',
        appArgs: `chiquvchi,${fromNumber},${toNumber}`,
        callerId: fromNumber,
        timeout: 30,
      });

      outboundChannelId = pjsipResponse.data.id;
      this.logger.log(`Outbound channel created via PJSIP: ${outboundChannelId}`);

      // Channel holatini kuzatish va kutish
      await this.waitForChannelReady(ari, outboundChannelId, 5000);

      // Bridge qilish
      await this.bridgeChannels(ari, channelId, outboundChannelId, callId);
    } catch (error: any) {
      const errorData = error.response?.data || error.message || error;
      this.logger.error(`Error originating outbound call via PJSIP: ${JSON.stringify(errorData)}`);

      // Fallback: Dialplan orqali qo'ng'iroq qilish
      this.logger.warn(`PJSIP endpoint failed, trying dialplan approach...`);
      try {
        const dialplanEndpoint = `Local/${toNumber}@outbound-trunk`;
        this.logger.log(`Trying dialplan endpoint: ${dialplanEndpoint}`);

        const dialplanResponse = await ari.post(`/channels`, {
          endpoint: dialplanEndpoint,
          app: 'call-center',
          appArgs: `chiquvchi,${fromNumber},${toNumber}`,
          callerId: fromNumber,
          timeout: 30,
          variables: {
            FROM_NUMBER: fromNumber,
            TO_NUMBER: toNumber,
            TRUNK_NAME: trunkName,
          },
        });

        outboundChannelId = dialplanResponse.data.id;
        this.logger.log(`Outbound channel created via dialplan: ${outboundChannelId}`);

        // Channel holatini kuzatish va kutish
        await this.waitForChannelReady(ari, outboundChannelId, 5000);

        // Bridge qilish
        await this.bridgeChannels(ari, channelId, outboundChannelId, callId);
      } catch (dialplanError: any) {
        const dialplanErrorData = dialplanError.response?.data || dialplanError.message || dialplanError;
        this.logger.error(`Dialplan approach also failed: ${JSON.stringify(dialplanErrorData)}`);
      }
    }
  }

  private async waitForChannelReady(ari: any, channelId: string, timeout: number = 5000): Promise<boolean> {
    const startTime = Date.now();
    let lastState = '';
    while (Date.now() - startTime < timeout) {
      try {
        const channelInfo = await ari.get(`/channels/${channelId}`);
        const state = channelInfo.data.state;
        if (state !== lastState) {
          this.logger.log(`Channel ${channelId} state: ${state}`);
          lastState = state;
        }
        if (state === 'Up' || state === 'Ring' || state === 'Ringing') {
          return true;
        }
        // Channel o'chib ketgan bo'lsa
        if (state === 'Down' || state === 'Rsrvd') {
          this.logger.warn(`Channel ${channelId} is ${state}, not ready`);
          return false;
        }
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error: any) {
        // Channel topilmasa, o'chib ketgan bo'lishi mumkin
        if (error.response?.status === 404) {
          this.logger.warn(`Channel ${channelId} not found (may be destroyed)`);
          return false;
        }
        this.logger.warn(`Channel check failed: ${error.response?.data?.message || error.message}`);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    this.logger.warn(`Channel ${channelId} not ready after ${timeout}ms`);
    return false;
  }

  private async bridgeChannels(ari: any, channelId1: string, channelId2: string | null, callId: string) {
    try {
      // Avval channel larni tekshirish - mavjudligini va holatini
      let channel1Exists = false;
      let channel2Exists = false;

      try {
        const channel1Info = await ari.get(`/channels/${channelId1}`);
        channel1Exists = true;
        this.logger.log(`Channel ${channelId1} exists, state: ${channel1Info.data.state}`);
      } catch (error: any) {
        this.logger.error(`Channel ${channelId1} not found: ${error.response?.data?.message || error.message}`);
        return;
      }

      if (channelId2) {
        try {
          const channel2Info = await ari.get(`/channels/${channelId2}`);
          channel2Exists = true;
          this.logger.log(`Channel ${channelId2} exists, state: ${channel2Info.data.state}`);
        } catch (error: any) {
          this.logger.error(`Channel ${channelId2} not found: ${error.response?.data?.message || error.message}`);
          channelId2 = null; // Ikkinchi channel yo'q bo'lsa, bridge qilishni bekor qilish
        }
      }

      if (!channel1Exists || (channelId2 && !channel2Exists)) {
        this.logger.warn(`Cannot bridge: channel1=${channel1Exists}, channel2=${channel2Exists}`);
        return;
      }

      // Avval mavjud bridge ni tekshirish
      let bridgeId: string | null = null;
      try {
        const bridges = await ari.get('/bridges');
        for (const bridge of bridges.data || []) {
          if (bridge.name === `bridge_${callId}`) {
            bridgeId = bridge.id;
            this.logger.log(`Using existing bridge: ${bridgeId}`);
            break;
          }
        }
      } catch (error: any) {
        // Ignore
      }

      // Agar bridge yo'q bo'lsa, yangi yaratish
      if (!bridgeId) {
        const bridgeResponse = await ari.post(`/bridges`, {
          type: 'mixing',
          name: `bridge_${callId}`,
        });
        bridgeId = bridgeResponse.data.id;
        this.logger.log(`Bridge created: ${bridgeId}`);
      }

      // Kichik kutish - bridge to'liq yaratilishi uchun
      await new Promise(resolve => setTimeout(resolve, 300));

      // Birinchi channel ni qo'shish
      try {
        await ari.post(`/bridges/${bridgeId}/addChannel`, { channel: channelId1 });
        this.logger.log(`Channel ${channelId1} added to bridge ${bridgeId}`);
      } catch (error: any) {
        const errorMsg = error.response?.data?.message || error.message || '';
        // Channel allaqachon bridge da bo'lishi mumkin
        if (!errorMsg.includes('already in bridge') && !errorMsg.includes('already in')) {
          this.logger.error(`Error adding channel ${channelId1} to bridge: ${JSON.stringify(error.response?.data || error.message)}`);
        } else {
          this.logger.log(`Channel ${channelId1} already in bridge`);
        }
      }

      // Ikkinchi channel ni qo'shish
      if (channelId2) {
        // Kichik kutish - birinchi channel qo'shilgandan keyin
        await new Promise(resolve => setTimeout(resolve, 300));
        
        try {
          await ari.post(`/bridges/${bridgeId}/addChannel`, { channel: channelId2 });
          this.logger.log(`Channel ${channelId2} added to bridge ${bridgeId}`);
          this.logger.log(`Channels bridged successfully: ${channelId1} <-> ${channelId2}`);
        } catch (error: any) {
          const errorMsg = error.response?.data?.message || error.message || '';
          // Channel allaqachon bridge da bo'lishi mumkin
          if (!errorMsg.includes('already in bridge') && !errorMsg.includes('already in')) {
            this.logger.error(`Error adding channel ${channelId2} to bridge: ${JSON.stringify(error.response?.data || error.message)}`);
          } else {
            this.logger.log(`Channel ${channelId2} already in bridge`);
          }
        }
      }
    } catch (error: any) {
      this.logger.error(`Error bridging channels: ${JSON.stringify(error.response?.data || error.message || error)}`);
    }
  }

  private async tryDirectPjsipEndpoint(ari: any, channelId: string, callId: string, fromNumber: string, toNumber: string, trunkName: string) {
    const outboundEndpoint = `PJSIP/${toNumber}@${trunkName}`;
    this.logger.log(`Trying direct PJSIP endpoint: ${outboundEndpoint}`);

    try {
      const outboundChannelResponse = await ari.post(`/channels`, {
        endpoint: outboundEndpoint,
        app: 'call-center',
        appArgs: `chiquvchi,${fromNumber},${toNumber}`,
        callerId: fromNumber,
        timeout: 30,
      });

      const outboundChannelId = outboundChannelResponse.data.id;
      this.logger.log(`Outbound channel created via PJSIP: ${outboundChannelId}`);

      await this.waitForChannelReady(ari, outboundChannelId, 5000);
      await this.bridgeChannels(ari, channelId, outboundChannelId, callId);
    } catch (error: any) {
      this.logger.error(`Direct PJSIP endpoint also failed: ${JSON.stringify(error.response?.data || error.message)}`);
    }
  }

  async handleChannelDestroyed(event: any) {
    const channelId = event.channel.id;
    const callId = event.channel.id || event.channel.name?.split('-')[0] || channelId;

    this.logger.log(`ChannelDestroyed: ${channelId}, CallId: ${callId}`);

    // Bridge ni topib o'chirish
    try {
      const ari = this.getAriClient();
      const bridges = await ari.get('/bridges');
      
      for (const bridge of bridges.data || []) {
        if (bridge.name === `bridge_${callId}` || bridge.name === 'bridge_chiquvchi') {
          try {
            const bridgeChannels = await ari.get(`/bridges/${bridge.id}/channels`);
            const channelIds = bridgeChannels.data || [];
            
            // Agar bridge da faqat bitta yoki hech channel qolmasa, bridge ni o'chirish
            if (channelIds.length <= 1) {
              await ari.delete(`/bridges/${bridge.id}`);
              this.logger.log(`Bridge ${bridge.id} destroyed (no channels left)`);
            }
          } catch (bridgeError: any) {
            // Bridge allaqachon o'chirilgan bo'lishi mumkin
            this.logger.debug(`Bridge ${bridge.id} already destroyed or not found`);
          }
        }
      }
    } catch (error: any) {
      this.logger.debug(`Error checking bridges: ${error.message}`);
    }

    // Update call record
    try {
      const endTime = new Date();
      
      const call = await this.callsService.updateByCallId(callId, {
        endTime,
        status: 'yakunlandi',
      });

      if (call) {
        const duration = Math.floor((endTime.getTime() - new Date(call.startTime).getTime()) / 1000);
        await this.callsService.update(call.id, {
          duration: duration > 0 ? duration : 0,
          status: 'yakunlandi',
        });

        this.logger.log(`Call record updated: ${call.id}, Duration: ${duration}s`);
        
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
    
    this.wsGateway.emitCallStatus({
      channelId,
      state: 'yakunlandi',
    });
  }
}
