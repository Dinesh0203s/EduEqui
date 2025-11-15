import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { useCourseVoiceActions } from '@/contexts/CourseVoiceControlContext';
import { createVoiceCommands, matchVoiceCommand, VoiceCommand } from '@/lib/voiceCommands';
import { stopTTS, speakWithTTS, pauseTTS, resumeTTS } from '@/lib/tts';
import { toast } from '@/hooks/use-toast';

// Check if browser supports speech recognition
const SpeechRecognition = 
  typeof window !== 'undefined' 
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

const WAKE_WORD = 'edu help';
const WAKE_WORD_VARIANTS = ['edu help', 'eduequi help', 'education help', 'edu', 'help edu'];

export interface WakeWordVoiceControlState {
  isListening: boolean;
  isSupported: boolean;
  isWakeWordActive: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
}

export const useWakeWordVoiceControl = () => {
  const navigate = useNavigate();
  const { settings, updateFontSize, updateHighContrast } = useSettings();
  const courseControlActions = useCourseVoiceActions();
  
  const [state, setState] = useState<WakeWordVoiceControlState>({
    isListening: false,
    isSupported: !!SpeechRecognition,
    isWakeWordActive: false,
    transcript: '',
    confidence: 0,
    error: null,
  });

  const recognitionRef = useRef<any>(null);
  const commandsRef = useRef<VoiceCommand[]>([]);
  const wakeWordActiveRef = useRef(false);
  const wakeWordTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Speak available commands
  const speakHelp = useCallback(async () => {
    const helpText = "To use voice commands, first say 'edu help' to activate. Then you can say: go home, go to courses, go to mathematics, go to maths, go to science, pause course, resume course, next lesson, previous lesson, go to settings, increase font, decrease font, high contrast on, high contrast off, scroll down, scroll up, go back, stop speaking, or help.";
    await speakWithTTS({ text: helpText, languageCode: 'en-US' });
  }, []);

  // Create voice commands with course controls
  useEffect(() => {
    const courseActions = courseControlActions || {};
    
    commandsRef.current = createVoiceCommands(
      navigate,
      updateFontSize,
      updateHighContrast,
      settings.fontSize,
      settings.highContrast,
      stopTTS,
      speakHelp,
      courseActions.pauseCourse,
      courseActions.resumeCourse
    );

    // Add course-specific commands
    if (courseActions.nextLesson) {
      commandsRef.current.push({
        patterns: ['next lesson', 'go to next lesson', 'next', 'skip lesson'],
        action: courseActions.nextLesson,
        description: 'Go to next lesson',
        category: 'action'
      });
    }

    if (courseActions.previousLesson) {
      commandsRef.current.push({
        patterns: ['previous lesson', 'go to previous lesson', 'previous', 'go back lesson'],
        action: courseActions.previousLesson,
        description: 'Go to previous lesson',
        category: 'action'
      });
    }

    // Add course navigation commands with correct IDs
    commandsRef.current.push(
      {
        patterns: ['go to mathematics', 'open mathematics', 'mathematics course', 'show mathematics', 'learn mathematics', 'go to maths', 'open maths', 'maths course', 'show maths', 'learn maths'],
        action: () => {
          // Get actual course ID from API or use the known ID
          navigate('/course/691828a508e836c68a98310e');
        },
        description: 'Go to Mathematics course',
        category: 'navigation'
      },
      {
        patterns: ['go to science', 'open science', 'science course', 'show science', 'learn science'],
        action: () => {
          navigate('/course/691828a508e836c68a983113');
        },
        description: 'Go to Science course',
        category: 'navigation'
      },
      {
        patterns: ['pause course', 'pause lesson', 'pause audio', 'pause'],
        action: () => {
          courseActions.pauseCourse?.();
          speakWithTTS({ text: 'Course paused', languageCode: 'en-US' });
        },
        description: 'Pause course audio',
        category: 'action'
      },
      {
        patterns: ['resume course', 'resume lesson', 'resume audio', 'resume', 'continue', 'play'],
        action: () => {
          courseActions.resumeCourse?.();
          speakWithTTS({ text: 'Course resumed', languageCode: 'en-US' });
        },
        description: 'Resume course audio',
        category: 'action'
      }
    );
  }, [navigate, updateFontSize, updateHighContrast, settings.fontSize, settings.highContrast, speakHelp, courseControlActions]);

  // Check for wake word
  const checkWakeWord = useCallback((transcript: string): boolean => {
    const normalized = transcript.toLowerCase().trim();
    return WAKE_WORD_VARIANTS.some(variant => normalized.includes(variant));
  }, []);

  // Initialize continuous speech recognition
  useEffect(() => {
    if (!SpeechRecognition) {
      setState(prev => ({ 
        ...prev, 
        error: 'Speech recognition not supported in this browser. Please use Chrome or Firefox.' 
      }));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Always listening
    recognition.interimResults = true; // Get interim results for wake word detection
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    let lastFinalTranscript = '';

    recognition.onstart = () => {
      setState(prev => ({ ...prev, isListening: true, error: null }));
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      const fullTranscript = (finalTranscript + interimTranscript).trim();
      setState(prev => ({ ...prev, transcript: fullTranscript }));

      // Check for wake word in final results
      if (finalTranscript && finalTranscript !== lastFinalTranscript) {
        lastFinalTranscript = finalTranscript;
        
        if (checkWakeWord(finalTranscript)) {
          // Wake word detected!
          wakeWordActiveRef.current = true;
          setState(prev => ({ ...prev, isWakeWordActive: true }));
          
          // Play wake word confirmation sound
          const audioContext = new AudioContext();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          oscillator.frequency.value = 1000;
          gainNode.gain.value = 0.3;
          oscillator.start();
          setTimeout(() => oscillator.stop(), 200);

          // Speak confirmation
          speakWithTTS({ 
            text: 'Voice commands activated. What would you like to do?', 
            languageCode: 'en-US' 
          });

          // Set timeout to deactivate wake word after 10 seconds
          if (wakeWordTimeoutRef.current) {
            clearTimeout(wakeWordTimeoutRef.current);
          }
          wakeWordTimeoutRef.current = setTimeout(() => {
            wakeWordActiveRef.current = false;
            setState(prev => ({ ...prev, isWakeWordActive: false }));
          }, 10000); // 10 seconds to give commands

          return; // Don't process wake word as a command
        }
      }

      // Only process commands if wake word is active
      if (wakeWordActiveRef.current && finalTranscript && finalTranscript !== lastFinalTranscript) {
        const command = matchVoiceCommand(finalTranscript, commandsRef.current);
        
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
            description: `"${finalTranscript}" - ${command.description}`,
            duration: 2000,
          });

          // Reset wake word after command (optional - can keep active)
          // wakeWordActiveRef.current = false;
          // setState(prev => ({ ...prev, isWakeWordActive: false }));
        }
      }
    };

    recognition.onerror = (event: any) => {
      let errorMessage = 'Speech recognition error';
      
      switch (event.error) {
        case 'no-speech':
          // Don't show error for no-speech in continuous mode
          return;
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
      
      if (event.error !== 'no-speech') {
        toast({
          title: 'Voice Recognition Error',
          description: errorMessage,
          variant: 'destructive',
          duration: 4000,
        });
      }
    };

    recognition.onend = () => {
      // Restart recognition automatically for continuous listening
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          // Ignore errors when restarting
          console.log('Restarting voice recognition...');
        }
      }
    };

    recognitionRef.current = recognition;

    // Start listening immediately
    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting voice recognition:', error);
    }

    return () => {
      if (wakeWordTimeoutRef.current) {
        clearTimeout(wakeWordTimeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [checkWakeWord, speakHelp]);

  // Stop listening (optional - for manual control)
  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
    }
  }, [state.isListening]);

  return {
    ...state,
    stopListening,
    speakHelp,
  };
};

