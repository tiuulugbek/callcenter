import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ChatsService } from '../chats.service';
import * as crypto from 'crypto';

@Injectable()
export class FacebookService {
  private readonly logger = new Logger(FacebookService.name);
  private readonly pageAccessToken: string;
  private readonly appSecret: string;
  private readonly apiUrl: string = 'https://graph.facebook.com/v18.0';

  constructor(
    private configService: ConfigService,
    private chatsService: ChatsService,
  ) {
    this.pageAccessToken = this.configService.get('FACEBOOK_PAGE_ACCESS_TOKEN') || '';
    this.appSecret = this.configService.get('FACEBOOK_APP_SECRET') || '';
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!this.appSecret) {
      return true; // Skip verification if secret not set
    }

    const hash = crypto
      .createHmac('sha256', this.appSecret)
      .update(payload)
      .digest('hex');

    return hash === signature;
  }

  async handleWebhook(body: any, query: any) {
    // Webhook verification
    if (query['hub.mode'] === 'subscribe' && query['hub.verify_token']) {
      const verifyToken = this.configService.get('FACEBOOK_VERIFY_TOKEN') || 'verify_token';
      if (query['hub.verify_token'] === verifyToken) {
        return parseInt(query['hub.challenge']);
      }
      return 'Invalid verify token';
    }

    // Handle incoming messages
    if (body.entry) {
      for (const entry of body.entry) {
        if (entry.messaging) {
          for (const event of entry.messaging) {
            if (event.message && !event.message.is_echo) {
              await this.handleMessage(event);
            }
          }
        }
      }
    }

    return { status: 'ok' };
  }

  private async handleMessage(event: any) {
    const senderId = event.sender.id;
    const messageText = event.message.text || '';
    const userName = event.sender.name || 'Foydalanuvchi';

    this.logger.log(`Facebook message received: ${senderId} - ${messageText}`);

    // Determine channel (Instagram or Facebook)
    const channel = event.recipient?.id ? 'instagram' : 'facebook';

    // Find or create chat
    const chat = await this.chatsService.findOrCreateChat(channel, senderId, userName);

    // Save message
    await this.chatsService.createMessage(chat.id, 'mijoz', messageText);
  }

  async sendMessage(recipientId: string, text: string, channel: string = 'facebook') {
    try {
      const endpoint = channel === 'instagram' 
        ? `${this.apiUrl}/${recipientId}/messages`
        : `${this.apiUrl}/me/messages`;

      const payload = channel === 'instagram'
        ? {
            recipient: { id: recipientId },
            message: { text },
          }
        : {
            recipient: { id: recipientId },
            message: { text },
          };

      const response = await axios.post(endpoint, payload, {
        params: {
          access_token: this.pageAccessToken,
        },
      });

      return response.data;
    } catch (error) {
      this.logger.error(`Error sending ${channel} message:`, error);
      throw error;
    }
  }
}

