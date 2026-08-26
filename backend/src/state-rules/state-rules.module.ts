import { Module } from '@nestjs/common';
import { StateRulesController } from './state-rules.controller';
import { StateRulesService } from './state-rules.service';

@Module({
  controllers: [StateRulesController],
  providers: [StateRulesService],
})
export class StateRulesModule {}
