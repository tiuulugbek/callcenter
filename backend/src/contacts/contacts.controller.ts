import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Get()
  async findAll(@Query('search') search?: string) {
    return this.contactsService.findAll(search);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.contactsService.findById(id);
  }

  @Post()
  async create(@Body() data: {
    name: string;
    phone?: string;
    email?: string;
    company?: string;
    notes?: string;
  }) {
    return this.contactsService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: {
      name?: string;
      phone?: string;
      email?: string;
      company?: string;
      notes?: string;
    },
  ) {
    return this.contactsService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.contactsService.delete(id);
  }

  @Post(':id/link-call')
  async linkCall(
    @Param('id') contactId: string,
    @Body() data: { callId: string },
  ) {
    return this.contactsService.linkCall(contactId, data.callId);
  }

  @Post(':id/link-chat')
  async linkChat(
    @Param('id') contactId: string,
    @Body() data: { chatId: string },
  ) {
    return this.contactsService.linkChat(contactId, data.chatId);
  }
}

