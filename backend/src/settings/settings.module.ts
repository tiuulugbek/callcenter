import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { SipTrunkService } from './sip-trunk.service';
import { OperatorsModule } from '../operators/operators.module';

@Module({
  imports: [OperatorsModule],
  providers: [SettingsService, SipTrunkService],
  controllers: [SettingsController],
  exports: [SettingsService],
})
export class SettingsModule {}

