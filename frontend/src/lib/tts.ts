const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const API_URL = `${API_BASE}/tts`;

interface TTSOptions {
  text: string;
  languageCode: string;
  force?: boolean; // If true, will interrupt current speech
  speed?: number; // Speech speed multiplier (0.5 to 2.0, default 1.0)
}

// Global queue for TTS requests
const ttsQueue: Array<{text: string, languageCode: string, speed?: number}> = [];
let isPlaying = false;
let isPaused = false;
let currentAudio: HTMLAudioElement | null = null;
let isInitialized = false;
const queuedSpeeches = new Set<string>(); // Track queued speeches to prevent duplicates

// Get default TTS speed from localStorage
const getDefaultSpeed = (): number => {
  try {
    const stored = localStorage.getItem("eduequi-settings");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.ttsSpeed || 1.0;
    }
  } catch (error) {
    console.error("Failed to load TTS speed from settings:", error);
  }
  return 1.0;
};

const processQueue = async (): Promise<void> => {
  if ((isPlaying && !isPaused) || ttsQueue.length === 0) return;
  
  isPlaying = true;
  const { text, languageCode, speed } = ttsQueue.shift()!;
  
  // Skip if this exact text is already in the queue
  if (queuedSpeeches.has(text)) {
    isPlaying = false;
    processQueue();
    return;
  }
  
  queuedSpeeches.add(text);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        lang: languageCode.split('-')[0], // Extract language code (en, ta)
        speed: speed ?? getDefaultSpeed()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate speech');
    }

    // Flask backend returns audio file directly, not JSON with base64
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    return new Promise((resolve) => {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        URL.revokeObjectURL(currentAudio.src);
      }
      
      currentAudio = new Audio(audioUrl);
      
      // Reset pause state when new audio starts
      isPaused = false;
      
      // Apply speed setting
      const playbackSpeed = speed ?? getDefaultSpeed();
      currentAudio.playbackRate = Math.max(0.5, Math.min(2.0, playbackSpeed));
      
      currentAudio.addEventListener('ended', () => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        isPlaying = false;
        isPaused = false;
        queuedSpeeches.delete(text);
        resolve(undefined);
        processQueue(); // Process next item in queue
      });
      
      currentAudio.addEventListener('error', () => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        isPlaying = false;
        isPaused = false;
        queuedSpeeches.delete(text);
        resolve(undefined);
        processQueue(); // Process next item in queue
      });
      
      currentAudio.play().then(() => {
        isPlaying = true;
      }).catch((error) => {
        console.error('Failed to play audio:', error);
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        isPlaying = false;
        isPaused = false;
        queuedSpeeches.delete(text);
        resolve(undefined);
        processQueue();
      });
    });
    
  } catch (error) {
    console.error('TTS Error:', error);
    isPlaying = false;
    processQueue();
  }
};

export const speakWithTTS = async ({ text, languageCode, force = false, speed }: TTSOptions): Promise<void> => {
  if (!text) return;
  
  // If force is true, stop current playback and clear queue
  if (force) {
    stopTTS();
  }
  
  // Skip if already in queue and not forcing
  if (queuedSpeeches.has(text) && !force) {
    return;
  }
  
  // Add to queue with speed (use provided or default from settings)
  const ttsSpeed = speed ?? getDefaultSpeed();
  ttsQueue.push({ text, languageCode, speed: ttsSpeed });
  
  // Process queue if not already processing
  if (!isPlaying) {
    await processQueue();
  }
};

export const stopTTS = (): void => {
  // Clear the queue
  ttsQueue.length = 0;
  queuedSpeeches.clear();
  
  // Stop current audio if any
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    URL.revokeObjectURL(currentAudio.src);
    currentAudio = null;
  }
  
  isPlaying = false;
  isPaused = false;
};

export const pauseTTS = (): void => {
  // Pause current audio without clearing queue
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
    isPaused = true;
    isPlaying = false;
  }
};

export const resumeTTS = (): void => {
  // Resume current audio if paused
  if (currentAudio && currentAudio.paused) {
    currentAudio.play().catch(error => {
      console.error('Failed to resume audio:', error);
    });
    isPaused = false;
    isPlaying = true;
  }
};

// Stop all TTS when page is unloaded
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', stopTTS);
  window.addEventListener('pagehide', stopTTS);
}
