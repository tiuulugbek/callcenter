import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class CallsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll(filters?: { startDate?: string; endDate?: string }) {
    const where: any = {};
    
    if (filters?.startDate || filters?.endDate) {
      where.startTime = {};
      if (filters.startDate) {
        where.startTime.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.startTime.lte = new Date(filters.endDate);
      }
    }

    return this.prisma.call.findMany({
      where,
      orderBy: { startTime: 'desc' },
      include: {
        operator: {
          select: {
            id: true,
            name: true,
            extension: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.call.findUnique({
      where: { id },
      include: {
        operator: {
          select: {
            id: true,
            name: true,
            extension: true,
          },
        },
      },
    });
  }

  async create(data: {
    direction: string;
    fromNumber: string;
    toNumber: string;
    callId: string;
    recordingPath?: string;
    startTime?: Date;
    endTime?: Date;
    duration?: number;
    status?: string;
  }) {
    // Upsert - agar callId mavjud bo'lsa yangilash, yo'q bo'lsa yaratish
    return this.prisma.call.upsert({
      where: { callId: data.callId },
      update: {
        direction: data.direction,
        fromNumber: data.fromNumber,
        toNumber: data.toNumber,
        recordingPath: data.recordingPath,
        startTime: data.startTime,
        status: data.status,
      },
      create: data,
    });
  }

  async update(id: string, data: {
    endTime?: Date;
    duration?: number;
    status?: string;
    recordingPath?: string;
  }) {
    return this.prisma.call.update({
      where: { id },
      data,
    });
  }

  async findByCallId(callId: string) {
    return this.prisma.call.findUnique({
      where: { callId },
    });
  }

  async updateByCallId(callId: string, data: {
    endTime?: Date;
    duration?: number;
    status?: string;
    recordingPath?: string;
  }) {
    const call = await this.prisma.call.findUnique({
      where: { callId },
    });

    if (!call) {
      return null;
    }

    return this.prisma.call.update({
      where: { id: call.id },
      data,
    });
  }

}

