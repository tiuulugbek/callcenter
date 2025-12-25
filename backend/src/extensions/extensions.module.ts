import { Module } from '@nestjs/common';
import { ExtensionsService } from './extensions.service';
import { ExtensionsController } from './extensions.controller';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ExtensionsService],
  controllers: [ExtensionsController],
  exports: [ExtensionsService],
})
export class ExtensionsModule {}

