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
    const fromNumber = event.channel.caller.number || event.channel.caller.name;
    const toNumber = event.channel.dialplan.exten || event.channel.connected.number;

    this.logger.log(`StasisStart: ${channelId}, CallId: ${callId}, Direction: ${direction}`);

    // Answer the channel
    try {
      const ari = this.getAriClient();
      await ari.post(`/channels/${channelId}/answer`);
      
      // Start recording
      await ari.post(`/channels/${channelId}/record`, {
        name: `call_${callId}`,
        format: 'wav',
        maxDurationSeconds: 3600,
      });
    } catch (error) {
      this.logger.error('Error handling StasisStart:', error);
    }

    // Create call record via injected service
    if (callsService) {
      const call = await callsService.create({
        direction,
        fromNumber,
        toNumber,
        callId,
        recordingPath: `/var/spool/asterisk/recordings/call_${callId}.wav`,
      });

      // Emit WebSocket event
      this.wsGateway.emitIncomingCall({
        callId: call.id,
        fromNumber,
        toNumber,
        direction,
        startTime: call.startTime,
      });

      return call;
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

  async handleChannelDestroyed(event: any) {
    const channelId = event.channel.id;
    const callId = event.channel.id; // You might need to store mapping

    this.logger.log(`ChannelDestroyed: ${channelId}`);

    // Update call record
    const endTime = new Date();
    // You'll need to find the call by callId or channelId
    // This is simplified - you might need to store channel->callId mapping
    
    this.wsGateway.emitCallStatus({
      channelId,
      state: 'Hangup',
    });
  }
}
