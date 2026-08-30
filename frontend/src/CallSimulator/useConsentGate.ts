import { useState } from 'react';
import { classifyConsent, createCall } from '../api';
import { ConsentRule, GateOutcome } from '../types';

export type GateStatus =
  | 'awaiting_consent'
  | 'awaiting_retry'
  | 'recording'
  | 'not_recording'
  | 'bug_unconfirmed'
  | 'ended';

export interface TranscriptTurn {
  speaker: 'agent' | 'candidate';
  text: string;
}

const DISCLOSURE =
  'This call may be recorded. Please respond with "yes, I consent" or "no, I don\'t consent."';
const REASK = 'Just to confirm clearly: yes or no?';
const BUG_NOTE = '[bug: the consent question was skipped, but the call was recorded anyway]';

export function useConsentGate(candidateState: string, consentRule: ConsentRule, onEnded?: () => void) {
  const [status, setStatus] = useState<GateStatus>('awaiting_consent');
  const [transcript, setTranscript] = useState<TranscriptTurn[]>([{ speaker: 'agent', text: DISCLOSURE }]);
  const [isRetryPending, setIsRetryPending] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isResolved = status === 'recording' || status === 'not_recording' || status === 'bug_unconfirmed';

  async function submitReply(reply: string) {
    if (!reply.trim() || isBusy) return;
    setIsBusy(true);
    setError(null);
    setTranscript((turns) => [...turns, { speaker: 'candidate', text: reply }]);

    try {
      const result = await classifyConsent(reply, isRetryPending);
      if (result.classification === 'yes') {
        setStatus('recording');
      } else if (result.classification === 'no') {
        setStatus('not_recording');
      } else if (result.shouldRetry) {
        setIsRetryPending(true);
        setStatus('awaiting_retry');
        setTranscript((turns) => [...turns, { speaker: 'agent', text: REASK }]);
      } else {
        setStatus('not_recording');
      }
    } catch {
      setError('Could not classify that reply. Try again.');
    } finally {
      setIsBusy(false);
    }
  }

  function simulateBug() {
    setTranscript([{ speaker: 'agent', text: BUG_NOTE }]);
    setStatus('bug_unconfirmed');
  }

  async function endCall() {
    if (!isResolved || isBusy) return;
    setIsBusy(true);
    setError(null);

    const gateOutcome =
      status === 'recording'
        ? GateOutcome.Recorded
        : status === 'bug_unconfirmed'
          ? GateOutcome.BugRecordedUnconfirmed
          : GateOutcome.NotRecorded;

    try {
      await createCall({
        candidateState,
        consentRule,
        gateOutcome,
        transcriptText: transcript.map((turn) => `${turn.speaker}: ${turn.text}`).join('\n'),
      });
      setStatus('ended');
      onEnded?.();
    } catch {
      setError('Could not save the call. Try again.');
    } finally {
      setIsBusy(false);
    }
  }

  return { status, transcript, isBusy, isResolved, error, submitReply, simulateBug, endCall };
}
