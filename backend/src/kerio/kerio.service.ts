import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { PrismaService } from '../common/prisma/prisma.service';
import { CallsService } from '../calls/calls.service';
import { WebSocketGateway } from '../common/websocket/websocket.gateway';

export interface KerioCallRecord {
  id: string;
  direction: 'inbound' | 'outbound';
  fromNumber: string;
  toNumber: string;
  extension?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  status: 'answered' | 'no_answer' | 'busy' | 'failed';
  recordingPath?: string;
  pbxCallId: string;
  state?: 'kelyapti' | 'suhbatda' | 'yakunlandi' | 'javobsiz';
}

@Injectable()
export class KerioService {
  private readonly logger = new Logger(KerioService.name);
  private readonly apiClient: AxiosInstance;
  private readonly pbxHost: string;
  private readonly apiUsername: string;
  private readonly apiPassword: string;
  private syncInterval: NodeJS.Timeout | null = null;
  private pollInterval: NodeJS.Timeout | null = null;
  private activeCalls: Map<string, KerioCallRecord> = new Map();

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private callsService: CallsService,
    private wsGateway: WebSocketGateway,
  ) {
    this.pbxHost = this.configService.get('KERIO_PBX_HOST') || '90.156.199.92';
    this.apiUsername = this.configService.get('KERIO_API_USERNAME') || '';
    this.apiPassword = this.configService.get('KERIO_API_PASSWORD') || '';

    // Kerio Operator API - haqiqiy endpoint larni tekshirish kerak
    // Kerio Operator odatda REST API yoki SOAP API ishlatadi
    // Misol: https://pbx.example.com/api/rest/v1/ yoki https://pbx.example.com/api/soap/
    
    this.apiClient = axios.create({
      baseURL: `https://${this.pbxHost}/api/rest/v1`, // Kerio Operator REST API endpoint
      timeout: 30000,
      auth: {
        username: this.apiUsername,
        password: this.apiPassword,
      },
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: () => true, // Barcha status kodlarni qabul qilish
    });

    this.logger.log(`Kerio Operator service initialized for ${this.pbxHost}`);
  }

  /**
   * Kerio Operator API ga autentifikatsiya
   */
  async authenticate(): Promise<boolean> {
    try {
      // Kerio Operator API endpoint lari haqiqiy API ga moslashtirish kerak
      // Variant 1: REST API
      // const response = await this.apiClient.get('/auth/verify');
      
      // Variant 2: SOAP API
      // const response = await this.apiClient.post('/soap', { ... });
      
      // Variant 3: CDR endpoint orqali tekshirish
      const response = await this.apiClient.get('/calls/cdr', {
        params: {
          limit: 1,
        },
      });

      if (response.status === 200 || response.status === 401) {
        // 401 bo'lsa, credentials noto'g'ri
        if (response.status === 401) {
          this.logger.warn('Kerio Operator authentication failed: Invalid credentials');
          return false;
        }
        this.logger.log('Kerio Operator authentication successful');
        return true;
      }

      this.logger.warn(`Kerio Operator API returned status ${response.status}`);
      return false;
    } catch (error: any) {
      this.logger.error('Kerio Operator authentication error:', error.message);
      // Network xatolik bo'lsa ham false qaytarish
      return false;
    }
  }

  /**
   * Call Detail Records (CDR) ni olish
   */
  async fetchCallRecords(params?: {
    startDate?: Date;
    endDate?: Date;
    extension?: string;
  }): Promise<KerioCallRecord[]> {
    try {
      const queryParams: any = {};
      
      if (params?.startDate) {
        queryParams.start_date = params.startDate.toISOString();
      }
      if (params?.endDate) {
        queryParams.end_date = params.endDate.toISOString();
      }
      if (params?.extension) {
        queryParams.extension = params.extension;
      }

      // Kerio Operator CDR API endpoint
      // Haqiqiy API endpoint ni tekshirish kerak
      // Misol: /api/rest/v1/calls/cdr yoki /api/soap/cdr
      const response = await this.apiClient.get('/calls/cdr', {
        params: queryParams,
      });

      if (response.status !== 200) {
        throw new Error(`Kerio Operator API error: ${response.status} - ${response.statusText}`);
      }

      const records: KerioCallRecord[] = response.data.map((record: any) => {
        const state = this.mapKerioState(record.state || record.status);
        return {
          id: record.id || record.call_id,
          direction: record.direction === 'inbound' ? 'inbound' : 'outbound',
          fromNumber: record.from_number || record.caller_id,
          toNumber: record.to_number || record.destination,
          extension: record.extension,
          startTime: new Date(record.start_time),
          endTime: record.end_time ? new Date(record.end_time) : undefined,
          duration: record.duration,
          status: this.mapKerioStatus(record.status),
          recordingPath: record.recording_path || record.recording_url,
          pbxCallId: record.call_id || record.id,
          state,
        };
      });

      this.logger.log(`Fetched ${records.length} call records from Kerio Operator`);
      return records;
    } catch (error: any) {
      this.logger.error('Error fetching call records from Kerio Operator:', error.message);
      throw new Error(`Kerio Operator CDR fetch failed: ${error.message}`);
    }
  }

  /**
   * Kerio Operator status ni bizning formatga o'zgartirish
   */
  private mapKerioStatus(status: string): 'answered' | 'no_answer' | 'busy' | 'failed' {
    const statusMap: Record<string, 'answered' | 'no_answer' | 'busy' | 'failed'> = {
      'answered': 'answered',
      'no-answer': 'no_answer',
      'no_answer': 'no_answer',
      'busy': 'busy',
      'failed': 'failed',
    };

    return statusMap[status.toLowerCase()] || 'failed';
  }

  /**
   * Call recording ni olish
   */
  async getCallRecording(pbxCallId: string): Promise<Buffer | null> {
    try {
      const response = await this.apiClient.get(`/calls/${pbxCallId}/recording`, {
        responseType: 'arraybuffer',
      });

      return Buffer.from(response.data);
    } catch (error: any) {
      this.logger.error(`Error fetching recording for call ${pbxCallId}:`, error.message);
      return null;
    }
  }

  /**
   * Call records ni database ga sync qilish
   */
  async syncCallRecords(params?: {
    startDate?: Date;
    endDate?: Date;
    extension?: string;
  }): Promise<number> {
    try {
      const records = await this.fetchCallRecords(params);
      let syncedCount = 0;

      for (const record of records) {
        try {
          // Database da mavjudligini tekshirish
          const existing = await this.prisma.call.findFirst({
            where: {
              OR: [
                { callId: record.pbxCallId },
                {
                  fromNumber: record.fromNumber,
                  toNumber: record.toNumber,
                  startTime: record.startTime,
                },
              ],
            },
          });

          if (!existing) {
            // Yangi call yaratish
            await this.callsService.create({
              direction: record.direction === 'inbound' ? 'kiruvchi' : 'chiquvchi',
              fromNumber: record.fromNumber,
              toNumber: record.toNumber,
              callId: record.pbxCallId,
              recordingPath: record.recordingPath,
              startTime: record.startTime,
              endTime: record.endTime,
              duration: record.duration,
              status: this.mapStatusToUzbek(record.status),
            });

            syncedCount++;
          }
        } catch (error: any) {
          this.logger.error(`Error syncing call record ${record.pbxCallId}:`, error.message);
        }
      }

      this.logger.log(`Synced ${syncedCount} new call records`);
      return syncedCount;
    } catch (error: any) {
      this.logger.error('Error syncing call records:', error.message);
      throw error;
    }
  }

  /**
   * Status ni o'zbek tiliga o'zgartirish
   */
  private mapStatusToUzbek(status: string): string {
    const statusMap: Record<string, string> = {
      'answered': 'javob berildi',
      'no_answer': 'javobsiz',
      'busy': 'band',
      'failed': 'xatolik',
    };

    return statusMap[status] || 'noma\'lum';
  }

  /**
   * Call state ni o'zbek tiliga o'zgartirish
   */
  private mapKerioState(state: string): 'kelyapti' | 'suhbatda' | 'yakunlandi' | 'javobsiz' {
    const stateMap: Record<string, 'kelyapti' | 'suhbatda' | 'yakunlandi' | 'javobsiz'> = {
      'ringing': 'kelyapti',
      'ring': 'kelyapti',
      'connected': 'suhbatda',
      'answered': 'suhbatda',
      'ended': 'yakunlandi',
      'completed': 'yakunlandi',
      'no_answer': 'javobsiz',
      'missed': 'javobsiz',
      'busy': 'javobsiz',
    };

    return stateMap[state?.toLowerCase()] || 'yakunlandi';
  }

  /**
   * Faol qo'ng'iroqlarni polling qilish
   */
  async pollActiveCalls() {
    try {
      // Kerio Operator dan faol qo'ng'iroqlarni olish
      // API endpoint: /api/rest/v1/calls/active yoki /api/rest/v1/calls/current
      const response = await this.apiClient.get('/calls/active');

      if (response.status !== 200) {
        return;
      }

      const activeCalls: KerioCallRecord[] = response.data.map((call: any) => ({
        id: call.id || call.call_id,
        direction: call.direction === 'inbound' ? 'inbound' : 'outbound',
        fromNumber: call.from_number || call.caller_id,
        toNumber: call.to_number || call.destination,
        extension: call.extension,
        startTime: new Date(call.start_time),
        state: this.mapKerioState(call.state || 'ringing'),
        pbxCallId: call.call_id || call.id,
      }));

      // Yangi qo'ng'iroqlarni aniqlash
      for (const call of activeCalls) {
        if (!this.activeCalls.has(call.pbxCallId)) {
          // Yangi qo'ng'iroq
          this.activeCalls.set(call.pbxCallId, call);
          
          if (call.direction === 'inbound') {
            // WebSocket orqali frontend ga yuborish
            this.wsGateway.emitIncomingCall({
              callId: call.pbxCallId,
              fromNumber: call.fromNumber,
              toNumber: call.toNumber,
              direction: 'kiruvchi',
              startTime: call.startTime.toISOString(),
              state: call.state || 'kelyapti',
            });
          }
        } else {
          // Mavjud qo'ng'iroq - state o'zgarishini tekshirish
          const existingCall = this.activeCalls.get(call.pbxCallId);
          if (existingCall && existingCall.state !== call.state) {
            existingCall.state = call.state;
            
            // State o'zgarishini frontend ga yuborish
            this.wsGateway.emitCallStatus({
              callId: call.pbxCallId,
              state: call.state || 'yakunlandi',
            });
          }
        }
      }

      // Tugagan qo'ng'iroqlarni aniqlash
      const activeCallIds = new Set(activeCalls.map(c => c.pbxCallId));
      for (const [callId, call] of this.activeCalls.entries()) {
        if (!activeCallIds.has(callId)) {
          // Qo'ng'iroq tugadi
          call.state = 'yakunlandi';
          this.activeCalls.delete(callId);
          
          // Frontend ga yuborish
          this.wsGateway.emitCallStatus({
            callId,
            state: 'yakunlandi',
          });
        }
      }
    } catch (error: any) {
      this.logger.error('Error polling active calls:', error.message);
    }
  }

  /**
   * Avtomatik sync ni ishga tushirish
   */
  startAutoSync(intervalMinutes: number = 5) {
    if (this.syncInterval) {
      this.stopAutoSync();
    }

    this.logger.log(`Starting auto-sync every ${intervalMinutes} minutes`);

    this.syncInterval = setInterval(async () => {
      try {
        await this.syncCallRecords();
      } catch (error: any) {
        this.logger.error('Auto-sync error:', error.message);
      }
    }, intervalMinutes * 60 * 1000);

    // Dastlabki sync
    this.syncCallRecords().catch((error) => {
      this.logger.error('Initial sync error:', error.message);
    });
  }

  /**
   * Real-time polling ni ishga tushirish
   */
  startPolling(intervalSeconds: number = 2) {
    if (this.pollInterval) {
      this.stopPolling();
    }

    this.logger.log(`Starting real-time polling every ${intervalSeconds} seconds`);

    this.pollInterval = setInterval(async () => {
      try {
        await this.pollActiveCalls();
      } catch (error: any) {
        this.logger.error('Polling error:', error.message);
      }
    }, intervalSeconds * 1000);

    // Dastlabki polling
    this.pollActiveCalls().catch((error) => {
      this.logger.error('Initial polling error:', error.message);
    });
  }

  /**
   * Real-time polling ni to'xtatish
   */
  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
      this.logger.log('Real-time polling stopped');
    }
  }

  /**
   * Avtomatik sync ni to'xtatish
   */
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      this.logger.log('Auto-sync stopped');
    }
  }

  /**
   * Barcha servislarni to'xtatish
   */
  stopAll() {
    this.stopAutoSync();
    this.stopPolling();
    this.activeCalls.clear();
  }
}

