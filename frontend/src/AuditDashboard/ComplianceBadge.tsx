export default function ComplianceBadge({ compliant }: { compliant: boolean | null }) {
  if (compliant === null) {
    return <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">Pending</span>;
  }
  return (
    <span
      className={
        'font-mono text-xs uppercase tracking-widest rounded px-2 py-1 border ' +
        (compliant
          ? 'text-slate border-slate-dim bg-slate-dim/40'
          : 'text-red-400 border-red-900 bg-red-950/40')
      }
    >
      {compliant ? 'Compliant' : 'Non-compliant'}
    </span>
  );
}
