import type { StateRuleInfo } from '../types';

interface StateSelectProps {
  states: StateRuleInfo[];
  value: string;
  onChange: (state: string) => void;
}

export default function StateSelect({ states, value, onChange }: StateSelectProps) {
  return (
    <div>
      <label className="font-mono text-xs uppercase tracking-widest text-ink-muted block mb-2">
        Candidate&rsquo;s state
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-panel border border-hairline rounded-md px-4 py-3 text-ink appearance-none cursor-pointer"
      >
        <option value="" disabled>
          Select a state…
        </option>
        {states.map((s) => (
          <option key={s.state} value={s.state}>
            {s.stateName}
          </option>
        ))}
      </select>
    </div>
  );
}
