import CallSimulator from './CallSimulator';

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-hairline">
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-baseline justify-between">
          <span className="font-display text-lg tracking-tight">
            Consent<span className="text-brass">Gate</span>
          </span>
          <span className="font-mono text-xs text-ink-muted uppercase tracking-widest">
            Call Simulator
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16">
        <CallSimulator />
      </main>
    </div>
  );
}
