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
