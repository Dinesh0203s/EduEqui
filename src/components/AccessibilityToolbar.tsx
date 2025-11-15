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
    <div className="fixed bottom-6 right-6 flex gap-2 bg-card border border-border rounded-2xl p-2 shadow-elegant z-50">
      <Button
        onClick={decreaseFontSize}
        variant="outline"
        size="icon"
        className="hover:bg-primary hover:text-primary-foreground"
        aria-label="Decrease font size"
      >
        <ZoomOut className="w-5 h-5" aria-hidden="true" />
      </Button>
      
      <Button
        onClick={increaseFontSize}
        variant="outline"
        size="icon"
        className="hover:bg-primary hover:text-primary-foreground"
        aria-label="Increase font size"
      >
        <ZoomIn className="w-5 h-5" aria-hidden="true" />
      </Button>
      
      <Button
        onClick={toggleHighContrast}
        variant={settings.highContrast ? "default" : "outline"}
        size="icon"
        className={settings.highContrast ? "" : "hover:bg-primary hover:text-primary-foreground"}
        aria-label="Toggle high contrast mode"
        aria-pressed={settings.highContrast}
      >
        <Contrast className="w-5 h-5" aria-hidden="true" />
      </Button>
    </div>
  );
};

export default AccessibilityToolbar;
