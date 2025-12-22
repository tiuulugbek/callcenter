import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OperatorsService {
  constructor(private prisma: PrismaService) {}

  async findByUsername(username: string) {
    return this.prisma.operator.findUnique({
      where: { username },
    });
  }

  async findById(id: string) {
    return this.prisma.operator.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.operator.findMany({
      select: {
        id: true,
        name: true,
        extension: true,
        status: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.operator.update({
      where: { id },
      data: { status },
    });
  }

  async create(data: {
    name: string;
    extension: string;
    username: string;
    password: string;
    role?: string;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.operator.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role || 'operator',
      },
    });
  }
}

