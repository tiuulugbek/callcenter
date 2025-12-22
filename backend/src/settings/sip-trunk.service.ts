import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SipTrunkService {
  private readonly logger = new Logger(SipTrunkService.name);
  private readonly pjsipConfigPath: string;

  constructor(private configService: ConfigService) {
    this.pjsipConfigPath = this.configService.get('ASTERISK_PJSIP_CONFIG') || '/etc/asterisk/pjsip.conf';
  }

  async createTrunkConfig(data: {
    name: string;
    host: string;
    username: string;
    password: string;
    port?: number;
    transport?: 'udp' | 'tcp' | 'tls';
  }) {
    const config = this.generateTrunkConfig(data);
    
    // Config faylini yangilash
    try {
      await this.updatePjsipConfig(data.name, config);
      return {
        success: true,
        message: 'SIP trunk konfiguratsiyasi yaratildi',
        config: config,
      };
    } catch (error) {
      this.logger.error('PJSIP config yangilashda xatolik:', error);
      // Agar fayl yozib bo'lmasa, faqat konfiguratsiyani qaytarish
      return {
        success: true,
        message: 'SIP trunk konfiguratsiyasi yaratildi. Iltimos, pjsip.conf faylini qo\'lda yangilang.',
        config: config,
        manual: true,
      };
    }
  }

  private generateTrunkConfig(data: {
    name: string;
    host: string;
    username: string;
    password: string;
    port?: number;
    transport?: 'udp' | 'tcp' | 'tls';
  }): string {
    const port = data.port || 5060;
    const transport = data.transport || 'udp';
    const transportName = `${data.name}-transport`;

    return `
; SIP Trunk: ${data.name}
; Generated automatically

[${transportName}]
type = transport
protocol = ${transport}
bind = 0.0.0.0

[${data.name}]
type = aor
contact = sip:${data.username}@${data.host}:${port}

[${data.name}](!)
type = endpoint
context = from-external
disallow = all
allow = ulaw
allow = alaw
allow = g729
direct_media = no
aors = ${data.name}
auth = ${data.name}-auth
outbound_auth = ${data.name}-auth

[${data.name}-auth]
type = auth
auth_type = userpass
username = ${data.username}
password = ${data.password}

[${data.name}](!)
type = identify
endpoint = ${data.name}
match = ${data.host}
`;
  }

  private async updatePjsipConfig(trunkName: string, config: string): Promise<void> {
    // Agar fayl yozib bo'lmasa, faqat konfiguratsiyani qaytarish
    // Production da bu faylni yozish uchun kerakli ruxsatlar bo'lishi kerak
    const configDir = path.dirname(this.pjsipConfigPath);
    
    if (!fs.existsSync(configDir)) {
      throw new Error(`Config directory not found: ${configDir}`);
    }

    // Backup yaratish
    const backupPath = `${this.pjsipConfigPath}.backup.${Date.now()}`;
    if (fs.existsSync(this.pjsipConfigPath)) {
      fs.copyFileSync(this.pjsipConfigPath, backupPath);
    }

    // Yangi konfiguratsiyani qo'shish
    const existingConfig = fs.existsSync(this.pjsipConfigPath)
      ? fs.readFileSync(this.pjsipConfigPath, 'utf-8')
      : '';

    // Agar trunk allaqachon mavjud bo'lsa, o'chirish
    const cleanedConfig = this.removeTrunkConfig(existingConfig, trunkName);

    // Yangi konfiguratsiyani qo'shish
    const newConfig = cleanedConfig + '\n' + config;

    fs.writeFileSync(this.pjsipConfigPath, newConfig, 'utf-8');
    this.logger.log(`PJSIP config yangilandi: ${this.pjsipConfigPath}`);
  }

  private removeTrunkConfig(config: string, trunkName: string): string {
    // Trunk konfiguratsiyasini olib tashlash
    const lines = config.split('\n');
    const newLines: string[] = [];
    let skipSection = false;
    let sectionDepth = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Section boshlanishi
      if (line.startsWith('[') && line.includes(trunkName)) {
        skipSection = true;
        sectionDepth = 1;
        continue;
      }

      // Section ichida
      if (skipSection) {
        if (line.startsWith('[')) {
          sectionDepth++;
        }
        if (line === '' && sectionDepth === 1) {
          skipSection = false;
          sectionDepth = 0;
          continue;
        }
        if (sectionDepth > 1 && line === '') {
          sectionDepth--;
        }
        continue;
      }

      newLines.push(lines[i]);
    }

    return newLines.join('\n');
  }

  async getTrunks() {
    // Mavjud trunklarni olish (agar config faylini o'qib bo'lsa)
    try {
      if (fs.existsSync(this.pjsipConfigPath)) {
        const config = fs.readFileSync(this.pjsipConfigPath, 'utf-8');
        return this.parseTrunks(config);
      }
    } catch (error) {
      this.logger.warn('PJSIP config o\'qib bo\'lmadi:', error);
    }
    return [];
  }

  private parseTrunks(config: string): any[] {
    const trunks: any[] = [];
    const lines = config.split('\n');
    let currentTrunk: any = null;

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('[') && !trimmed.includes('transport') && !trimmed.includes('auth') && !trimmed.includes('identify')) {
        const name = trimmed.replace(/[\[\]]/g, '').split('-')[0];
        if (name && name !== 'transport-udp' && name !== 'transport-tcp') {
          if (currentTrunk) {
            trunks.push(currentTrunk);
          }
          currentTrunk = { name, host: '', username: '', port: 5060 };
        }
      }

      if (currentTrunk) {
        if (trimmed.startsWith('contact =')) {
          const match = trimmed.match(/sip:([^@]+)@([^:]+):?(\d+)?/);
          if (match) {
            currentTrunk.username = match[1];
            currentTrunk.host = match[2];
            if (match[3]) currentTrunk.port = parseInt(match[3]);
          }
        }
        if (trimmed.startsWith('username =') && trimmed.includes(currentTrunk.name)) {
          const match = trimmed.match(/username = (.+)/);
          if (match) currentTrunk.username = match[1];
        }
      }
    }

    if (currentTrunk) {
      trunks.push(currentTrunk);
    }

    return trunks;
  }
}

