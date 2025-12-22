import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { PrismaService } from '../common/prisma/prisma.service';
import { CallsService } from '../calls/calls.service';

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
}

@Injectable()
export class KerioService {
  private readonly logger = new Logger(KerioService.name);
  private readonly apiClient: AxiosInstance;
  private readonly pbxHost: string;
  private readonly apiUsername: string;
  private readonly apiPassword: string;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private callsService: CallsService,
  ) {
    this.pbxHost = this.configService.get('KERIO_PBX_HOST') || '90.156.199.92';
    this.apiUsername = this.configService.get('KERIO_API_USERNAME') || '';
    this.apiPassword = this.configService.get('KERIO_API_PASSWORD') || '';

    this.apiClient = axios.create({
      baseURL: `https://${this.pbxHost}/api/v1`,
      timeout: 30000,
      auth: {
        username: this.apiUsername,
        password: this.apiPassword,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.logger.log(`Kerio Operator service initialized for ${this.pbxHost}`);
  }

  /**
   * Kerio Operator API ga autentifikatsiya
   */
  async authenticate(): Promise<boolean> {
    try {
      // Kerio Operator API endpoint (misol)
      const response = await this.apiClient.get('/auth/verify');
      this.logger.log('Kerio Operator authentication successful');
      return true;
    } catch (error: any) {
      this.logger.error('Kerio Operator authentication failed:', error.message);
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

      // Kerio Operator CDR API endpoint (misol)
      const response = await this.apiClient.get('/calls/cdr', {
        params: queryParams,
      });

      const records: KerioCallRecord[] = response.data.map((record: any) => ({
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
      }));

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
              startTime: record.startTime,
              endTime: record.endTime,
              duration: record.duration,
              status: this.mapStatusToUzbek(record.status),
              recordingPath: record.recordingPath,
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
   * Avtomatik sync ni to'xtatish
   */
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      this.logger.log('Auto-sync stopped');
    }
  }
}

