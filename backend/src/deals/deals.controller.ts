import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DealsService } from './deals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('deals')
@UseGuards(JwtAuthGuard)
export class DealsController {
  constructor(private dealsService: DealsService) {}

  @Get()
  findAll(
    @Query('pipelineId') pipelineId?: string,
    @Query('stageId') stageId?: string,
    @Query('contactId') contactId?: string,
  ) {
    return this.dealsService.findAll({ pipelineId, stageId, contactId });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.dealsService.findById(id);
  }

  @Post()
  create(
    @Request() req: any,
    @Body()
    body: {
      title: string;
      amount?: number;
      pipelineId: string;
      stageId: string;
      contactId?: string;
      operatorId?: string;
      notes?: string;
    },
  ) {
    // Agar operatorId ko'rsatilmagan bo'lsa, tizimga kirgan operatorni biriktiramiz
    const operatorId = body.operatorId || req.user?.id;
    return this.dealsService.create({ ...body, operatorId });
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      amount?: number;
      pipelineId?: string;
      stageId?: string;
      contactId?: string;
      operatorId?: string;
      notes?: string;
    },
  ) {
    return this.dealsService.update(id, body);
  }

  @Patch(':id/stage')
  updateStage(
    @Param('id') id: string,
    @Body() body: { stageId: string },
  ) {
    return this.dealsService.updateStage(id, body.stageId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.dealsService.delete(id);
  }
}
