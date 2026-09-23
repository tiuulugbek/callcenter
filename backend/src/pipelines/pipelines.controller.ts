import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PipelinesService } from './pipelines.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('pipelines')
@UseGuards(JwtAuthGuard)
export class PipelinesController {
  constructor(private pipelinesService: PipelinesService) {}

  @Get()
  findAll() {
    return this.pipelinesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.pipelinesService.findById(id);
  }

  @Post()
  create(@Body() body: { name: string; description?: string }) {
    return this.pipelinesService.create(body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string; isDefault?: boolean },
  ) {
    return this.pipelinesService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.pipelinesService.delete(id);
  }

  @Post(':id/stages')
  addStage(
    @Param('id') pipelineId: string,
    @Body() body: { name: string; color?: string },
  ) {
    return this.pipelinesService.addStage(pipelineId, body);
  }

  @Put('stages/:stageId')
  updateStage(
    @Param('stageId') stageId: string,
    @Body() body: { name?: string; color?: string; order?: number },
  ) {
    return this.pipelinesService.updateStage(stageId, body);
  }

  @Delete('stages/:stageId')
  deleteStage(@Param('stageId') stageId: string) {
    return this.pipelinesService.deleteStage(stageId);
  }
}
