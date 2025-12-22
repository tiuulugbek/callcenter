import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { SipTrunkService } from './sip-trunk.service';
import { SipExtensionService } from './sip-extension.service';
import { OperatorsModule } from '../operators/operators.module';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [OperatorsModule, PrismaModule],
  providers: [SettingsService, SipTrunkService, SipExtensionService],
  controllers: [SettingsController],
  exports: [SettingsService],
})
export class SettingsModule {}

