import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SipExtensionService {
  private readonly logger = new Logger(SipExtensionService.name);
  private readonly pjsipConfigPath: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.pjsipConfigPath = this.configService.get('ASTERISK_PJSIP_CONFIG') || '/etc/asterisk/pjsip.conf';
  }

  async createExtension(operatorId: string, extension: string, password: string) {
    // Operator ni topish
    const operator = await this.prisma.operator.findUnique({
      where: { id: operatorId },
    });

    if (!operator) {
      throw new Error('Operator topilmadi');
    }

    // Extension allaqachon mavjudligini tekshirish
    const existingOperator = await this.prisma.operator.findFirst({
      where: {
        extension,
        id: { not: operatorId },
      },
    });

    if (existingOperator) {
      throw new Error(`Extension ${extension} allaqachon mavjud`);
    }

    // Parolni hash qilish
    const hashedPassword = await bcrypt.hash(password, 10);

    // Operator ni yangilash
    const updatedOperator = await this.prisma.operator.update({
      where: { id: operatorId },
      data: {
        extension,
        password: hashedPassword,
      },
    });

    // Asterisk PJSIP konfiguratsiyasini yangilash
    try {
      await this.updatePjsipConfig(extension, password);
      this.logger.log(`SIP extension yaratildi: ${extension}`);
    } catch (error) {
      this.logger.error('PJSIP config yangilashda xatolik:', error);
      // Xatolik bo'lsa ham extension yaratilgan, faqat Asterisk ni qo'lda reload qilish kerak
    }

    return {
      success: true,
      message: 'SIP extension yaratildi',
      extension: {
        operatorId: updatedOperator.id,
        extension: updatedOperator.extension,
        name: updatedOperator.name,
      },
    };
  }

  private generateExtensionConfig(extension: string, password: string): string {
    return `
; SIP Extension: ${extension}
; Generated automatically

[${extension}]
type = aor
contact = sip/${extension}@transport-udp

[${extension}]
type = endpoint
context = from-internal
disallow = all
allow = ulaw
allow = alaw
allow = g729
direct_media = yes
transport = transport-udp
aors = ${extension}
auth = ${extension}-auth
rtp_symmetric = yes
force_rport = yes
rewrite_contact = yes

[${extension}-auth]
type = auth
auth_type = userpass
username = ${extension}
password = ${password}
`;
  }

  private async updatePjsipConfig(extension: string, password: string): Promise<void> {
    const configDir = path.dirname(this.pjsipConfigPath);
    
    if (!fs.existsSync(configDir)) {
      throw new Error(`Config directory not found: ${configDir}`);
    }

    // Backup yaratish
    const backupPath = `${this.pjsipConfigPath}.backup.${Date.now()}`;
    if (fs.existsSync(this.pjsipConfigPath)) {
      fs.copyFileSync(this.pjsipConfigPath, backupPath);
    }

    // Mavjud konfiguratsiyani olish
    const existingConfig = fs.existsSync(this.pjsipConfigPath)
      ? fs.readFileSync(this.pjsipConfigPath, 'utf-8')
      : '';

    // Agar extension allaqachon mavjud bo'lsa, o'chirish
    const cleanedConfig = this.removeExtensionConfig(existingConfig, extension);

    // Yangi konfiguratsiyani qo'shish
    const newConfig = cleanedConfig + '\n' + this.generateExtensionConfig(extension, password);

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
  }

  private removeExtensionConfig(config: string, extension: string): string {
    const lines = config.split('\n');
    const newLines: string[] = [];
    let skipSection = false;
    let sectionDepth = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Section boshlanishi
      if (line.startsWith('[') && line.includes(extension)) {
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

  async getExtensions() {
    // Database dan extensionlarni olish
    const operators = await this.prisma.operator.findMany({
      where: {
        extension: { not: null },
      },
      select: {
        id: true,
        name: true,
        extension: true,
        status: true,
      },
    });

    return operators;
  }
}

