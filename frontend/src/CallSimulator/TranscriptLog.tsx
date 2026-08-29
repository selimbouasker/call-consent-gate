import type { TranscriptTurn } from './useConsentGate';

export default function TranscriptLog({ turns }: { turns: TranscriptTurn[] }) {
  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {turns.map((turn, i) => (
        <p key={i} className="text-sm leading-relaxed">
          <span className="font-mono text-xs uppercase tracking-widest text-ink-muted mr-2">
            {turn.speaker === 'agent' ? 'Agent' : 'Candidate'}
          </span>
          {turn.text}
        </p>
      ))}
    </div>
  );
}
