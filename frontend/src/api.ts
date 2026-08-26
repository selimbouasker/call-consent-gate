import type { StateRuleInfo } from './types';

export async function listStateRules(): Promise<StateRuleInfo[]> {
  const res = await fetch('/api/state-rule');
  if (!res.ok) {
    throw new Error('Failed to load state rules');
  }
  return res.json();
}
