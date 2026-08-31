import { Controller, Get, UseGuards } from '@nestjs/common';
import { StateRulesService } from './state-rules.service';
import { AppPasswordGuard } from '../auth/app-password.guard';

@UseGuards(AppPasswordGuard)
@Controller('state-rule')
export class StateRulesController {
  constructor(private readonly stateRules: StateRulesService) {}

  @Get()
  list() {
    return this.stateRules.listStates();
  }
}
