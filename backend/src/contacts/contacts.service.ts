import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string) {
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }

    const contacts = await this.prisma.contact.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });

    // _count ni qo'lda qo'shish
    return Promise.all(
      contacts.map(async (contact) => {
        const [callsCount, chatsCount] = await Promise.all([
          this.prisma.call.count({ where: { contactId: contact.id } }),
          this.prisma.chat.count({ where: { contactId: contact.id } }),
        ]);

        return {
          ...contact,
          _count: {
            calls: callsCount,
            chats: chatsCount,
          },
        };
      })
    );
  }

  async findById(id: string) {
    return this.prisma.contact.findUnique({
      where: { id },
      include: {
        calls: {
          orderBy: { startTime: 'desc' },
          take: 10,
          include: {
            operator: {
              select: {
                id: true,
                name: true,
                extension: true,
              },
            },
          },
        },
        chats: {
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 10,
            },
          },
        },
      },
    });
  }

  async findByPhone(phone: string) {
    return this.prisma.contact.findFirst({
      where: {
        phone: {
          contains: phone,
        },
      },
    });
  }

  async create(data: {
    name: string;
    phone?: string;
    email?: string;
    company?: string;
    notes?: string;
  }) {
    return this.prisma.contact.create({
      data,
    });
  }

  async update(id: string, data: {
    name?: string;
    phone?: string;
    email?: string;
    company?: string;
    notes?: string;
  }) {
    return this.prisma.contact.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.contact.delete({
      where: { id },
    });
  }

  async linkCall(contactId: string, callId: string) {
    return this.prisma.call.update({
      where: { id: callId },
      data: { contactId },
    });
  }

  async linkChat(contactId: string, chatId: string) {
    return this.prisma.chat.update({
      where: { id: chatId },
      data: { contactId },
    });
  }
}

