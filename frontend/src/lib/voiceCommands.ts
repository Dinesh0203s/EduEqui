// Voice command mappings for complete voice navigation
export interface VoiceCommand {
  patterns: string[];
  action: () => void;
  description: string;
  category: 'navigation' | 'accessibility' | 'action' | 'help';
}

export const createVoiceCommands = (
  navigate: (path: string) => void,
  updateFontSize: (size: number) => void,
  updateHighContrast: (enabled: boolean) => void,
  currentFontSize: number,
  isHighContrast: boolean,
  stopTTS: () => void,
  speakHelp: () => void,
  pauseTTS?: () => void,
  resumeTTS?: () => void
): VoiceCommand[] => [
  // Navigation commands
  {
    patterns: ['go home', 'home page', 'take me home', 'navigate home'],
    action: () => navigate('/'),
    description: 'Go to home page',
    category: 'navigation'
  },
  {
    patterns: ['go to courses', 'show courses', 'courses page', 'view courses', 'open courses'],
    action: () => navigate('/dashboard'),
    description: 'Go to courses page',
    category: 'navigation'
  },
  {
    patterns: ['go to categories', 'show categories', 'select category', 'category page'],
    action: () => navigate('/category'),
    description: 'Go to category selection',
    category: 'navigation'
  },
  {
    patterns: ['go to settings', 'open settings', 'settings page', 'show settings'],
    action: () => navigate('/settings'),
    description: 'Go to settings page',
    category: 'navigation'
  },
  {
    patterns: ['go to language', 'select language', 'language page', 'choose language'],
    action: () => navigate('/language'),
    description: 'Go to language selection',
    category: 'navigation'
  },
  {
    patterns: ['go to dashboard', 'show dashboard', 'dashboard page', 'my dashboard'],
    action: () => navigate('/dashboard'),
    description: 'Go to dashboard',
    category: 'navigation'
  },
  {
    patterns: ['go to mathematics', 'open mathematics', 'mathematics course', 'show mathematics', 'learn mathematics', 'go to maths', 'open maths', 'maths course', 'show maths', 'learn maths'],
    action: () => navigate('/course/691828a508e836c68a98310e'),
    description: 'Go to Mathematics course',
    category: 'navigation'
  },
  {
    patterns: ['go to science', 'open science', 'science course', 'show science', 'learn science'],
    action: () => navigate('/course/691828a508e836c68a983113'),
    description: 'Go to Science course',
    category: 'navigation'
  },
  {
    patterns: ['go to english', 'open english', 'english course', 'show english', 'learn english'],
    action: () => navigate('/course/course-english'),
    description: 'Go to English course',
    category: 'navigation'
  },
  {
    patterns: ['go to tamil', 'open tamil', 'tamil course', 'show tamil', 'learn tamil'],
    action: () => navigate('/course/course-tamil'),
    description: 'Go to Tamil course',
    category: 'navigation'
  },
  {
    patterns: ['go back', 'back', 'previous page', 'navigate back'],
    action: () => window.history.back(),
    description: 'Go to previous page',
    category: 'navigation'
  },
  
  // Accessibility commands
  {
    patterns: ['increase font', 'bigger text', 'increase text size', 'make text bigger', 'zoom in'],
    action: () => updateFontSize(currentFontSize + 2),
    description: 'Increase font size',
    category: 'accessibility'
  },
  {
    patterns: ['decrease font', 'smaller text', 'decrease text size', 'make text smaller', 'zoom out'],
    action: () => updateFontSize(currentFontSize - 2),
    description: 'Decrease font size',
    category: 'accessibility'
  },
  {
    patterns: ['high contrast on', 'enable high contrast', 'turn on high contrast', 'contrast mode'],
    action: () => updateHighContrast(true),
    description: 'Enable high contrast mode',
    category: 'accessibility'
  },
  {
    patterns: ['high contrast off', 'disable high contrast', 'turn off high contrast', 'normal mode'],
    action: () => updateHighContrast(false),
    description: 'Disable high contrast mode',
    category: 'accessibility'
  },
  {
    patterns: ['toggle contrast', 'switch contrast', 'contrast toggle'],
    action: () => updateHighContrast(!isHighContrast),
    description: 'Toggle high contrast mode',
    category: 'accessibility'
  },
  
  // Action commands
  {
    patterns: ['start learning', 'begin learning', 'start course', 'lets learn'],
    action: () => navigate('/category'),
    description: 'Start learning journey',
    category: 'action'
  },
  {
    patterns: ['stop speaking', 'stop reading', 'be quiet', 'silence', 'stop audio'],
    action: () => stopTTS(),
    description: 'Stop text-to-speech',
    category: 'action'
  },
  {
    patterns: ['pause audio', 'pause speaking', 'pause reading', 'pause speech'],
    action: () => pauseTTS?.(),
    description: 'Pause audio playback',
    category: 'action'
  },
  {
    patterns: ['resume audio', 'resume speaking', 'resume reading', 'continue audio', 'continue speaking'],
    action: () => resumeTTS?.(),
    description: 'Resume audio playback',
    category: 'action'
  },
  {
    patterns: ['scroll down', 'scroll page down', 'go down'],
    action: () => window.scrollBy({ top: 300, behavior: 'smooth' }),
    description: 'Scroll down',
    category: 'action'
  },
  {
    patterns: ['scroll up', 'scroll page up', 'go up'],
    action: () => window.scrollBy({ top: -300, behavior: 'smooth' }),
    description: 'Scroll up',
    category: 'action'
  },
  {
    patterns: ['scroll to top', 'go to top', 'top of page'],
    action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    description: 'Scroll to top of page',
    category: 'action'
  },
  {
    patterns: ['scroll to bottom', 'go to bottom', 'bottom of page'],
    action: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }),
    description: 'Scroll to bottom of page',
    category: 'action'
  },
  {
    patterns: ['refresh page', 'reload page', 'refresh'],
    action: () => window.location.reload(),
    description: 'Refresh the page',
    category: 'action'
  },
  
  // Help commands
  {
    patterns: ['help', 'what can i say', 'show commands', 'voice commands', 'help me'],
    action: () => speakHelp(),
    description: 'Show available voice commands',
    category: 'help'
  }
];

// Match user speech to a command
export const matchVoiceCommand = (
  transcript: string,
  commands: VoiceCommand[]
): VoiceCommand | null => {
  const normalizedTranscript = transcript.toLowerCase().trim();
  
  for (const command of commands) {
    for (const pattern of command.patterns) {
      if (normalizedTranscript.includes(pattern.toLowerCase())) {
        return command;
      }
    }
  }
  
  return null;
};
