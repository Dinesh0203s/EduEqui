import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Settings as SettingsIcon, 
  ArrowLeft, 
  Accessibility,
  User,
  ZoomIn,
  ZoomOut,
  Contrast,
  Languages,
  Volume2,
  RotateCcw,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    settings,
    updateFontSize,
    updateHighContrast,
    updateLanguage,
    updateTtsSpeed,
    updateProfile,
    resetSettings,
  } = useSettings();

  const [profileData, setProfileData] = useState({
    name: settings.profile.name,
    email: settings.profile.email,
    preferredName: settings.profile.preferredName,
  });

  // Sync profile data when settings change (e.g., after reset)
  useEffect(() => {
    setProfileData({
      name: settings.profile.name,
      email: settings.profile.email,
      preferredName: settings.profile.preferredName,
    });
  }, [settings.profile]);

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    updateProfile(profileData);
    toast({
      title: "Profile saved",
      description: "Your profile information has been updated.",
    });
  };

  const handleResetSettings = () => {
    if (window.confirm("Are you sure you want to reset all settings to default?")) {
      resetSettings();
      setProfileData({
        name: "",
        email: "",
        preferredName: "",
      });
      toast({
        title: "Settings reset",
        description: "All settings have been reset to default values.",
      });
    }
  };

  const increaseFontSize = () => {
    updateFontSize(settings.fontSize + 2);
  };

  const decreaseFontSize = () => {
    updateFontSize(settings.fontSize - 2);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-lg"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>
      
      <Header />
      
      <main className="flex-1 py-8 px-4" id="main-content" role="main" aria-label="Settings main content">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <nav className="mb-8" aria-label="Navigation">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                size="lg"
                className="text-lg rounded-2xl mb-4 min-w-[120px] min-h-[48px]"
                aria-label="Go back to previous page. Voice command: go back"
              >
                <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
                Back
              </Button>
            </nav>
            
            <section 
              className="mb-8"
              aria-labelledby="settings-heading"
            >
              <div className="flex items-center gap-3 mb-2">
                <SettingsIcon className="w-8 h-8 text-primary" aria-hidden="true" />
                <h1 id="settings-heading" className="text-4xl md:text-5xl font-bold text-primary">
                  Settings
                </h1>
              </div>
              <p className="text-xl text-muted-foreground" lang="ta">
                அமைப்புகள் - Customize your EduEqui experience
              </p>
            </section>

            {/* Settings Tabs */}
            <Tabs defaultValue="accessibility" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 min-h-[48px]">
                <TabsTrigger value="accessibility" className="text-lg min-h-[44px]">
                  <Accessibility className="w-5 h-5 mr-2" aria-hidden="true" />
                  Accessibility
                </TabsTrigger>
                <TabsTrigger value="profile" className="text-lg min-h-[44px]">
                  <User className="w-5 h-5 mr-2" aria-hidden="true" />
                  Profile
                </TabsTrigger>
              </TabsList>

              {/* Accessibility Tab */}
              <TabsContent value="accessibility">
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="text-2xl">Accessibility Settings</CardTitle>
                    <CardDescription>
                      Customize font size, contrast, language, and text-to-speech preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Font Size */}
                    <section 
                      className="space-y-4"
                      aria-labelledby="font-size-heading"
                    >
                      <div className="flex items-center justify-between">
                        <Label htmlFor="font-size" id="font-size-heading" className="text-lg font-semibold flex items-center gap-2">
                          <ZoomIn className="w-5 h-5" aria-hidden="true" />
                          Font Size
                        </Label>
                        <span className="text-lg font-bold text-primary" aria-live="polite">
                          {settings.fontSize}px
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button
                          onClick={decreaseFontSize}
                          variant="outline"
                          size="icon"
                          className="min-w-[44px] min-h-[44px]"
                          disabled={settings.fontSize <= 14}
                          aria-label={`Decrease font size. Current: ${settings.fontSize}px. Voice command: decrease font`}
                        >
                          <ZoomOut className="w-5 h-5" aria-hidden="true" />
                        </Button>
                        <div className="flex-1">
                          <Slider
                            id="font-size"
                            value={[settings.fontSize]}
                            onValueChange={(value) => updateFontSize(value[0])}
                            min={14}
                            max={32}
                            step={1}
                            className="w-full"
                            aria-label={`Font size slider. Current value: ${settings.fontSize} pixels`}
                            aria-valuemin={14}
                            aria-valuemax={32}
                            aria-valuenow={settings.fontSize}
                          />
                        </div>
                        <Button
                          onClick={increaseFontSize}
                          variant="outline"
                          size="icon"
                          className="min-w-[44px] min-h-[44px]"
                          disabled={settings.fontSize >= 32}
                          aria-label={`Increase font size. Current: ${settings.fontSize}px. Voice command: increase font`}
                        >
                          <ZoomIn className="w-5 h-5" aria-hidden="true" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Current font size: {settings.fontSize}px (Range: 14px - 32px)
                      </p>
                    </section>

                    <Separator />

                    {/* High Contrast */}
                    <div className="flex items-center justify-between" role="group" aria-labelledby="contrast-label">
                      <div className="space-y-1">
                        <Label htmlFor="high-contrast" id="contrast-label" className="text-lg font-semibold flex items-center gap-2">
                          <Contrast className="w-5 h-5" aria-hidden="true" />
                          High Contrast Mode
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Increase contrast for better visibility. Voice command: high contrast on or off
                        </p>
                      </div>
                      <Switch
                        id="high-contrast"
                        checked={settings.highContrast}
                        onCheckedChange={updateHighContrast}
                        aria-label={`High contrast mode. Currently ${settings.highContrast ? 'enabled' : 'disabled'}`}
                        aria-checked={settings.highContrast}
                      />
                    </div>

                    <Separator />

                    {/* Language Preference */}
                    <section 
                      className="space-y-3"
                      aria-labelledby="language-heading"
                    >
                      <Label htmlFor="language" id="language-heading" className="text-lg font-semibold flex items-center gap-2">
                        <Languages className="w-5 h-5" aria-hidden="true" />
                        Language Preference
                      </Label>
                      <Select
                        value={settings.language}
                        onValueChange={(value: "tamil" | "english" | "bilingual") => 
                          updateLanguage(value)
                        }
                      >
                        <SelectTrigger 
                          id="language" 
                          className="text-lg min-h-[48px]"
                          aria-label={`Language preference. Currently selected: ${settings.language}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="bilingual">இரண்டும் / Both (Bilingual)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Choose your preferred language for content display
                      </p>
                    </section>

                    <Separator />

                    {/* TTS Speed */}
                    <section 
                      className="space-y-4"
                      aria-labelledby="tts-speed-heading"
                    >
                      <div className="flex items-center justify-between">
                        <Label htmlFor="tts-speed" id="tts-speed-heading" className="text-lg font-semibold flex items-center gap-2">
                          <Volume2 className="w-5 h-5" aria-hidden="true" />
                          Text-to-Speech Speed
                        </Label>
                        <span className="text-lg font-bold text-primary" aria-live="polite">
                          {settings.ttsSpeed.toFixed(1)}x
                        </span>
                      </div>
                      <Slider
                        id="tts-speed"
                        value={[settings.ttsSpeed]}
                        onValueChange={(value) => updateTtsSpeed(value[0])}
                        min={0.5}
                        max={2.0}
                        step={0.1}
                        className="w-full"
                        aria-label={`TTS speed slider. Current speed: ${settings.ttsSpeed.toFixed(1)}x`}
                        aria-valuemin={0.5}
                        aria-valuemax={2.0}
                        aria-valuenow={settings.ttsSpeed}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Slow (0.5x)</span>
                        <span>Normal (1.0x)</span>
                        <span>Fast (2.0x)</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Adjust the playback speed of text-to-speech audio
                      </p>
                    </section>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="text-2xl">Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form aria-label="Profile information form">
                      <div className="space-y-6">
                        {/* Name */}
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-lg font-semibold">
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={profileData.name}
                            onChange={(e) => handleProfileChange("name", e.target.value)}
                            className="text-lg min-h-[48px]"
                            aria-label="Full name input field"
                          />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-lg font-semibold">
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={profileData.email}
                            onChange={(e) => handleProfileChange("email", e.target.value)}
                            className="text-lg min-h-[48px]"
                            aria-label="Email address input field"
                          />
                        </div>

                        {/* Preferred Name */}
                        <div className="space-y-2">
                          <Label htmlFor="preferred-name" className="text-lg font-semibold">
                            Preferred Name / Nickname
                          </Label>
                          <Input
                            id="preferred-name"
                            type="text"
                            placeholder="How would you like to be addressed?"
                            value={profileData.preferredName}
                            onChange={(e) => handleProfileChange("preferredName", e.target.value)}
                            className="text-lg min-h-[48px]"
                            aria-label="Preferred name input field"
                          />
                          <p className="text-sm text-muted-foreground">
                            This name will be used in personalized greetings and content
                          </p>
                        </div>

                        <Separator />

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <Button
                            type="button"
                            onClick={handleSaveProfile}
                            size="lg"
                            className="flex-1 text-lg min-h-[48px]"
                            aria-label="Save profile changes"
                          >
                            <Save className="w-5 h-5 mr-2" aria-hidden="true" />
                            Save Profile
                          </Button>
                          <Button
                            type="button"
                            onClick={handleResetSettings}
                            variant="outline"
                            size="lg"
                            className="flex-1 text-lg min-h-[48px]"
                            aria-label="Reset all settings to default values"
                          >
                            <RotateCcw className="w-5 h-5 mr-2" aria-hidden="true" />
                            Reset All Settings
                          </Button>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;