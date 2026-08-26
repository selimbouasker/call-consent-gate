export type ConsentRule = 'one-party' | 'all-party';

export interface StateRuleInfo {
  state: string;
  stateName: string;
  consentRule: ConsentRule;
}
