import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

const DEFAULT_STAGES = [
  { name: 'Yangi lidlar', color: '#3b82f6', order: 0 },
  { name: 'Bog\'lanildi', color: '#f59e0b', order: 1 },
  { name: 'Taklif yuborildi', color: '#8b5cf6', order: 2 },
  { name: 'To\'lov kutilmoqda', color: '#06b6d4', order: 3 },
  { name: 'Muvaffaqiyatli', color: '#10b981', order: 4 },
  { name: 'Rad etildi', color: '#ef4444', order: 5 },
];

@Injectable()
export class PipelinesService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    // Agar umuman voronka bo'lmasa, dastlabki voronkani avtomatik yaratamiz
    try {
      const count = await this.prisma.pipeline.count();
      if (count === 0) {
        await this.create({
          name: 'Asosiy voronka',
          description: 'Standart savdo va qo\'ng\'iroqlar voronkasi',
          isDefault: true,
        });
      }
    } catch (e: any) {
      // Baza hali ulanmagan bo'lsa xatolik bermaydi
    }
  }

  async findAll() {
    return this.prisma.pipeline.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        stages: {
          orderBy: { order: 'asc' },
          include: {
            _count: {
              select: { deals: true },
            },
          },
        },
        _count: {
          select: { deals: true },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.pipeline.findUnique({
      where: { id },
      include: {
        stages: {
          orderBy: { order: 'asc' },
          include: {
            deals: {
              orderBy: { updatedAt: 'desc' },
              include: {
                contact: true,
                operator: {
                  select: { id: true, name: true, extension: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async create(data: { name: string; description?: string; isDefault?: boolean }) {
    const pipeline = await this.prisma.pipeline.create({
      data: {
        name: data.name,
        description: data.description,
        isDefault: data.isDefault || false,
        stages: {
          create: DEFAULT_STAGES,
        },
      },
      include: {
        stages: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return pipeline;
  }

  async update(id: string, data: { name?: string; description?: string; isDefault?: boolean }) {
    return this.prisma.pipeline.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.pipeline.delete({
      where: { id },
    });
  }

  async addStage(pipelineId: string, data: { name: string; color?: string }) {
    const lastStage = await this.prisma.stage.findFirst({
      where: { pipelineId },
      orderBy: { order: 'desc' },
    });
    const order = lastStage ? lastStage.order + 1 : 0;

    return this.prisma.stage.create({
      data: {
        name: data.name,
        color: data.color || '#3b82f6',
        order,
        pipelineId,
      },
    });
  }

  async updateStage(stageId: string, data: { name?: string; color?: string; order?: number }) {
    return this.prisma.stage.update({
      where: { id: stageId },
      data,
    });
  }

  async deleteStage(stageId: string) {
    return this.prisma.stage.delete({
      where: { id: stageId },
    });
  }
}
