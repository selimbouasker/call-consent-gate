import CallSimulator from './CallSimulator';
import AuditDashboard from './AuditDashboard';

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-hairline">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-baseline justify-between">
          <span className="font-display text-lg tracking-tight">
            Consent<span className="text-brass">Gate</span>
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="max-w-2xl">
          <CallSimulator />
        </div>
        <AuditDashboard />
      </main>
    </div>
  );
}
