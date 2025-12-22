import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SipTrunkService {
  private readonly logger = new Logger(SipTrunkService.name);
  private readonly pjsipConfigPath: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
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
    
    // Database ga saqlash
    try {
      const trunk = await this.prisma.sipTrunk.upsert({
        where: { name: data.name },
        update: {
          host: data.host,
          username: data.username,
          password: data.password,
          port: data.port || 5060,
          transport: data.transport || 'udp',
        },
        create: {
          name: data.name,
          host: data.host,
          username: data.username,
          password: data.password,
          port: data.port || 5060,
          transport: data.transport || 'udp',
        },
      });

      this.logger.log(`SIP trunk database ga saqlandi: ${trunk.name}`);
    } catch (error: any) {
      this.logger.error('Database ga saqlashda xatolik:', error);
    }
    
    // Config faylini yangilash
    try {
      await this.updatePjsipConfig(data.name, config);
      return {
        success: true,
        message: 'SIP trunk muvaffaqiyatli yaratildi va pjsip.conf fayli yangilandi',
        config: config,
        manual: false,
      };
    } catch (error: any) {
      this.logger.error('PJSIP config yangilashda xatolik:', error);
      // Agar fayl yozib bo'lmasa, faqat konfiguratsiyani qaytarish
      return {
        success: true,
        message: `SIP trunk konfiguratsiyasi yaratildi va database ga saqlandi. Lekin pjsip.conf faylini qo'lda yangilash kerak: ${error.message}`,
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
    // Mavjud transport dan foydalanish (transport-udp, transport-tcp)
    const transportName = transport === 'udp' ? 'transport-udp' : transport === 'tcp' ? 'transport-tcp' : 'transport-udp';

    return `
; SIP Trunk: ${data.name}
; Generated automatically - ${new Date().toISOString()}

[${data.name}]
type = aor
contact = sip:${data.username}@${data.host}:${port}
qualify_frequency = 60

[${data.name}]
type = endpoint
context = from-external
disallow = all
allow = ulaw
allow = alaw
allow = g729
direct_media = no
transport = ${transportName}
aors = ${data.name}
auth = ${data.name}-auth
outbound_auth = ${data.name}-auth
rtp_symmetric = yes
force_rport = yes
rewrite_contact = yes
trust_id_inbound = yes
send_rpid = yes

[${data.name}-auth]
type = auth
auth_type = userpass
username = ${data.username}
password = ${data.password}

[${data.name}-identify]
type = identify
endpoint = ${data.name}
match = ${data.host}
`;
  }

  private async updatePjsipConfig(trunkName: string, config: string): Promise<void> {
    const configDir = path.dirname(this.pjsipConfigPath);
    
    if (!fs.existsSync(configDir)) {
      throw new Error(`Config directory not found: ${configDir}`);
    }

    // Backup yaratish
    const backupPath = `${this.pjsipConfigPath}.backup.${Date.now()}`;
    if (fs.existsSync(this.pjsipConfigPath)) {
      try {
        fs.copyFileSync(this.pjsipConfigPath, backupPath);
        this.logger.log(`Backup yaratildi: ${backupPath}`);
      } catch (error) {
        this.logger.warn('Backup yaratishda xatolik:', error);
      }
    }

    // Yangi konfiguratsiyani qo'shish
    const existingConfig = fs.existsSync(this.pjsipConfigPath)
      ? fs.readFileSync(this.pjsipConfigPath, 'utf-8')
      : '';

    // Agar trunk allaqachon mavjud bo'lsa, o'chirish
    const cleanedConfig = this.removeTrunkConfig(existingConfig, trunkName);

    // Yangi konfiguratsiyani qo'shish
    const newConfig = cleanedConfig.trim() + '\n' + config.trim() + '\n';

    try {
      // Fayl yozishga harakat qilish
      fs.writeFileSync(this.pjsipConfigPath, newConfig, 'utf-8');
      this.logger.log(`PJSIP config yangilandi: ${this.pjsipConfigPath}`);
      
      // Asterisk ni reload qilish (agar mumkin bo'lsa)
      try {
        const { exec } = require('child_process');
        exec('asterisk -rx "pjsip reload"', (error: any) => {
          if (error) {
            this.logger.warn('Asterisk reload xatosi:', error);
          } else {
            this.logger.log('Asterisk PJSIP reload qilindi');
          }
        });
      } catch (error) {
        this.logger.warn('Asterisk reload qilishda xatolik:', error);
      }
    } catch (error: any) {
      this.logger.error('PJSIP config yozishda xatolik:', error);
      throw new Error(`Fayl yozib bo'lmadi: ${error.message}. Iltimos, ruxsatlarni tekshiring.`);
    }
  }

  private removeTrunkConfig(config: string, trunkName: string): string {
    // Trunk konfiguratsiyasini olib tashlash (name, name-auth, name-identify, name-transport)
    const lines = config.split('\n');
    const newLines: string[] = [];
    let skipSection = false;
    let sectionDepth = 0;
    const sectionsToRemove = [
      trunkName,
      `${trunkName}-auth`,
      `${trunkName}-identify`,
      `${trunkName}-transport`,
    ];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Section boshlanishi
      if (line.startsWith('[')) {
        const sectionName = line.replace(/[\[\]]/g, '').split('(')[0];
        
        if (sectionsToRemove.includes(sectionName)) {
          skipSection = true;
          sectionDepth = 1;
          continue;
        } else {
          skipSection = false;
          sectionDepth = 0;
        }
      }

      // Section ichida
      if (skipSection) {
        if (line.startsWith('[')) {
          sectionDepth++;
        }
        // Bo'sh qator va sectionDepth 1 bo'lsa, section tugadi
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
    // Database dan trunklarni olish
    try {
      const trunks = await this.prisma.sipTrunk.findMany({
        orderBy: { createdAt: 'desc' },
      });

      // Password ni yashirish
      return trunks.map(trunk => ({
        name: trunk.name,
        host: trunk.host,
        username: trunk.username,
        password: '••••••••', // Password yashiriladi
        port: trunk.port,
        transport: trunk.transport,
      }));
    } catch (error) {
      this.logger.warn('Database dan trunklar o\'qib bo\'lmadi:', error);
      
      // Fallback: Config faylidan o'qish
      try {
        if (fs.existsSync(this.pjsipConfigPath)) {
          const config = fs.readFileSync(this.pjsipConfigPath, 'utf-8');
          return this.parseTrunks(config);
        }
      } catch (configError) {
        this.logger.warn('PJSIP config o\'qib bo\'lmadi:', configError);
      }
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

