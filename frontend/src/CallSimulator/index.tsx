import { useEffect, useState } from 'react';
import { listStateRules } from '../api';
import type { StateRuleInfo } from '../types';
import ConsentLawIntro from './ConsentLawIntro';
import StateSelect from './StateSelect';
import ConsentRuleCard from './ConsentRuleCard';

export default function CallSimulator() {
  const [states, setStates] = useState<StateRuleInfo[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listStateRules()
      .then(setStates)
      .catch(() => setError('Could not load the list of candidate states.'));
  }, []);

  const selected = states.find((s) => s.state === selectedState) ?? null;

  return (
    <div>
      <ConsentLawIntro />
      <StateSelect states={states} value={selectedState} onChange={setSelectedState} />
      {selected && <ConsentRuleCard info={selected} />}
      {error && <p className="mt-6 text-red-400">{error}</p>}
    </div>
  );
}
