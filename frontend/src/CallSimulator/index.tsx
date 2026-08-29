import { useEffect, useState } from 'react';
import { listStateRules } from '../api';
import type { StateRuleInfo } from '../types';
import ConsentLawIntro from './ConsentLawIntro';
import StateSelect from './StateSelect';
import ConsentRuleCard from './ConsentRuleCard';
import ConsentFlow from './ConsentFlow';

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
      {selected && (
        <ConsentFlow key={selected.state} candidateState={selected.state} consentRule={selected.consentRule} />
      )}
      {error && <p className="mt-6 text-red-400">{error}</p>}
    </div>
  );
}
