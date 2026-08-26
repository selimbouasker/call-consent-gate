import type { StateRuleInfo } from '../types';

export function consequenceCopy(info: StateRuleInfo): string {
  if (info.consentRule === 'all-party') {
    return `Every participant must agree before the call can be recorded. If the call reaches a one-party state, ${info.stateName}'s rule still governs — the stricter rule always wins.`;
  }
  return `Only the recorder needs to agree here. But if the call reaches an all-party state, that state's rule governs instead — the stricter rule always wins.`;
}
