import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { WebSocketGateway } from '../common/websocket/websocket.gateway';

@Injectable()
export class AsteriskService {
  private readonly logger = new Logger(AsteriskService.name);
  private readonly ariUrl: string;
  private readonly ariUsername: string;
  private readonly ariPassword: string;

  constructor(
    private configService: ConfigService,
    private wsGateway: WebSocketGateway,
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

  async makeOutboundCall(data: { fromNumber: string; toNumber: string; extension?: string }) {
    try {
      const ari = this.getAriClient();
      const app = 'call-center';
      
      // Originate call via ARI
      const response = await ari.post(`/channels`, {
        endpoint: `PJSIP/${data.toNumber}@trunk`,
        app: app,
        appArgs: `outbound,${data.fromNumber},${data.toNumber}`,
        callerId: data.fromNumber,
      });

      return {
        success: true,
        channelId: response.data.id,
        message: 'Qo\'ng\'iroq boshlanmoqda',
      };
    } catch (error) {
      this.logger.error('Outbound call error:', error);
      throw error;
    }
  }

  async handleStasisStart(event: any, callsService: any) {
    const channelId = event.channel.id;
    const callId = event.args?.[0] || event.channel.id;
    const direction = event.args?.[1] || 'kiruvchi';
    const fromNumber = event.args?.[2] || event.channel.caller?.number || event.channel.caller?.name || 'Noma\'lum';
    const toNumber = event.args?.[3] || event.channel.dialplan?.exten || event.channel.connected?.number || 'Noma\'lum';

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
    if (callsService) {
      try {
        const call = await callsService.create({
          direction,
          fromNumber,
          toNumber,
          callId,
          recordingPath: `/var/spool/asterisk/recordings/call_${callId}.wav`,
        });

        this.logger.log(`Call record created: ${call.id}`);

        // Emit WebSocket event
        this.wsGateway.emitIncomingCall({
          callId: call.id,
          fromNumber,
          toNumber,
          direction,
          startTime: call.startTime,
        });

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
    const callId = event.channel.id;

    this.logger.log(`ChannelDestroyed: ${channelId}, CallId: ${callId}`);

    // Update call record
    if (callsService) {
      try {
        const endTime = new Date();
        const call = await callsService.updateByCallId(callId, {
          endTime,
          status: 'tugadi',
        });

        if (call) {
          // Calculate duration
          const duration = Math.floor((endTime.getTime() - call.startTime.getTime()) / 1000);
          await callsService.update(call.id, {
            duration,
          });

          this.logger.log(`Call record updated: ${call.id}, Duration: ${duration}s`);
        } else {
          this.logger.warn(`Call record not found for callId: ${callId}`);
        }
      } catch (error: any) {
        this.logger.error('Error updating call record:', error.message || error);
      }
    }
    
    this.wsGateway.emitCallStatus({
      channelId,
      state: 'Hangup',
    });
  }
}
