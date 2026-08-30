interface VoiceInputButtonProps {
  isListening: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function VoiceInputButton({ isListening, onToggle, disabled }: VoiceInputButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={isListening}
      className={
        'rounded-md px-4 py-2 border font-mono text-xs uppercase tracking-widest disabled:opacity-40 ' +
        (isListening
          ? 'border-red-900 text-red-400 bg-red-950/40'
          : 'border-hairline text-ink-muted hover:text-ink')
      }
    >
      {isListening ? 'Stop' : '🎤 Speak'}
    </button>
  );
}
