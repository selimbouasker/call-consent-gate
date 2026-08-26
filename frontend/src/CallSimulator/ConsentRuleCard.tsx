import { ConsentRule, type StateRuleInfo } from '../types';
import { consequenceCopy } from './consequence-copy';

interface ConsentRuleCardProps {
  info: StateRuleInfo;
}

export default function ConsentRuleCard({ info }: ConsentRuleCardProps) {
  return (
    <div key={info.state} className="animate-rise mt-6 border border-hairline bg-raised rounded-md p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-display text-2xl">{info.stateName}</h2>
        <span
          className={
            'font-mono text-xs uppercase tracking-widest rounded px-2 py-1 border ' +
            (info.consentRule === ConsentRule.AllParty
              ? 'text-brass border-brass-dim bg-brass-dim/20'
              : 'text-slate border-slate-dim bg-slate-dim/40')
          }
        >
          {info.consentRule}
        </span>
      </div>
      <p className="text-ink-muted leading-relaxed">{consequenceCopy(info)}</p>
    </div>
  );
}
