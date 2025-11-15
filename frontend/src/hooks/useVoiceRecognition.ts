import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { createVoiceCommands, matchVoiceCommand, VoiceCommand } from '@/lib/voiceCommands';
import { stopTTS, speakWithTTS } from '@/lib/tts';
import { toast } from '@/hooks/use-toast';

// Check if browser supports speech recognition
const SpeechRecognition = 
  typeof window !== 'undefined' 
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

export interface VoiceRecognitionState {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
}

export const useVoiceRecognition = () => {
  const navigate = useNavigate();
  const { settings, updateFontSize, updateHighContrast } = useSettings();
  
  const [state, setState] = useState<VoiceRecognitionState>({
    isListening: false,
    isSupported: !!SpeechRecognition,
    transcript: '',
    confidence: 0,
    error: null,
  });

  const recognitionRef = useRef<any>(null);
  const commandsRef = useRef<VoiceCommand[]>([]);

  // Speak available commands
  const speakHelp = useCallback(async () => {
    const helpText = "You can say: go home, go to courses, go to settings, start learning, increase font, decrease font, high contrast on, high contrast off, scroll down, scroll up, go back, stop speaking, or help.";
    await speakWithTTS({ text: helpText, languageCode: 'en-US' });
  }, []);

  // Create voice commands
  useEffect(() => {
    commandsRef.current = createVoiceCommands(
      navigate,
      updateFontSize,
      updateHighContrast,
      settings.fontSize,
      settings.highContrast,
      stopTTS,
      speakHelp
    );
  }, [navigate, updateFontSize, updateHighContrast, settings.fontSize, settings.highContrast, speakHelp]);

  // Initialize speech recognition
  useEffect(() => {
    if (!SpeechRecognition) {
      setState(prev => ({ 
        ...prev, 
        error: 'Speech recognition not supported in this browser. Please use Chrome or Firefox.' 
      }));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stop after one phrase
    recognition.interimResults = false;
    recognition.lang = 'en-US'; // Primary language for commands
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setState(prev => ({ ...prev, isListening: true, error: null, transcript: '' }));
      // Audio feedback for start
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.3;
      oscillator.start();
      setTimeout(() => oscillator.stop(), 100);
    };

    recognition.onresult = (event: any) => {
      const result = event.results[0];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence;

      setState(prev => ({ ...prev, transcript, confidence }));

      // Match and execute command
      const command = matchVoiceCommand(transcript, commandsRef.current);
      
      if (command) {
        // Success audio feedback
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 1200;
        gainNode.gain.value = 0.3;
        oscillator.start();
        setTimeout(() => oscillator.stop(), 100);

        // Execute command
        command.action();

        // Visual feedback
        toast({
          title: '✓ Command Executed',
          description: `"${transcript}" - ${command.description}`,
          duration: 2000,
        });

        // Audio feedback
        speakWithTTS({ 
          text: command.description, 
          languageCode: 'en-US',
          force: false 
        });
      } else {
        // Error audio feedback
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 400;
        gainNode.gain.value = 0.3;
        oscillator.start();
        setTimeout(() => oscillator.stop(), 200);

        toast({
          title: '❌ Command Not Recognized',
          description: `"${transcript}" - Say "help" to hear available commands`,
          variant: 'destructive',
          duration: 3000,
        });
      }
    };

    recognition.onerror = (event: any) => {
      let errorMessage = 'Speech recognition error';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone not available. Please check permissions.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please enable microphone permissions.';
          break;
        case 'network':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = `Error: ${event.error}`;
      }

      setState(prev => ({ ...prev, error: errorMessage, isListening: false }));
      
      toast({
        title: 'Voice Recognition Error',
        description: errorMessage,
        variant: 'destructive',
        duration: 4000,
      });
    };

    recognition.onend = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [navigate, updateFontSize, updateHighContrast, settings, speakHelp]);

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast({
        title: 'Voice Control Not Available',
        description: 'Please use Chrome or Firefox for voice commands.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (state.isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setState(prev => ({ ...prev, error: 'Failed to start voice recognition' }));
    }
  }, [state.isListening]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
    }
  }, [state.isListening]);

  return {
    ...state,
    startListening,
    stopListening,
    speakHelp,
  };
};
