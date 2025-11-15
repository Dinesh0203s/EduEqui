import { useState, useRef, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

// Check if browser supports speech recognition
const SpeechRecognition = 
  typeof window !== 'undefined' 
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

export interface VoiceInputOptions {
  language?: string;
  continuous?: boolean;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

export const useVoiceInput = (options: VoiceInputOptions = {}) => {
  const {
    language = 'en-US',
    continuous = false,
    onResult,
    onError
  } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  // Initialize recognition
  const initRecognition = useCallback(() => {
    if (!SpeechRecognition) {
      const errorMsg = 'Voice input not supported. Please use Chrome or Firefox.';
      onError?.(errorMsg);
      toast({
        title: 'Voice Input Unavailable',
        description: errorMsg,
        variant: 'destructive',
      });
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      setTranscript('');
      setInterimTranscript('');
      
      // Audio feedback - start tone
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
      let interimText = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcriptPiece;
        } else {
          interimText += transcriptPiece;
        }
      }

      if (finalText) {
        setTranscript(prev => prev + finalText + ' ');
        onResult?.(finalText);
      }
      setInterimTranscript(interimText);
    };

    recognition.onerror = (event: any) => {
      let errorMessage = 'Voice input error';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone not available';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied';
          break;
        case 'network':
          errorMessage = 'Network error';
          break;
        default:
          errorMessage = event.error;
      }

      onError?.(errorMessage);
      toast({
        title: 'Voice Input Error',
        description: errorMessage,
        variant: 'destructive',
      });
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setInterimTranscript('');
      
      // Audio feedback - end tone
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 600;
      gainNode.gain.value = 0.3;
      oscillator.start();
      setTimeout(() => oscillator.stop(), 100);
    };

    return recognition;
  }, [language, continuous, onResult, onError]);

  // Start recording
  const startRecording = useCallback(() => {
    if (isRecording) return;

    const recognition = initRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;
    
    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting voice input:', error);
      toast({
        title: 'Failed to Start',
        description: 'Could not start voice input',
        variant: 'destructive',
      });
    }
  }, [isRecording, initRecognition]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  }, [isRecording]);

  // Clear transcript
  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  // Reset
  const reset = useCallback(() => {
    stopRecording();
    clearTranscript();
  }, [stopRecording, clearTranscript]);

  return {
    isRecording,
    transcript,
    interimTranscript,
    fullTranscript: transcript + interimTranscript,
    startRecording,
    stopRecording,
    clearTranscript,
    reset,
    isSupported: !!SpeechRecognition,
  };
};
