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

export enum GateOutcome {
  Recorded = 'recorded',
  NotRecorded = 'not-recorded',
  BugRecordedUnconfirmed = 'bug-recorded-unconfirmed',
}

export type ConsentClassification = 'yes' | 'no' | 'unclear';

export interface ConsentClassificationResult {
  classification: ConsentClassification;
  shouldRetry: boolean;
}

export interface CreateCallInput {
  candidateState: string;
  consentRule: ConsentRule;
  gateOutcome: GateOutcome;
  transcriptText: string;
}

export interface Transcript {
  id: string;
  candidateState: string;
  consentRule: ConsentRule;
  gateOutcome: GateOutcome;
  disclosureSaid: boolean | null;
  consentGiven: boolean | null;
  compliant: boolean | null;
  shouldBeDeleted: boolean | null;
  transcriptText: string;
  createdAt: string;
}
