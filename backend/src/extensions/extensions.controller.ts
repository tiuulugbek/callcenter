import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ExtensionsService } from './extensions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('extensions')
@UseGuards(JwtAuthGuard)
export class ExtensionsController {
  constructor(private extensionsService: ExtensionsService) {}

  @Get()
  findAll() {
    return this.extensionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.extensionsService.findById(id);
  }

  @Get(':id/status')
  async getStatus(@Param('id') id: string) {
    const extension = await this.extensionsService.findById(id);
    if (!extension) {
      throw new Error('Extension topilmadi');
    }
    return this.extensionsService.getStatus(extension.extension);
  }

  @Post()
  create(@Body() body: {
    extension: string;
    password: string;
    displayName?: string;
    context?: string;
    transport?: string;
    codecs?: string;
  }) {
    return this.extensionsService.create(body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: {
      password?: string;
      displayName?: string;
      context?: string;
      transport?: string;
      codecs?: string;
    },
  ) {
    return this.extensionsService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.extensionsService.delete(id);
  }
}

