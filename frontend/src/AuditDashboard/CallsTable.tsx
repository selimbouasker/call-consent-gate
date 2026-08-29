import type { Transcript } from '../types';
import ComplianceBadge from './ComplianceBadge';

export default function CallsTable({ calls }: { calls: Transcript[] }) {
  if (calls.length === 0) {
    return <p className="text-ink-muted mt-6">No calls match these filters.</p>;
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left font-mono text-xs uppercase tracking-widest text-ink-muted border-b border-hairline">
            <th className="py-2 pr-4">State</th>
            <th className="py-2 pr-4">Rule</th>
            <th className="py-2 pr-4">Gate outcome</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Delete?</th>
            <th className="py-2 pr-4">Created</th>
          </tr>
        </thead>
        <tbody>
          {calls.map((call) => (
            <tr key={call.id} className="border-b border-hairline/50">
              <td className="py-2 pr-4">{call.candidateState}</td>
              <td className="py-2 pr-4">{call.consentRule}</td>
              <td className="py-2 pr-4">{call.gateOutcome}</td>
              <td className="py-2 pr-4">
                <ComplianceBadge compliant={call.compliant} />
              </td>
              <td className="py-2 pr-4">
                {call.shouldBeDeleted ? <span className="text-brass">Flagged</span> : '—'}
              </td>
              <td className="py-2 pr-4 text-ink-muted">{new Date(call.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
