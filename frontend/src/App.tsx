import { useState } from 'react';
import CallSimulator from './CallSimulator';
import AuditDashboard from './AuditDashboard';
import AppLock from './AppLock';
import { getStoredPassword } from './auth';

type Tab = 'simulator' | 'audit';

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={
        'font-mono text-xs uppercase tracking-widest px-3 py-2 rounded-md ' +
        (active ? 'text-brass bg-brass-dim/20' : 'text-ink-muted hover:text-ink')
      }
    >
      {children}
    </button>
  );
}

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(() => getStoredPassword() !== null);
  const [tab, setTab] = useState<Tab>('simulator');

  if (!isUnlocked) {
    return <AppLock onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-hairline">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="font-display text-lg tracking-tight">
            Consent<span className="text-brass">Gate</span>
          </span>
          <nav role="tablist" aria-label="Sections" className="flex gap-1">
            <TabButton active={tab === 'simulator'} onClick={() => setTab('simulator')}>
              Simulator
            </TabButton>
            <TabButton active={tab === 'audit'} onClick={() => setTab('audit')}>
              Audit log
            </TabButton>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {tab === 'simulator' ? (
          <div className="max-w-2xl">
            <CallSimulator />
          </div>
        ) : (
          <AuditDashboard />
        )}
      </main>
    </div>
  );
}
