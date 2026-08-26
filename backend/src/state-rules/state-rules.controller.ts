import { Controller, Get } from '@nestjs/common';
import { StateRulesService } from './state-rules.service';

@Controller('state-rule')
export class StateRulesController {
  constructor(private readonly stateRules: StateRulesService) {}

  @Get()
  list() {
    return this.stateRules.listStates();
  }
}
