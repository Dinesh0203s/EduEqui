import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";

interface KeyboardShortcutsHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const KeyboardShortcutsHelp = ({ open, onOpenChange }: KeyboardShortcutsHelpProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Keyboard className="w-6 h-6" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription className="text-base">
            Use these keyboard shortcuts to navigate the application quickly
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <ShortcutSection
            title="🧭 Navigation"
            shortcuts={[
              { keys: ['Alt', 'H'], description: 'Go to Home page' },
              { keys: ['Alt', 'C'], description: 'Go to Categories' },
              { keys: ['Alt', 'D'], description: 'Go to Dashboard' },
              { keys: ['Alt', 'S'], description: 'Go to Settings' },
            ]}
          />

          <ShortcutSection
            title="♿ Accessibility"
            shortcuts={[
              { keys: ['Alt', 'V'], description: 'Toggle Voice Control' },
              { keys: ['Tab'], description: 'Navigate between elements' },
              { keys: ['Shift', 'Tab'], description: 'Navigate backwards' },
              { keys: ['Enter'], description: 'Activate focused element' },
            ]}
          />

          <ShortcutSection
            title="⚡ General"
            shortcuts={[
              { keys: ['?'], description: 'Show this help dialog' },
              { keys: ['Esc'], description: 'Close dialog / Cancel action' },
            ]}
          />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">💡 Accessibility Tips:</p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>All interactive elements are keyboard accessible</li>
              <li>Press Tab to navigate, Enter to select</li>
              <li>Use voice control for hands-free navigation</li>
              <li>Adjust font size and contrast in Settings</li>
              <li>Screen readers are fully supported</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface ShortcutSectionProps {
  title: string;
  shortcuts: { keys: string[]; description: string }[];
}

const ShortcutSection = ({ title, shortcuts }: ShortcutSectionProps) => (
  <div>
    <h3 className="font-semibold text-lg mb-3">{title}</h3>
    <div className="space-y-2">
      {shortcuts.map((shortcut, idx) => (
        <div 
          key={idx} 
          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <span className="text-sm">{shortcut.description}</span>
          <div className="flex gap-1">
            {shortcut.keys.map((key, keyIdx) => (
              <kbd 
                key={keyIdx}
                className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono min-w-[32px] text-center"
              >
                {key}
              </kbd>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default KeyboardShortcutsHelp;
