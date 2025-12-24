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
        message: 'SIP trunk muvaffaqiyatli yaratildi, saqlandi va Asterisk ga ulanadi',
        config: config,
        manual: false,
      };
    } catch (error: any) {
      this.logger.error('PJSIP config yangilashda xatolik:', error);
      
      // Permissions muammosi bo'lsa, aniqroq xabar
      const errorMessage = error.message || 'Noma\'lum xatolik';
      let userMessage = `SIP trunk database ga saqlandi. Lekin pjsip.conf faylini avtomatik yangilashda xatolik: ${errorMessage}`;
      
      if (errorMessage.includes('EACCES') || errorMessage.includes('permission') || errorMessage.includes('yozib bo\'lmadi')) {
        userMessage = `SIP trunk database ga saqlandi. Permissions muammosi tufayli pjsip.conf faylini qo'lda yangilash kerak. Quyidagi konfiguratsiyani /etc/asterisk/pjsip.conf fayliga qo'shing yoki permissions fix scriptni ishga tushiring.`;
      }
      
      return {
        success: true,
        message: userMessage,
        config: config,
        manual: true,
        error: errorMessage,
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
    
    // Trunk nomi - faqat lotin harflar, raqamlar va tire (PJSIP uchun)
    // Bo'sh joylarni olib tashlash va faqat lotin harflar, raqamlar va tire qoldirish
    const trunkName = data.name
      .replace(/\s+/g, '') // Bo'sh joylarni olib tashlash
      .replace(/[^a-zA-Z0-9-]/g, '') // Faqat lotin harflar, raqamlar va tire
      .replace(/^-+|-+$/g, ''); // Boshida va oxirida tire bo'lmasligi kerak

    return `
; SIP Trunk: ${data.name}
; Generated automatically - ${new Date().toISOString()}
; Direct registration to SIP provider - Independent from Kerio Operator

[${trunkName}]
type = aor
contact = sip:${data.username}@${data.host}:${port}
qualify_frequency = 60
maximum_expiration = 3600
qualify_timeout = 3.0
remove_existing = yes

[${trunkName}]
type = endpoint
context = outbound
disallow = all
allow = ulaw
allow = alaw
allow = g729
direct_media = no
transport = ${transportName}
aors = ${trunkName}
auth = ${trunkName}-auth
outbound_auth = ${trunkName}-auth
rtp_symmetric = yes
force_rport = yes
rewrite_contact = yes
trust_id_inbound = yes
send_rpid = yes
rtp_ipv6 = no
use_avpf = no
media_encryption = no
dtmf_mode = rfc4733
from_user = ${data.username}
from_domain = ${data.host}

[${trunkName}-auth]
type = auth
auth_type = userpass
username = ${data.username}
password = ${data.password}

[${trunkName}-identify]
type = identify
endpoint = ${trunkName}
match = ${data.host}

[${trunkName}-registration]
type = registration
transport = ${transportName}
outbound_auth = ${trunkName}-auth
server_uri = sip:${data.host}:${port}
client_uri = sip:${data.username}@${data.host}:${port}
contact_user = ${data.username}
retry_interval = 60
forbidden_retry_interval = 300
expiration = 3600
outbound_proxy = sip:${data.host}:${port}
`;
  }

  private async updatePjsipConfig(trunkName: string, config: string): Promise<void> {
    const configDir = path.dirname(this.pjsipConfigPath);
    
    // Config papkasini tekshirish va yaratish
    if (!fs.existsSync(configDir)) {
      this.logger.warn(`Config directory not found: ${configDir}. Yaratishga harakat qilmoqda...`);
      try {
        // Sudo orqali papka yaratishga harakat qilish
        const { execSync } = require('child_process');
        execSync(`sudo mkdir -p ${configDir}`, { stdio: 'inherit' });
        execSync(`sudo chown asterisk:asterisk ${configDir}`, { stdio: 'inherit' });
        execSync(`sudo chmod 775 ${configDir}`, { stdio: 'inherit' });
        this.logger.log(`Config directory yaratildi: ${configDir}`);
      } catch (mkdirError: any) {
        this.logger.error(`Config directory yaratib bo'lmadi: ${mkdirError.message}`);
        throw new Error(`Config directory not found: ${configDir}. Iltimos, papkani yarating: sudo mkdir -p ${configDir} && sudo chown asterisk:asterisk ${configDir} && sudo chmod 775 ${configDir}`);
      }
    }
    
    // Config papkasiga kirish huquqini tekshirish
    try {
      fs.accessSync(configDir, fs.constants.W_OK);
    } catch (accessError) {
      this.logger.warn(`Config directory ga yozish huquqi yo'q: ${configDir}`);
      // Sudo orqali permissions ni sozlashga harakat qilish
      try {
        const { execSync } = require('child_process');
        execSync(`sudo chmod 775 ${configDir}`, { stdio: 'inherit' });
        this.logger.log(`Config directory permissions sozlandi: ${configDir}`);
      } catch (chmodError: any) {
        this.logger.error(`Permissions sozlab bo'lmadi: ${chmodError.message}`);
        throw new Error(`Config directory ga yozish huquqi yo'q: ${configDir}. Iltimos, permissions ni sozlang: sudo chmod 775 ${configDir}`);
      }
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
      
      // Sudo orqali yozishga harakat qilish
      try {
        const { execSync } = require('child_process');
        const tempFile = `/tmp/pjsip_${trunkName}_${Date.now()}.conf`;
        
        // Temp faylga yozish
        fs.writeFileSync(tempFile, newConfig, 'utf-8');
        
        // Sudo orqali ko'chirish
        execSync(`sudo cp ${tempFile} ${this.pjsipConfigPath}`, { stdio: 'inherit' });
        execSync(`sudo chown asterisk:asterisk ${this.pjsipConfigPath}`, { stdio: 'inherit' });
        execSync(`sudo chmod 664 ${this.pjsipConfigPath}`, { stdio: 'inherit' });
        
        // Temp faylni o'chirish
        fs.unlinkSync(tempFile);
        
        this.logger.log(`PJSIP config sudo orqali yangilandi: ${this.pjsipConfigPath}`);
        
        // Asterisk ni reload qilish
        try {
          execSync('sudo asterisk -rx "pjsip reload"', { stdio: 'inherit' });
          this.logger.log('Asterisk PJSIP reload qilindi');
        } catch (reloadError) {
          this.logger.warn('Asterisk reload xatosi:', reloadError);
        }
      } catch (sudoError: any) {
        this.logger.error('Sudo orqali yozishda xatolik:', sudoError);
        throw new Error(`Fayl yozib bo'lmadi: ${error.message}. Sudo orqali ham yozib bo'lmadi: ${sudoError.message}`);
      }
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

      // Password ni yashirish va ID qo'shish
      return trunks.map(trunk => ({
        id: trunk.id,
        name: trunk.name,
        host: trunk.host,
        username: trunk.username,
        password: '••••••••', // Password yashiriladi
        port: trunk.port,
        transport: trunk.transport,
        createdAt: trunk.createdAt,
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

  async updateTrunkConfig(id: string, data: {
    name?: string;
    host?: string;
    username?: string;
    password?: string;
    port?: number;
    transport?: 'udp' | 'tcp' | 'tls';
  }) {
    try {
      // Database dan trunk ni topish
      const trunk = await this.prisma.sipTrunk.findUnique({
        where: { id },
      });

      if (!trunk) {
        throw new Error('Trunk topilmadi');
      }

      // Eski nomni saqlash (config dan olib tashlash uchun)
      const oldName = trunk.name;

      // Yangi ma'lumotlar bilan yangilash
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.host !== undefined) updateData.host = data.host;
      if (data.username !== undefined) updateData.username = data.username;
      if (data.password !== undefined && data.password !== '') updateData.password = data.password;
      if (data.port !== undefined) updateData.port = data.port;
      if (data.transport !== undefined) updateData.transport = data.transport;

      const updatedTrunk = await this.prisma.sipTrunk.update({
        where: { id },
        data: updateData,
      });

      // Config faylini yangilash
      const config = this.generateTrunkConfig({
        name: updatedTrunk.name,
        host: updatedTrunk.host,
        username: updatedTrunk.username,
        password: updatedTrunk.password,
        port: updatedTrunk.port,
        transport: updatedTrunk.transport as 'udp' | 'tcp' | 'tls',
      });

      // Eski config ni olib tashlash
      await this.removeTrunkFromConfig(oldName);
      
      // Yangi config ni qo'shish
      await this.updatePjsipConfig(updatedTrunk.name, config);

      return {
        success: true,
        message: 'SIP trunk muvaffaqiyatli yangilandi',
        trunk: {
          id: updatedTrunk.id,
          name: updatedTrunk.name,
          host: updatedTrunk.host,
          username: updatedTrunk.username,
          password: '••••••••',
          port: updatedTrunk.port,
          transport: updatedTrunk.transport,
        },
      };
    } catch (error: any) {
      this.logger.error('Trunk yangilashda xatolik:', error);
      throw new Error(`Trunk yangilashda xatolik: ${error.message}`);
    }
  }

  async deleteTrunkConfig(id: string) {
    try {
      // Database dan trunk ni topish
      const trunk = await this.prisma.sipTrunk.findUnique({
        where: { id },
      });

      if (!trunk) {
        throw new Error('Trunk topilmadi');
      }

      const trunkName = trunk.name;

      // Database dan o'chirish
      await this.prisma.sipTrunk.delete({
        where: { id },
      });

      // Config faylidan olib tashlash
      await this.removeTrunkFromConfig(trunkName);

      return {
        success: true,
        message: 'SIP trunk muvaffaqiyatli o\'chirildi',
      };
    } catch (error: any) {
      this.logger.error('Trunk o\'chirishda xatolik:', error);
      throw new Error(`Trunk o'chirishda xatolik: ${error.message}`);
    }
  }

  private async removeTrunkFromConfig(trunkName: string): Promise<void> {
    try {
      if (!fs.existsSync(this.pjsipConfigPath)) {
        return;
      }

      const existingConfig = fs.readFileSync(this.pjsipConfigPath, 'utf-8');
      const cleanedConfig = this.removeTrunkConfig(existingConfig, trunkName);

      // Backup yaratish
      const backupPath = `${this.pjsipConfigPath}.backup.${Date.now()}`;
      fs.copyFileSync(this.pjsipConfigPath, backupPath);

      // Yangi config ni yozish
      fs.writeFileSync(this.pjsipConfigPath, cleanedConfig, 'utf-8');
      this.logger.log(`Trunk ${trunkName} config dan olib tashlandi`);

      // Asterisk ni reload qilish
      try {
        const { exec } = require('child_process');
        exec('asterisk -rx "pjsip reload"', (error: any) => {
          if (error) {
            this.logger.warn('Asterisk reload xatosi:', error);
          } else {
            this.logger.log('Asterisk PJSIP reload qilindi');
          }
        });
      } catch (reloadError) {
        this.logger.warn('Asterisk reload qilishda xatolik:', reloadError);
      }
    } catch (error: any) {
      this.logger.error('Config dan trunk olib tashlashda xatolik:', error);
      throw error;
    }
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

