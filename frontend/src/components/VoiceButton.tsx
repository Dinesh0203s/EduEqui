import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { speakWithTTS } from "@/lib/tts";
import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/contexts/AuthContext";

interface VoiceButtonProps {
  englishText: string;
  tamilText: string;
  className?: string;
}

const VoiceButton = ({ englishText, tamilText, className = "" }: VoiceButtonProps) => {
  const { settings } = useSettings();
  const { user } = useAuth();
  
  // Determine language preference: settings > user preference > bilingual
  const getLanguagePreference = (): 'tamil' | 'english' | 'bilingual' => {
    if (settings.language !== 'bilingual') {
      return settings.language;
    }
    if (user?.language_preference === 'ta') {
      return 'tamil';
    }
    if (user?.language_preference === 'en') {
      return 'english';
    }
    return 'bilingual';
  };

  const handleSpeak = async () => {
    try {
      const languagePref = getLanguagePreference();
      
      if (languagePref === 'tamil' && tamilText) {
        // Play only Tamil
        await speakWithTTS({
          text: tamilText,
          languageCode: 'ta-IN'
        });
      } else if (languagePref === 'english' && englishText) {
        // Play only English
        await speakWithTTS({
          text: englishText,
          languageCode: 'en-US'
        });
      } else {
        // Bilingual: Play both
        if (englishText) {
          await speakWithTTS({
            text: englishText,
            languageCode: 'en-US'
          });
        }
        
        if (tamilText) {
          setTimeout(() => {
            speakWithTTS({
              text: tamilText,
              languageCode: 'ta-IN'
            });
          }, 1000);
        }
      }
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
