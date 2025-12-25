import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class ExtensionsService {
  private readonly logger = new Logger(ExtensionsService.name);
  private readonly pjsipConfPath = '/etc/asterisk/pjsip.conf';

  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.sipExtension.findMany({
      orderBy: { extension: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.sipExtension.findUnique({
      where: { id },
    });
  }

  async findByExtension(extension: string) {
    return this.prisma.sipExtension.findUnique({
      where: { extension },
    });
  }

  async create(data: {
    extension: string;
    password: string;
    displayName?: string;
    context?: string;
    transport?: string;
    codecs?: string;
  }) {
    // Database ga saqlash
    const extension = await this.prisma.sipExtension.create({
      data: {
        extension: data.extension,
        password: data.password,
        displayName: data.displayName || data.extension,
        context: data.context || 'from-internal',
        transport: data.transport || 'transport-udp',
        codecs: data.codecs || 'ulaw,alaw,g729',
      },
    });

    // Asterisk PJSIP ga qo'shish
    await this.updateAsteriskConfig(extension);

    return extension;
  }

  async update(id: string, data: {
    password?: string;
    displayName?: string;
    context?: string;
    transport?: string;
    codecs?: string;
  }) {
    const extension = await this.prisma.sipExtension.findUnique({
      where: { id },
    });

    if (!extension) {
      throw new Error('Extension topilmadi');
    }

    // Database ni yangilash
    const updated = await this.prisma.sipExtension.update({
      where: { id },
      data,
    });

    // Asterisk PJSIP ni yangilash
    await this.updateAsteriskConfig(updated);

    return updated;
  }

  async delete(id: string) {
    const extension = await this.prisma.sipExtension.findUnique({
      where: { id },
    });

    if (!extension) {
      throw new Error('Extension topilmadi');
    }

    // Asterisk PJSIP dan o'chirish
    await this.removeFromAsteriskConfig(extension.extension);

    // Database dan o'chirish
    await this.prisma.sipExtension.delete({
      where: { id },
    });

    return { success: true };
  }

  private async updateAsteriskConfig(extension: any) {
    try {
      // pjsip.conf faylini o'qish
      let content = '';
      if (fs.existsSync(this.pjsipConfPath)) {
        content = fs.readFileSync(this.pjsipConfPath, 'utf-8');
      }

      // Eski extension sozlamalarini o'chirish
      const extensionRegex = new RegExp(
        `(; SIP Extension: ${extension.extension}[\\s\\S]*?)(?=\\[|; SIP Extension:|$)`,
        'g'
      );
      content = content.replace(extensionRegex, '');

      // Codec larni ajratish
      const codecs = extension.codecs.split(',').map((c: string) => c.trim());

      // Yangi extension sozlamalarini qo'shish
      const newConfig = `
; SIP Extension: ${extension.extension}
; Generated automatically - ${new Date().toISOString()}

[${extension.extension}]
type = aor
contact = sip/${extension.extension}@${extension.transport}
maximum_expiration = 3600

[${extension.extension}-auth]
type = auth
auth_type = userpass
username = ${extension.extension}
password = ${extension.password}

[${extension.extension}]
type = endpoint
context = ${extension.context}
disallow = all
${codecs.map((codec: string) => `allow = ${codec}`).join('\n')}
direct_media = yes
transport = ${extension.transport}
aors = ${extension.extension}
auth = ${extension.extension}-auth
rtp_symmetric = yes
force_rport = yes
rewrite_contact = yes
`;

      // Fayl oxiriga qo'shish
      content += newConfig;

      // Backup yaratish
      const backupPath = `${this.pjsipConfPath}.backup.${Date.now()}`;
      if (fs.existsSync(this.pjsipConfPath)) {
        fs.copyFileSync(this.pjsipConfPath, backupPath);
      }

      // Faylga yozish
      fs.writeFileSync(this.pjsipConfPath, content, 'utf-8');

      // Asterisk reload
      await this.reloadAsterisk();

      this.logger.log(`Extension ${extension.extension} Asterisk ga qo'shildi/yangilandi`);
    } catch (error: any) {
      this.logger.error(`Extension ${extension.extension} ni Asterisk ga qo'shishda xatolik:`, error.message);
      throw error;
    }
  }

  private async removeFromAsteriskConfig(extension: string) {
    try {
      if (!fs.existsSync(this.pjsipConfPath)) {
        return;
      }

      let content = fs.readFileSync(this.pjsipConfPath, 'utf-8');

      // Extension sozlamalarini o'chirish
      const extensionRegex = new RegExp(
        `(; SIP Extension: ${extension}[\\s\\S]*?)(?=\\[|; SIP Extension:|$)`,
        'g'
      );
      content = content.replace(extensionRegex, '');

      // Backup yaratish
      const backupPath = `${this.pjsipConfPath}.backup.${Date.now()}`;
      fs.copyFileSync(this.pjsipConfPath, backupPath);

      // Faylga yozish
      fs.writeFileSync(this.pjsipConfPath, content, 'utf-8');

      // Asterisk reload
      await this.reloadAsterisk();

      this.logger.log(`Extension ${extension} Asterisk dan o'chirildi`);
    } catch (error: any) {
      this.logger.error(`Extension ${extension} ni Asterisk dan o'chirishda xatolik:`, error.message);
      throw error;
    }
  }

  private async reloadAsterisk() {
    try {
      await execAsync('asterisk -rx "module reload res_pjsip.so"');
      await execAsync('asterisk -rx "pjsip reload"');
      this.logger.log('Asterisk reload qilindi');
    } catch (error: any) {
      this.logger.error('Asterisk reload qilishda xatolik:', error.message);
      throw error;
    }
  }

  async getStatus(extension: string) {
    try {
      const result = await execAsync(`asterisk -rx "pjsip show endpoints ${extension}"`);
      const output = result.stdout;
      
      if (output.includes(`Endpoint:  ${extension}`)) {
        if (output.includes('Available')) {
          return { status: 'available', details: output };
        } else if (output.includes('Contact:')) {
          return { status: 'registered', details: output };
        }
      }
      
      return { status: 'unavailable', details: output };
    } catch (error: any) {
      return { status: 'error', error: error.message };
    }
  }
}

