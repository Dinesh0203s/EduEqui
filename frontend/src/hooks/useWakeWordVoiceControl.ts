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
// Primary wake words (like "OK Google")
const WAKE_WORD_VARIANTS = [
  'edu help',
  'hey edu',
  'okay edu',
  'ok edu',
  'edu',
  // Shorter variants for faster activation
  'edu help me',
  'edu assistance',
  // Handle common speech recognition variations
  'e d u help',
  'e d u',
  'ed you help',
  'ed you',
  'hey ed you',
];

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

  // Check for wake word (like "OK Google" - fast and responsive)
  const checkWakeWord = useCallback((transcript: string): boolean => {
    const normalized = transcript.toLowerCase().trim();
    
    // Check for exact matches first (faster)
    for (const variant of WAKE_WORD_VARIANTS) {
      const variantLower = variant.toLowerCase();
      
      // Exact match at start or anywhere
      if (normalized === variantLower || 
          normalized.startsWith(variantLower + ' ') ||
          normalized.endsWith(' ' + variantLower) ||
          normalized.includes(' ' + variantLower + ' ')) {
        console.log('🎤 Wake word detected!', variant, 'from:', normalized);
        return true;
      }
      
      // Partial match (for variations)
      if (normalized.includes(variantLower)) {
        // Make sure it's not part of another word
        const words = normalized.split(/\s+/);
        if (words.some(word => word.includes(variantLower) && word.length <= variantLower.length + 2)) {
          console.log('🎤 Wake word detected!', variant, 'from:', normalized);
          return true;
        }
      }
    }
    
    return false;
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
    
    // Prevent automatic stopping on silence
    // This helps keep recognition running continuously
    let isManuallyStopped = false;
    let restartTimeout: NodeJS.Timeout | null = null;
    let lastRestartTime = 0;
    const MIN_RESTART_INTERVAL = 1000; // Minimum 1 second between restarts

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

      // Check for wake word in both interim and final results
      const textToCheck = fullTranscript.toLowerCase().trim();
      // Only log when there's actual speech (not empty)
      if (textToCheck.length > 0) {
        console.log('Speech detected:', textToCheck, 'Wake word active:', wakeWordActiveRef.current);
      }

      // Check wake word in interim results (faster detection - like OK Google)
      if (interimTranscript && !wakeWordActiveRef.current) {
        const interimCheck = interimTranscript.toLowerCase().trim();
        if (checkWakeWord(interimCheck)) {
          console.log('🎤 Wake word detected in interim results!');
          wakeWordActiveRef.current = true;
          setState(prev => ({ ...prev, isWakeWordActive: true }));
          
          // Immediate visual feedback (like Google)
          setState(prev => ({ ...prev, transcript: 'Listening...' }));
          
          // Play wake word confirmation sound (like Google's beep)
          const audioContext = new AudioContext();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          oscillator.frequency.value = 1200; // Higher pitch like Google
          gainNode.gain.value = 0.4;
          oscillator.start();
          setTimeout(() => oscillator.stop(), 150);

          // Quick confirmation (shorter, like Google)
          speakWithTTS({ 
            text: 'Yes, how can I help?', 
            languageCode: 'en-US',
            force: true // Interrupt any current speech
          });

          // Set timeout to deactivate wake word after 8 seconds (like Google)
          if (wakeWordTimeoutRef.current) {
            clearTimeout(wakeWordTimeoutRef.current);
          }
          wakeWordTimeoutRef.current = setTimeout(() => {
            wakeWordActiveRef.current = false;
            setState(prev => ({ ...prev, isWakeWordActive: false }));
            console.log('Wake word deactivated after timeout');
          }, 8000); // 8 seconds to give commands

          return; // Don't process wake word as a command
        }
      }

      // Check for wake word in final results
      if (finalTranscript && finalTranscript !== lastFinalTranscript) {
        lastFinalTranscript = finalTranscript;
        
        if (!wakeWordActiveRef.current && checkWakeWord(finalTranscript)) {
          console.log('🎤 Wake word detected in final results!');
          // Wake word detected!
          wakeWordActiveRef.current = true;
          setState(prev => ({ ...prev, isWakeWordActive: true }));
          
          // Immediate visual feedback
          setState(prev => ({ ...prev, transcript: 'Listening...' }));
          
          // Play wake word confirmation sound (like Google's beep)
          const audioContext = new AudioContext();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          oscillator.frequency.value = 1200; // Higher pitch like Google
          gainNode.gain.value = 0.4;
          oscillator.start();
          setTimeout(() => oscillator.stop(), 150);

          // Quick confirmation (shorter, like Google)
          speakWithTTS({ 
            text: 'Yes, how can I help?', 
            languageCode: 'en-US',
            force: true // Interrupt any current speech
          });

          // Set timeout to deactivate wake word after 8 seconds (like Google)
          if (wakeWordTimeoutRef.current) {
            clearTimeout(wakeWordTimeoutRef.current);
          }
          wakeWordTimeoutRef.current = setTimeout(() => {
            wakeWordActiveRef.current = false;
            setState(prev => ({ ...prev, isWakeWordActive: false }));
            console.log('Wake word deactivated after timeout');
          }, 8000); // 8 seconds to give commands

          return; // Don't process wake word as a command
        }
      }

      // Only process commands if wake word is active
      if (wakeWordActiveRef.current && finalTranscript && finalTranscript !== lastFinalTranscript) {
        console.log('Processing command:', finalTranscript);
        const command = matchVoiceCommand(finalTranscript, commandsRef.current);
        
        if (command) {
          console.log('Command matched:', command.description);
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
        } else {
          console.log('No command matched for:', finalTranscript);
        }
      }
    };

    recognition.onerror = (event: any) => {
      let errorMessage = 'Speech recognition error';
      
      switch (event.error) {
        case 'no-speech':
          // Don't show error for no-speech in continuous mode - it will auto-restart
          // Don't stop listening, just let it continue
          return;
        case 'aborted':
          // Recognition was aborted - don't restart if manually stopped
          if (isManuallyStopped) {
            return;
          }
          // Otherwise, it will restart via onend
          return;
        case 'audio-capture':
          errorMessage = 'Microphone not available. Please check permissions.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please enable microphone permissions.';
          setState(prev => ({ ...prev, error: errorMessage, isListening: false }));
          toast({
            title: 'Voice Recognition Error',
            description: errorMessage,
            variant: 'destructive',
            duration: 4000,
          });
          return;
        case 'network':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = `Error: ${event.error}`;
      }

      // Only update state for serious errors
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setState(prev => ({ ...prev, error: errorMessage }));
        
        toast({
          title: 'Voice Recognition Error',
          description: errorMessage,
          variant: 'destructive',
          duration: 4000,
        });
      }
    };

    recognition.onend = () => {
      // Clear any pending restart
      if (restartTimeout) {
        clearTimeout(restartTimeout);
        restartTimeout = null;
      }

      // Only restart if we're still supposed to be listening and not manually stopped
      if (isManuallyStopped) {
        return;
      }

      // Check if recognition state is still valid
      if (recognitionRef.current && recognitionRef.current === recognition) {
        const now = Date.now();
        const timeSinceLastRestart = now - lastRestartTime;
        
        // Prevent rapid restarts - wait at least MIN_RESTART_INTERVAL
        const delay = Math.max(500, MIN_RESTART_INTERVAL - timeSinceLastRestart);
        
        restartTimeout = setTimeout(() => {
          if (isManuallyStopped) {
            return;
          }
          
          try {
            // Check if already started or if recognition is still valid
            if (recognitionRef.current && recognitionRef.current === recognition) {
              recognitionRef.current.start();
              lastRestartTime = Date.now();
            }
          } catch (error: any) {
            // Only log if it's not the "already started" error
            if (error.name !== 'InvalidStateError' || !error.message.includes('already started')) {
              // Silently handle - recognition might already be running
            }
          }
          restartTimeout = null;
        }, delay);
      }
    };

    recognitionRef.current = recognition;

    // Start listening immediately
    try {
      recognition.start();
      console.log('🎤 Voice recognition started - always listening for "edu help"');
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      // Try again after a short delay
      setTimeout(() => {
        try {
          recognition.start();
          console.log('🎤 Voice recognition started on retry');
        } catch (retryError) {
          console.error('Failed to start voice recognition on retry:', retryError);
        }
      }, 1000);
    }

    return () => {
      isManuallyStopped = true;
      
      // Clear all timeouts
      if (restartTimeout) {
        clearTimeout(restartTimeout);
        restartTimeout = null;
      }
      if (wakeWordTimeoutRef.current) {
        clearTimeout(wakeWordTimeoutRef.current);
      }
      
      // Stop recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Ignore errors when stopping
        }
        recognitionRef.current = null;
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

