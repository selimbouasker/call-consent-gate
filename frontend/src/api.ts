import type { ConsentClassificationResult, CreateCallInput, StateRuleInfo, Transcript } from './types';
import { apiFetch } from './auth';

export async function listStateRules(): Promise<StateRuleInfo[]> {
  const res = await apiFetch('/api/state-rule');
  if (!res.ok) {
    throw new Error('Failed to load state rules');
  }
  return res.json();
}

export async function classifyConsent(reply: string, isRetry: boolean): Promise<ConsentClassificationResult> {
  const res = await apiFetch('/api/consent/classify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply, isRetry }),
  });
  if (!res.ok) {
    throw new Error('Failed to classify the reply');
  }
  return res.json();
}

export async function createCall(input: CreateCallInput): Promise<void> {
  const res = await apiFetch('/api/calls', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error('Failed to save the call');
  }
}

export async function listCalls(): Promise<Transcript[]> {
  const res = await apiFetch('/api/calls');
  if (!res.ok) {
    throw new Error('Failed to load calls');
  }
  return res.json();
}
