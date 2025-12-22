import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { OperatorsService } from './operators.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('operators')
@UseGuards(JwtAuthGuard)
export class OperatorsController {
  constructor(private operatorsService: OperatorsService) {}

  @Get()
  findAll() {
    return this.operatorsService.findAll();
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.operatorsService.updateStatus(id, status);
  }
}

