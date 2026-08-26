import { Injectable } from '@nestjs/common';

export enum ConsentRule {
  OneParty = 'one-party',
  AllParty = 'all-party',
}

export enum StateCode {
  TX = 'TX',
  NY = 'NY',
  CA = 'CA',
  IL = 'IL',
  FL = 'FL',
  WA = 'WA',
}

export interface StateRuleInfo {
  state: StateCode;
  stateName: string;
  consentRule: ConsentRule;
}

const STATES: StateRuleInfo[] = [
  { state: StateCode.TX, stateName: 'Texas', consentRule: ConsentRule.OneParty },
  { state: StateCode.NY, stateName: 'New York', consentRule: ConsentRule.OneParty },
  { state: StateCode.CA, stateName: 'California', consentRule: ConsentRule.AllParty },
  { state: StateCode.IL, stateName: 'Illinois', consentRule: ConsentRule.AllParty },
  { state: StateCode.FL, stateName: 'Florida', consentRule: ConsentRule.AllParty },
  { state: StateCode.WA, stateName: 'Washington', consentRule: ConsentRule.AllParty },
];

@Injectable()
export class StateRulesService {
  listStates(): StateRuleInfo[] {
    return STATES;
  }
}
