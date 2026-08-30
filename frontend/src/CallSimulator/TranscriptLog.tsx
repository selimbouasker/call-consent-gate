import type { TranscriptTurn } from './useConsentGate';

interface TranscriptLogProps {
  turns: TranscriptTurn[];
  liveCandidateText?: string;
}

export default function TranscriptLog({ turns, liveCandidateText }: TranscriptLogProps) {
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
      {liveCandidateText !== undefined && (
        <p className="text-sm leading-relaxed">
          <span className="font-mono text-xs uppercase tracking-widest text-ink-muted mr-2">Candidate</span>
          <span className="text-ink-muted italic">{liveCandidateText || '…'}</span>
        </p>
      )}
    </div>
  );
}
