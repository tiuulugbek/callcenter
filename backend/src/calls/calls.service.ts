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
    // Agar callId null bo'lsa, oddiy create ishlatamiz
    if (!data.callId) {
      return this.prisma.call.create({ data });
    }
    
    try {
      return await this.prisma.call.upsert({
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
    } catch (error: any) {
      // Agar upsert ishlamasa (masalan, unique constraint muammosi), oddiy create ishlatamiz
      if (error.code === 'P2002' || error.message?.includes('Unique constraint')) {
        // CallId allaqachon mavjud, yangilash
        const existingCall = await this.prisma.call.findUnique({
          where: { callId: data.callId },
        });
        if (existingCall) {
          return this.prisma.call.update({
            where: { id: existingCall.id },
            data: {
              direction: data.direction,
              fromNumber: data.fromNumber,
              toNumber: data.toNumber,
              recordingPath: data.recordingPath,
              startTime: data.startTime,
              status: data.status,
            },
          });
        }
      }
      throw error;
    }
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

