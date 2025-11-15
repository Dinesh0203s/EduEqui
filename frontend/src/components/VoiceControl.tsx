import { Mic, MicOff, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const VoiceControl = () => {
  const { 
    isListening, 
    isSupported, 
    startListening, 
    transcript,
    speakHelp 
  } = useVoiceRecognition();
  
  const [showTranscript, setShowTranscript] = useState(false);

  // Show transcript when listening
  useEffect(() => {
    if (transcript) {
      setShowTranscript(true);
      const timer = setTimeout(() => setShowTranscript(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [transcript]);

  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* Voice Control Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <div className="flex flex-col gap-2 items-center">
          <Button
            onClick={startListening}
            size="lg"
            className={`
              rounded-full w-16 h-16 shadow-2xl transition-all duration-300
              ${isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/50' 
                : 'bg-primary hover:bg-primary/90 shadow-primary/50'
              }
            `}
            aria-label={isListening ? "Listening for voice command" : "Start voice control"}
            aria-live="polite"
            aria-pressed={isListening}
          >
            {isListening ? (
              <MicOff className="w-8 h-8" aria-hidden="true" />
            ) : (
              <Mic className="w-8 h-8" aria-hidden="true" />
            )}
          </Button>

          {/* Help Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full shadow-lg"
                aria-label="Show voice commands help"
              >
                <HelpCircle className="w-5 h-5" aria-hidden="true" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">Voice Commands Help</DialogTitle>
                <DialogDescription className="text-base">
                  You can control the entire application using your voice. Here are the available commands:
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                <CommandSection
                  title="🧭 Navigation"
                  commands={[
                    { command: "Go home", description: "Return to home page" },
                    { command: "Go to courses", description: "View all courses" },
                    { command: "Go to mathematics / Go to maths", description: "Open Mathematics course" },
                    { command: "Go to science", description: "Open Science course" },
                    { command: "Go to categories", description: "Select a category" },
                    { command: "Go to settings", description: "Open settings page" },
                    { command: "Go to dashboard", description: "View your dashboard" },
                    { command: "Go back", description: "Navigate to previous page" },
                  ]}
                />

                <CommandSection
                  title="📚 Course Controls"
                  commands={[
                    { command: "Pause audio", description: "Pause course audio" },
                    { command: "Resume audio", description: "Resume course audio" },
                    { command: "Next lesson", description: "Go to next lesson" },
                    { command: "Previous lesson", description: "Go to previous lesson" },
                  ]}
                />

                <CommandSection
                  title="♿ Accessibility"
                  commands={[
                    { command: "Increase font", description: "Make text bigger" },
                    { command: "Decrease font", description: "Make text smaller" },
                    { command: "High contrast on", description: "Enable high contrast mode" },
                    { command: "High contrast off", description: "Disable high contrast mode" },
                  ]}
                />

                <CommandSection
                  title="⚡ Actions"
                  commands={[
                    { command: "Start learning", description: "Begin learning journey" },
                    { command: "Stop speaking", description: "Stop text-to-speech" },
                    { command: "Scroll down", description: "Scroll page down" },
                    { command: "Scroll up", description: "Scroll page up" },
                    { command: "Scroll to top", description: "Go to top of page" },
                    { command: "Refresh page", description: "Reload current page" },
                  ]}
                />

                <CommandSection
                  title="❓ Help"
                  commands={[
                    { command: "Help", description: "Hear available commands" },
                  ]}
                />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-2">💡 Tips for Best Results:</p>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Click the microphone button to start listening</li>
                    <li>Wait for the button to turn red before speaking</li>
                    <li>Speak clearly and at a normal pace</li>
                    <li>You can say commands in different ways (e.g., "go to maths" or "open mathematics")</li>
                    <li>Use Chrome or Firefox for best compatibility</li>
                  </ul>
                </div>

                <Button 
                  onClick={speakHelp} 
                  className="w-full"
                  size="lg"
                  aria-label="Listen to voice commands"
                >
                  🔊 Listen to Commands
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Transcript Display */}
      {showTranscript && transcript && (
        <div 
          className="fixed bottom-28 left-6 bg-card border-2 border-primary rounded-2xl p-4 shadow-2xl max-w-sm z-50 animate-in fade-in slide-in-from-bottom-2"
          role="status"
          aria-live="polite"
          aria-label={`Voice command: ${transcript}`}
        >
          <p className="text-sm font-semibold text-primary mb-1">You said:</p>
          <p className="text-base">{transcript}</p>
        </div>
      )}

      {/* Listening Indicator */}
      {isListening && (
        <div 
          className="fixed inset-0 pointer-events-none z-40"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg font-semibold flex items-center gap-2">
            <Mic className="w-5 h-5 animate-pulse" />
            Listening...
          </div>
        </div>
      )}
    </>
  );
};

interface CommandSectionProps {
  title: string;
  commands: { command: string; description: string }[];
}

const CommandSection = ({ title, commands }: CommandSectionProps) => (
  <div>
    <h3 className="font-semibold text-lg mb-3">{title}</h3>
    <div className="space-y-2">
      {commands.map((cmd, idx) => (
        <div 
          key={idx} 
          className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <span className="font-mono text-sm bg-primary/10 text-primary px-2 py-1 rounded min-w-[140px]">
            "{cmd.command}"
          </span>
          <span className="text-sm text-muted-foreground">{cmd.description}</span>
        </div>
      ))}
    </div>
  </div>
);

export default VoiceControl;
