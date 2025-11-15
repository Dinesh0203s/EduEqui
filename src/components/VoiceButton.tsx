import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { speakWithTTS } from "@/lib/tts";

interface VoiceButtonProps {
  englishText: string;
  tamilText: string;
  className?: string;
}

const VoiceButton = ({ englishText, tamilText, className = "" }: VoiceButtonProps) => {
  const handleSpeak = async () => {
    try {
      // Speak English first
      await speakWithTTS({
        text: englishText,
        languageCode: 'en-US'
      });
      
      // Then speak Tamil after a short delay
      setTimeout(() => {
        speakWithTTS({
          text: tamilText,
          languageCode: 'ta-IN'
        });
      }, 1000); // Fixed delay between languages
    } catch (error) {
      console.error('Error in VoiceButton:', error);
    }
  };

  return (
    <Button
      onClick={handleSpeak}
      variant="outline"
      size="icon"
      className={`hover:bg-primary hover:text-primary-foreground transition-all ${className}`}
      aria-label={`Read aloud in English and Tamil: ${englishText}`}
    >
      <Volume2 className="w-5 h-5" aria-hidden="true" />
    </Button>
  );
};

export default VoiceButton;
