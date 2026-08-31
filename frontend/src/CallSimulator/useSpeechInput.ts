import { useCallback, useRef, useState } from 'react';

interface SpeechRecognitionResultItem {
  [index: number]: { transcript: string };
  isFinal: boolean;
}

interface SpeechRecognitionResultLike {
  resultIndex: number;
  results: { [index: number]: SpeechRecognitionResultItem; length: number };
}

interface SpeechRecognitionErrorLike {
  error: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionResultLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function describeSpeechError(code: string): string {
  switch (code) {
    case 'no-speech':
      return "Didn't catch any speech — try again.";
    case 'audio-capture':
      return 'No microphone found.';
    case 'network':
      return 'Speech recognition needs a network connection to the browser’s speech service — some browsers (Brave, for example) block it by default.';
    case 'aborted':
      return 'Listening was interrupted.';
    default:
      return `Speech recognition error: ${code}`;
  }
}

export function useSpeechInput(onFinalResult: (text: string) => void) {
  const [isSupported] = useState(() => getSpeechRecognitionConstructor() !== null);
  const [isListening, setIsListening] = useState(false);
  const [micBlocked, setMicBlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const start = useCallback(() => {
    const RecognitionConstructor = getSpeechRecognitionConstructor();
    if (!RecognitionConstructor) return;

    setError(null);
    setInterimText('');
    const recognition = new RecognitionConstructor();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      setInterimText(interim);
      if (final) {
        onFinalResult(final);
      }
    };
    recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setMicBlocked(true);
      } else {
        setError(describeSpeechError(event.error));
      }
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
      setInterimText('');
    };

    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  }, [onFinalResult]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return { isSupported, isListening, micBlocked, error, interimText, start, stop };
}
