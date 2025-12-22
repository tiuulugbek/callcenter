import { Module, forwardRef } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CallsController } from './calls.controller';
import { AsteriskModule } from '../asterisk/asterisk.module';

@Module({
  imports: [forwardRef(() => AsteriskModule)],
  providers: [CallsService],
  controllers: [CallsController],
  exports: [CallsService],
})
export class CallsModule {}
