import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useEffect } from "react";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  language?: string;
  className?: string;
  label?: string;
}

const VoiceInputButton = ({ 
  onTranscript, 
  language = "en-US", 
  className = "",
  label = "Voice input"
}: VoiceInputButtonProps) => {
  const { 
    isRecording, 
    transcript,
    startRecording, 
    stopRecording,
    isSupported 
  } = useVoiceInput({
    language,
    continuous: false,
    onResult: (text) => {
      onTranscript(text);
    }
  });

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript.trim());
    }
  }, [transcript, onTranscript]);

  if (!isSupported) {
    return null;
  }

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      variant={isRecording ? "destructive" : "outline"}
      size="icon"
      className={`
        min-w-[44px] min-h-[44px] transition-all
        ${isRecording ? 'animate-pulse' : ''}
        ${className}
      `}
      aria-label={isRecording ? "Stop voice input" : label}
      aria-pressed={isRecording}
    >
      {isRecording ? (
        <MicOff className="w-5 h-5" aria-hidden="true" />
      ) : (
        <Mic className="w-5 h-5" aria-hidden="true" />
      )}
    </Button>
  );
};

export default VoiceInputButton;
