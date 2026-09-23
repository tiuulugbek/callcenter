import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: { pipelineId?: string; stageId?: string; contactId?: string }) {
    const where: any = {};
    if (query?.pipelineId) where.pipelineId = query.pipelineId;
    if (query?.stageId) where.stageId = query.stageId;
    if (query?.contactId) where.contactId = query.contactId;

    return this.prisma.deal.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        contact: true,
        operator: {
          select: { id: true, name: true, extension: true },
        },
        stage: true,
      },
    });
  }

  async findById(id: string) {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
      include: {
        contact: true,
        operator: {
          select: { id: true, name: true, extension: true },
        },
        stage: true,
        pipeline: true,
      },
    });

    if (!deal) {
      throw new NotFoundException(`Bitim topilmadi (ID: ${id})`);
    }

    return deal;
  }

  async create(data: {
    title: string;
    amount?: number;
    pipelineId: string;
    stageId: string;
    contactId?: string;
    operatorId?: string;
    notes?: string;
  }) {
    return this.prisma.deal.create({
      data: {
        title: data.title,
        amount: data.amount !== undefined ? Number(data.amount) : 0,
        pipelineId: data.pipelineId,
        stageId: data.stageId,
        contactId: data.contactId || null,
        operatorId: data.operatorId || null,
        notes: data.notes || null,
      },
      include: {
        contact: true,
        operator: {
          select: { id: true, name: true, extension: true },
        },
        stage: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      amount?: number;
      pipelineId?: string;
      stageId?: string;
      contactId?: string | null;
      operatorId?: string | null;
      notes?: string | null;
    },
  ) {
    const updateData: any = { ...data };
    if (updateData.amount !== undefined) {
      updateData.amount = Number(updateData.amount);
    }

    return this.prisma.deal.update({
      where: { id },
      data: updateData,
      include: {
        contact: true,
        operator: {
          select: { id: true, name: true, extension: true },
        },
        stage: true,
      },
    });
  }

  async updateStage(id: string, stageId: string) {
    return this.prisma.deal.update({
      where: { id },
      data: { stageId },
      include: {
        contact: true,
        operator: {
          select: { id: true, name: true, extension: true },
        },
        stage: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.deal.delete({
      where: { id },
    });
  }
}
