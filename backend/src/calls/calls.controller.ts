import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CallsService } from './calls.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as fs from 'fs';
import * as path from 'path';

@Controller('calls')
@UseGuards(JwtAuthGuard)
export class CallsController {
  constructor(
    private callsService: CallsService,
  ) {}

  @Get()
  findAll(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.callsService.findAll({ startDate, endDate });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.callsService.findById(id);
  }

  @Get(':id/recording')
  async getRecording(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const call = await this.callsService.findById(id);
    if (!call || !call.recordingPath) {
      return res.status(404).json({ message: 'Yozuv topilmadi' });
    }

    let filePath = call.recordingPath;
    if (!fs.existsSync(filePath)) {
      const mp3Path = filePath.replace(/\.wav$/i, '.mp3');
      if (fs.existsSync(mp3Path)) {
        filePath = mp3Path;
      } else {
        return res.status(404).json({ message: 'Yozuv fayli topilmadi' });
      }
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const isMp3 = filePath.endsWith('.mp3');
    const contentType = isMp3 ? 'audio/mpeg' : 'audio/wav';
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
      });
      return fileStream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Content-Disposition': `inline; filename="call_${call.id}${isMp3 ? '.mp3' : '.wav'}"`,
      });
      return fs.createReadStream(filePath).pipe(res);
    }
  }

  // Outbound call endpoint olib tashlandi
  // Bu tizim PBX emas, faqat monitoring/CTI tizimi
  // Qo'ng'iroqlar tashqi SIP server orqali keladi
}

