import { FormEvent, useState } from 'react';
import { storePassword, verifyPassword } from './auth';

export default function AppLock({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsChecking(true);
    setError(null);
    try {
      const isCorrect = await verifyPassword(password);
      if (!isCorrect) {
        setError('Incorrect password.');
        return;
      }
      storePassword(password);
      onUnlock();
    } catch {
      setError('Could not reach the server.');
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <p className="font-mono text-xs uppercase tracking-widest text-brass mb-3">Consent Gate</p>
        <h1 className="font-display text-2xl mb-6">Enter the password to continue.</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          placeholder="Password"
          className="w-full bg-panel border border-hairline rounded-md px-4 py-3 text-ink mb-4"
        />
        <button
          type="submit"
          disabled={isChecking || !password}
          className="w-full bg-brass text-void rounded-md px-4 py-3 font-medium disabled:opacity-40"
        >
          {isChecking ? 'Checking…' : 'Unlock'}
        </button>
        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
      </form>
    </div>
  );
}
