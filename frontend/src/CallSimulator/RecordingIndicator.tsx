import type { GateStatus } from './useConsentGate';

const LABELS: Record<GateStatus, string> = {
  awaiting_consent: 'Awaiting consent',
  awaiting_retry: 'Awaiting confirmation',
  recording: 'Recording',
  not_recording: 'Not recording',
  bug_unconfirmed: 'Recording (unconfirmed)',
  ended: 'Call ended',
};

export default function RecordingIndicator({ status }: { status: GateStatus }) {
  const isLive = status === 'recording' || status === 'bug_unconfirmed';
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest"
    >
      <span
        aria-hidden="true"
        className={'h-2 w-2 rounded-full ' + (isLive ? 'bg-red-500 animate-pulse' : 'bg-slate')}
      />
      <span className={isLive ? 'text-red-400' : 'text-ink-muted'}>{LABELS[status]}</span>
    </div>
  );
}
