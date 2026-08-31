import { useEffect, useState } from 'react';
import { listCalls } from '../api';
import { ConsentRule, type Transcript } from '../types';
import CallsTable from './CallsTable';

type ComplianceFilter = 'all' | 'compliant' | 'non-compliant';
type RuleFilter = 'all' | ConsentRule;

export default function AuditDashboard() {
  const [calls, setCalls] = useState<Transcript[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [complianceFilter, setComplianceFilter] = useState<ComplianceFilter>('all');
  const [ruleFilter, setRuleFilter] = useState<RuleFilter>('all');
  const [stateFilter, setStateFilter] = useState('all');

  useEffect(() => {
    listCalls()
      .then(setCalls)
      .catch(() => setError('Could not load the call log.'));
  }, []);

  const states = Array.from(new Set(calls.map((call) => call.candidateState))).sort();

  const filtered = calls.filter((call) => {
    if (complianceFilter === 'compliant' && call.compliant !== true) return false;
    if (complianceFilter === 'non-compliant' && call.compliant !== false) return false;
    if (ruleFilter !== 'all' && call.consentRule !== ruleFilter) return false;
    if (stateFilter !== 'all' && call.candidateState !== stateFilter) return false;
    return true;
  });

  return (
    <div className="mt-16 border-t border-hairline pt-8">
      <p className="font-mono text-xs uppercase tracking-widest text-brass mb-3">Call log</p>
      <h1 className="font-display text-3xl mb-6">Every call, audited — not just the ones that failed loudly.</h1>

      <div className="flex flex-wrap gap-4">
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="bg-panel border border-hairline rounded-md px-3 py-2 text-sm"
        >
          <option value="all">All states</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <select
          value={ruleFilter}
          onChange={(e) => setRuleFilter(e.target.value as RuleFilter)}
          className="bg-panel border border-hairline rounded-md px-3 py-2 text-sm"
        >
          <option value="all">All rules</option>
          <option value={ConsentRule.OneParty}>One-party</option>
          <option value={ConsentRule.AllParty}>All-party</option>
        </select>

        <select
          value={complianceFilter}
          onChange={(e) => setComplianceFilter(e.target.value as ComplianceFilter)}
          className="bg-panel border border-hairline rounded-md px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="compliant">Compliant</option>
          <option value="non-compliant">Non-compliant</option>
        </select>
      </div>

      <CallsTable calls={filtered} />
      {error && <p className="mt-6 text-red-400">{error}</p>}
    </div>
  );
}
