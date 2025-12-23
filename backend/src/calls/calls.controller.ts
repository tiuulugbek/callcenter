import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  Res,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Response } from 'express';
import { CallsService } from './calls.service';
import { AsteriskService } from '../asterisk/asterisk.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as fs from 'fs';
import * as path from 'path';

@Controller('calls')
@UseGuards(JwtAuthGuard)
export class CallsController {
  constructor(
    private callsService: CallsService,
    @Inject(forwardRef(() => AsteriskService))
    private asteriskService: AsteriskService,
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
  async getRecording(@Param('id') id: string, @Res() res: Response) {
    const call = await this.callsService.findById(id);
    if (!call || !call.recordingPath) {
      return res.status(404).json({ message: 'Yozuv topilmadi' });
    }

    const filePath = call.recordingPath;
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Yozuv fayli topilmadi' });
    }

    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Content-Disposition', `attachment; filename="call_${call.id}.wav"`);
    return res.sendFile(path.resolve(filePath));
  }

  @Post('outbound')
  makeOutboundCall(@Body() data: { fromNumber: string; toNumber: string; extension?: string; trunkName?: string }) {
    return this.asteriskService.makeOutboundCall(data);
  }
}

