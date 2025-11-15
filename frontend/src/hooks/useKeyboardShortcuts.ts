import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export interface KeyboardShortcut {
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
  category: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        // Allow Escape key even in input fields
        if (event.key !== 'Escape') {
          return;
        }
      }

      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const altMatches = shortcut.altKey === undefined || event.altKey === shortcut.altKey;
        const ctrlMatches = shortcut.ctrlKey === undefined || event.ctrlKey === shortcut.ctrlKey;
        const shiftMatches = shortcut.shiftKey === undefined || event.shiftKey === shortcut.shiftKey;

        if (keyMatches && altMatches && ctrlMatches && shiftMatches) {
          event.preventDefault();
          shortcut.action();
          
          // Show toast notification
          toast({
            title: 'Keyboard Shortcut',
            description: shortcut.description,
            duration: 1500,
          });
          
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

// Create default app shortcuts
export const createDefaultShortcuts = (
  navigate: (path: string) => void,
  showHelp: () => void,
  toggleVoice: () => void
): KeyboardShortcut[] => [
  {
    key: 'h',
    altKey: true,
    action: () => navigate('/'),
    description: 'Go to Home',
    category: 'Navigation'
  },
  {
    key: 'c',
    altKey: true,
    action: () => navigate('/category'),
    description: 'Go to Categories',
    category: 'Navigation'
  },
  {
    key: 'd',
    altKey: true,
    action: () => navigate('/dashboard'),
    description: 'Go to Dashboard',
    category: 'Navigation'
  },
  {
    key: 's',
    altKey: true,
    action: () => navigate('/settings'),
    description: 'Go to Settings',
    category: 'Navigation'
  },
  {
    key: 'v',
    altKey: true,
    action: toggleVoice,
    description: 'Toggle Voice Control',
    category: 'Accessibility'
  },
  {
    key: '?',
    shiftKey: true,
    action: showHelp,
    description: 'Show Help',
    category: 'Help'
  },
  {
    key: 'Escape',
    action: () => {
      // Stop TTS and close modals
      const closeButtons = document.querySelectorAll('[data-dismiss="modal"]');
      closeButtons.forEach(btn => (btn as HTMLElement).click());
    },
    description: 'Close / Cancel',
    category: 'General'
  }
];
