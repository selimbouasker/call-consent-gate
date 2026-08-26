import { Injectable } from '@nestjs/common';

export type ConsentRule = 'one-party' | 'all-party';

export interface StateRuleInfo {
  state: string;
  stateName: string;
  consentRule: ConsentRule;
}

const STATES: StateRuleInfo[] = [
  { state: 'TX', stateName: 'Texas', consentRule: 'one-party' },
  { state: 'NY', stateName: 'New York', consentRule: 'one-party' },
  { state: 'CA', stateName: 'California', consentRule: 'all-party' },
  { state: 'IL', stateName: 'Illinois', consentRule: 'all-party' },
  { state: 'FL', stateName: 'Florida', consentRule: 'all-party' },
  { state: 'WA', stateName: 'Washington', consentRule: 'all-party' },
];

@Injectable()
export class StateRulesService {
  listStates(): StateRuleInfo[] {
    return STATES;
  }
}
