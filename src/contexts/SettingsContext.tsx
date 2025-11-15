import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface UserProfile {
  name: string;
  email: string;
  preferredName: string;
}

interface Settings {
  // Accessibility
  fontSize: number;
  highContrast: boolean;
  language: "tamil" | "english" | "bilingual";
  ttsSpeed: number;
  
  // Profile
  profile: UserProfile;
}

const defaultSettings: Settings = {
  fontSize: 20,
  highContrast: false,
  language: "bilingual",
  ttsSpeed: 1.0,
  profile: {
    name: "",
    email: "",
    preferredName: "",
  },
};

const STORAGE_KEY = "eduequi-settings";

interface SettingsContextType {
  settings: Settings;
  updateFontSize: (size: number) => void;
  updateHighContrast: (enabled: boolean) => void;
  updateLanguage: (lang: "tamil" | "english" | "bilingual") => void;
  updateTtsSpeed: (speed: number) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Helper function to apply settings to document
  const applySettingsToDocument = useCallback((settingsToApply: Settings) => {
    document.documentElement.style.fontSize = `${settingsToApply.fontSize}px`;
    if (settingsToApply.highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, []);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const loadedSettings = { ...defaultSettings, ...parsed };
        setSettings(loadedSettings);
        // Apply loaded settings immediately
        applySettingsToDocument(loadedSettings);
      } else {
        // Apply default settings on first load
        applySettingsToDocument(defaultSettings);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
      applySettingsToDocument(defaultSettings);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save settings to localStorage and apply them whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        applySettingsToDocument(settings);
      } catch (error) {
        console.error("Failed to save settings:", error);
      }
    }
  }, [settings, isLoaded]);

  const updateFontSize = (size: number) => {
    const clampedSize = Math.max(14, Math.min(32, size));
    setSettings((prev) => ({ ...prev, fontSize: clampedSize }));
  };

  const updateHighContrast = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, highContrast: enabled }));
  };

  const updateLanguage = (lang: "tamil" | "english" | "bilingual") => {
    setSettings((prev) => ({ ...prev, language: lang }));
  };

  const updateTtsSpeed = (speed: number) => {
    const clampedSpeed = Math.max(0.5, Math.min(2.0, speed));
    setSettings((prev) => ({ ...prev, ttsSpeed: clampedSpeed }));
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    setSettings((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profile },
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateFontSize,
        updateHighContrast,
        updateLanguage,
        updateTtsSpeed,
        updateProfile,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

