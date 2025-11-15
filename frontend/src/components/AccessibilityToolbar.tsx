import { ZoomIn, ZoomOut, Contrast } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/contexts/SettingsContext";

const AccessibilityToolbar = () => {
  const { settings, updateFontSize, updateHighContrast } = useSettings();

  const increaseFontSize = () => {
    updateFontSize(settings.fontSize + 2);
  };

  const decreaseFontSize = () => {
    updateFontSize(settings.fontSize - 2);
  };

  const toggleHighContrast = () => {
    updateHighContrast(!settings.highContrast);
  };

  return (
    <div 
      className="fixed bottom-6 right-6 flex gap-3 bg-card border-2 border-border rounded-2xl p-3 shadow-elegant z-50"
      role="toolbar"
      aria-label="Accessibility controls"
      aria-orientation="horizontal"
    >
      <Button
        onClick={decreaseFontSize}
        variant="outline"
        size="icon"
        className="min-w-[48px] min-h-[48px] hover:bg-primary hover:text-primary-foreground focus:ring-4 focus:ring-primary/50"
        aria-label={`Decrease font size. Current size: ${settings.fontSize}px. Voice command: decrease font`}
      >
        <ZoomOut className="w-6 h-6" aria-hidden="true" />
      </Button>
      
      <Button
        onClick={increaseFontSize}
        variant="outline"
        size="icon"
        className="min-w-[48px] min-h-[48px] hover:bg-primary hover:text-primary-foreground focus:ring-4 focus:ring-primary/50"
        aria-label={`Increase font size. Current size: ${settings.fontSize}px. Voice command: increase font`}
      >
        <ZoomIn className="w-6 h-6" aria-hidden="true" />
      </Button>
      
      <Button
        onClick={toggleHighContrast}
        variant={settings.highContrast ? "default" : "outline"}
        size="icon"
        className={`min-w-[48px] min-h-[48px] ${settings.highContrast ? "focus:ring-4 focus:ring-white/50" : "hover:bg-primary hover:text-primary-foreground focus:ring-4 focus:ring-primary/50"}`}
        aria-label={`${settings.highContrast ? 'Disable' : 'Enable'} high contrast mode. Voice command: high contrast ${settings.highContrast ? 'off' : 'on'}`}
        aria-pressed={settings.highContrast}
      >
        <Contrast className="w-6 h-6" aria-hidden="true" />
      </Button>
    </div>
  );
};

export default AccessibilityToolbar;
