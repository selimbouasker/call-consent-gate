import { useState } from 'react';
import type { ConsentRule } from '../types';
import { useConsentGate } from './useConsentGate';
import { useSpeechInput } from './useSpeechInput';
import RecordingIndicator from './RecordingIndicator';
import TranscriptLog from './TranscriptLog';
import VoiceInputButton from './VoiceInputButton';

interface ConsentFlowProps {
  candidateState: string;
  consentRule: ConsentRule;
  onEnded?: () => void;
}

export default function ConsentFlow({ candidateState, consentRule, onEnded }: ConsentFlowProps) {
  const { status, transcript, isBusy, isResolved, error, submitReply, simulateBug, endCall } =
    useConsentGate(candidateState, consentRule, onEnded);
  const {
    isSupported: isVoiceSupported,
    isListening,
    micBlocked,
    error: voiceError,
    interimText,
    start: startListening,
    stop: stopListening,
  } = useSpeechInput(submitReply);
  const [reply, setReply] = useState('');
  const isEnded = status === 'ended';
  const canUseVoice = isVoiceSupported && !micBlocked;

  return (
    <div className="mt-10 border-t border-hairline pt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl">Simulate the call</h2>
        <RecordingIndicator status={status} />
      </div>

      <TranscriptLog turns={transcript} liveCandidateText={isListening ? interimText : undefined} />

      {!isResolved && !isEnded && (
        <div className="mt-4">
          {canUseVoice ? (
            <VoiceInputButton
              isListening={isListening}
              onToggle={isListening ? stopListening : startListening}
              disabled={isBusy}
            />
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const text = reply;
                setReply('');
                submitReply(text);
              }}
              className="flex gap-2"
            >
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Candidate's reply…"
                disabled={isBusy}
                className="flex-1 bg-panel border border-hairline rounded-md px-4 py-2 text-ink"
              />
              <button
                type="submit"
                disabled={isBusy || !reply.trim()}
                className="bg-slate-dim rounded-md px-4 py-2 disabled:opacity-40"
              >
                Send
              </button>
            </form>
          )}
          {voiceError && <p className="mt-2 text-xs text-red-400">{voiceError}</p>}
        </div>
      )}

      {!isEnded && (
        <div className="mt-4 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-ink-muted">
            <input
              type="checkbox"
              disabled={isResolved}
              onChange={(e) => e.target.checked && simulateBug()}
            />
            Simulate agent bug (skip consent question)
          </label>
          {isResolved && (
            <button
              onClick={endCall}
              disabled={isBusy}
              className="bg-brass text-void rounded-md px-4 py-2 font-medium disabled:opacity-40"
            >
              End call &amp; save
            </button>
          )}
        </div>
      )}

      {isEnded && <p className="mt-4 text-slate">Call saved.</p>}
      {error && <p className="mt-4 text-red-400">{error}</p>}
    </div>
  );
}
