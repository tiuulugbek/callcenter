import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as WebSocket from 'ws';
import { AsteriskService } from './asterisk.service';
import { CallsService } from '../calls/calls.service';

@Injectable()
export class AsteriskGateway implements OnModuleInit {
  private readonly logger = new Logger(AsteriskGateway.name);
  private ws: WebSocket;
  private reconnectInterval: NodeJS.Timeout;
  private readonly ariUrl: string;
  private readonly ariUsername: string;
  private readonly ariPassword: string;
  private callsService: CallsService;

  constructor(
    private configService: ConfigService,
    private asteriskService: AsteriskService,
    private moduleRef: ModuleRef,
  ) {
    const rawUrl = this.configService.get('ASTERISK_ARI_WS_URL') || 'ws://127.0.0.1:8088/ari/events';
    this.ariUrl = rawUrl.replace('localhost', '127.0.0.1').replace(/\/+$/, '');
    this.ariUsername = (this.configService.get('ASTERISK_ARI_USERNAME') || 'backend').trim().replace(/['"]/g, '');
    this.ariPassword = (this.configService.get('ASTERISK_ARI_PASSWORD') || 'secure_password').trim().replace(/['"]/g, '');
  }

  async onModuleInit() {
    // Resolve CallsService lazily to avoid circular dependency
    try {
      this.callsService = this.moduleRef.get(CallsService, { strict: false });
    } catch (error) {
      this.logger.warn('CallsService not available yet, will retry later');
    }
    await this.connect();
  }

  private async connect() {
    try {
      this.logger.log(`Connecting to ARI at ${this.ariUrl} with user: "${this.ariUsername}", pass_len: ${this.ariPassword.length}`);
      const url = `${this.ariUrl}?app=call-center&api_key=${this.ariUsername}:${this.ariPassword}`;
      this.ws = new WebSocket(url);

      this.ws.on('open', () => {
        this.logger.log('Connected to Asterisk ARI WebSocket');
        if (this.reconnectInterval) {
          clearInterval(this.reconnectInterval);
        }
      });

      this.ws.on('message', (data: WebSocket.Data) => {
        try {
          const event = JSON.parse(data.toString());
          this.handleEvent(event);
        } catch (error) {
          this.logger.error('Error parsing ARI event:', error);
        }
      });

      this.ws.on('error', (error) => {
        this.logger.error('ARI WebSocket error:', error);
      });

      this.ws.on('close', () => {
        this.logger.warn('ARI WebSocket closed, reconnecting...');
        this.scheduleReconnect();
      });
    } catch (error) {
      this.logger.error('Failed to connect to ARI:', error);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectInterval) {
      return;
    }
    this.reconnectInterval = setInterval(() => {
      this.connect();
    }, 5000);
  }

  private async handleEvent(event: any) {
    const eventType = event.type;

    // Resolve CallsService if not available
    if (!this.callsService) {
      try {
        this.callsService = this.moduleRef.get(CallsService, { strict: false });
      } catch (error) {
        this.logger.error('CallsService not available:', error);
        return;
      }
    }

    switch (eventType) {
      case 'StasisStart':
        await this.asteriskService.handleStasisStart(event);
        break;
      case 'ChannelStateChange':
        await this.asteriskService.handleChannelStateChange(event);
        break;
      case 'ChannelDestroyed':
        await this.asteriskService.handleChannelDestroyed(event);
        break;
      default:
        // Other events can be handled here
        break;
    }
  }
}

