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
      <Header />
      
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-8">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                size="lg"
                className="text-lg rounded-2xl mb-4"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
                Back
              </Button>
              
              <div className="flex items-center gap-3 mb-2">
                <SettingsIcon className="w-8 h-8 text-primary" aria-hidden="true" />
                <h1 className="text-4xl md:text-5xl font-bold text-primary">
                  Settings
                </h1>
              </div>
              <p className="text-xl text-muted-foreground">
                அமைப்புகள் - Customize your EduEqui experience
              </p>
            </div>

            {/* Settings Tabs */}
            <Tabs defaultValue="accessibility" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="accessibility" className="text-lg">
                  <Accessibility className="w-5 h-5 mr-2" aria-hidden="true" />
                  Accessibility
                </TabsTrigger>
                <TabsTrigger value="profile" className="text-lg">
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
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="font-size" className="text-lg font-semibold flex items-center gap-2">
                          <ZoomIn className="w-5 h-5" aria-hidden="true" />
                          Font Size
                        </Label>
                        <span className="text-lg font-bold text-primary">
                          {settings.fontSize}px
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button
                          onClick={decreaseFontSize}
                          variant="outline"
                          size="icon"
                          disabled={settings.fontSize <= 14}
                          aria-label="Decrease font size"
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
                            aria-label="Font size slider"
                          />
                        </div>
                        <Button
                          onClick={increaseFontSize}
                          variant="outline"
                          size="icon"
                          disabled={settings.fontSize >= 32}
                          aria-label="Increase font size"
                        >
                          <ZoomIn className="w-5 h-5" aria-hidden="true" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Current font size: {settings.fontSize}px (Range: 14px - 32px)
                      </p>
                    </div>

                    <Separator />

                    {/* High Contrast */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="high-contrast" className="text-lg font-semibold flex items-center gap-2">
                          <Contrast className="w-5 h-5" aria-hidden="true" />
                          High Contrast Mode
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Increase contrast for better visibility
                        </p>
                      </div>
                      <Switch
                        id="high-contrast"
                        checked={settings.highContrast}
                        onCheckedChange={updateHighContrast}
                        aria-label="Toggle high contrast mode"
                      />
                    </div>

                    <Separator />

                    {/* Language Preference */}
                    <div className="space-y-3">
                      <Label htmlFor="language" className="text-lg font-semibold flex items-center gap-2">
                        <Languages className="w-5 h-5" aria-hidden="true" />
                        Language Preference
                      </Label>
                      <Select
                        value={settings.language}
                        onValueChange={(value: "tamil" | "english" | "bilingual") => 
                          updateLanguage(value)
                        }
                      >
                        <SelectTrigger id="language" className="text-lg h-12">
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
                    </div>

                    <Separator />

                    {/* TTS Speed */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="tts-speed" className="text-lg font-semibold flex items-center gap-2">
                          <Volume2 className="w-5 h-5" aria-hidden="true" />
                          Text-to-Speech Speed
                        </Label>
                        <span className="text-lg font-bold text-primary">
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
                        aria-label="TTS speed slider"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Slow (0.5x)</span>
                        <span>Normal (1.0x)</span>
                        <span>Fast (2.0x)</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Adjust the playback speed of text-to-speech audio
                      </p>
                    </div>
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
                  <CardContent className="space-y-6">
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
                        className="text-lg h-12"
                        aria-label="Full name input"
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
                        className="text-lg h-12"
                        aria-label="Email address input"
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
                        className="text-lg h-12"
                        aria-label="Preferred name input"
                      />
                      <p className="text-sm text-muted-foreground">
                        This name will be used in personalized greetings and content
                      </p>
                    </div>

                    <Separator />

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button
                        onClick={handleSaveProfile}
                        size="lg"
                        className="flex-1 text-lg"
                        aria-label="Save profile"
                      >
                        <Save className="w-5 h-5 mr-2" aria-hidden="true" />
                        Save Profile
                      </Button>
                      <Button
                        onClick={handleResetSettings}
                        variant="outline"
                        size="lg"
                        className="flex-1 text-lg"
                        aria-label="Reset all settings"
                      >
                        <RotateCcw className="w-5 h-5 mr-2" aria-hidden="true" />
                        Reset All Settings
                      </Button>
                    </div>
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

