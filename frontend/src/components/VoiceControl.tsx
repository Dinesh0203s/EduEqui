import { Mic, MicOff, HelpCircle, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWakeWordVoiceControl } from "@/hooks/useWakeWordVoiceControl";
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
    isWakeWordActive,
    transcript,
    speakHelp 
  } = useWakeWordVoiceControl();
  
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
      {/* Voice Control Button - Always On */}
      <div className="fixed bottom-6 left-6 z-50">
        <div className="flex flex-col gap-2 items-center">
          <div className="relative">
            <Button
              size="lg"
              className={`
                rounded-full w-16 h-16 shadow-2xl transition-all duration-300
                ${isWakeWordActive
                  ? 'bg-green-500 hover:bg-green-600 animate-pulse shadow-green-500/50' 
                  : isListening 
                    ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/50' 
                    : 'bg-primary hover:bg-primary/90 shadow-primary/50'
                }
              `}
              aria-label={isWakeWordActive ? "Voice commands active - listening for commands" : isListening ? "Always listening - say 'edu help' to activate" : "Voice control always on"}
              aria-live="polite"
              aria-pressed={isListening}
              disabled
            >
              {isWakeWordActive ? (
                <Radio className="w-8 h-8" aria-hidden="true" />
              ) : (
                <Mic className="w-8 h-8" aria-hidden="true" />
              )}
            </Button>
            {isListening && !isWakeWordActive && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
            )}
          </div>

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
                  title="🎤 Wake Word"
                  commands={[
                    { command: "Edu help", description: "Activate voice commands (say this first!)" },
                  ]}
                />

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
                    { command: "Pause course", description: "Pause course audio" },
                    { command: "Resume course", description: "Resume course audio" },
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

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-900 mb-2">🎤 How to Use Voice Commands:</p>
                  <ol className="text-sm text-green-800 space-y-2 list-decimal list-inside">
                    <li>Microphone is always listening (blue button at bottom left)</li>
                    <li>Say <strong>"edu help"</strong> to activate voice commands</li>
                    <li>Button turns green when active - you have 10 seconds to give commands</li>
                    <li>Speak your command clearly (e.g., "go to mathematics", "pause course")</li>
                    <li>Say "edu help" again to reactivate if needed</li>
                  </ol>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-2">💡 Tips for Best Results:</p>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Speak clearly and at a normal pace</li>
                    <li>Microphone is always on - no need to click anything</li>
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
          className={`fixed bottom-28 left-6 border-2 rounded-2xl p-4 shadow-2xl max-w-sm z-50 animate-in fade-in slide-in-from-bottom-2 ${
            isWakeWordActive 
              ? 'bg-green-50 border-green-500' 
              : 'bg-card border-primary'
          }`}
          role="status"
          aria-live="polite"
          aria-label={`Voice command: ${transcript}`}
        >
          {isWakeWordActive ? (
            <>
              <p className="text-sm font-semibold text-green-700 mb-1">✓ Commands Active - You said:</p>
              <p className="text-base text-green-900">{transcript}</p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-primary mb-1">Listening... (Say "edu help" to activate)</p>
              <p className="text-base text-muted-foreground">{transcript}</p>
            </>
          )}
        </div>
      )}

      {/* Wake Word Active Indicator */}
      {isWakeWordActive && (
        <div 
          className="fixed inset-0 pointer-events-none z-40"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-full shadow-lg font-semibold flex items-center gap-3 text-lg">
            <Radio className="w-6 h-6 animate-pulse" />
            Voice Commands Active - Listening for commands...
          </div>
        </div>
      )}

      {/* Always Listening Indicator (subtle) */}
      {isListening && !isWakeWordActive && (
        <div className="fixed bottom-24 left-6 bg-blue-500/90 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Always listening - Say "edu help" to activate
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
