import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Languages, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";

const languages = [
  { id: "tamil", label: "தமிழ்", labelEn: "Tamil" },
  { id: "english", label: "English", labelTa: "ஆங்கிலம்" },
  { id: "bilingual", label: "இரண்டும் / Both", labelEn: "Bilingual" },
];

const LanguageSelect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const handleLanguageSelect = (langId: string) => {
    setSelectedLanguage(langId);
    
    // Voice feedback
    if ('speechSynthesis' in window) {
      const lang = languages.find(l => l.id === langId);
      const text = `${lang?.label} selected`;
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      navigate("/dashboard", { 
        state: { 
          category: location.state?.category,
          language: selectedLanguage 
        } 
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <AccessibilityToolbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <Button
                onClick={() => navigate("/category")}
                variant="outline"
                size="lg"
                className="text-lg rounded-2xl"
                aria-label="Go back to category selection"
              >
                <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
                Back
              </Button>
            </div>

            <div className="text-center mb-12">
              <Languages className="w-20 h-20 text-primary mx-auto mb-6" aria-hidden="true" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
                Choose Your Language
              </h1>
              <p className="text-2xl text-muted-foreground">
                உங்கள் மொழியை தேர்வு செய்யுங்கள்
              </p>
            </div>

            <div className="grid gap-6 mb-8">
              {languages.map((lang, index) => (
                <motion.div
                  key={lang.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card
                    className={`p-8 cursor-pointer transition-all rounded-3xl border-4 ${
                      selectedLanguage === lang.id
                        ? "border-primary bg-primary/10 shadow-glow"
                        : "border-primary/20 hover:border-primary/50 hover:shadow-elegant"
                    }`}
                    onClick={() => handleLanguageSelect(lang.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleLanguageSelect(lang.id)}
                    aria-label={`Select ${lang.labelEn || lang.label} language`}
                    aria-pressed={selectedLanguage === lang.id}
                  >
                    <div className="text-center">
                      <h3 className="text-3xl font-bold mb-2">{lang.label}</h3>
                      {(lang.labelEn || lang.labelTa) && (
                        <p className="text-2xl text-muted-foreground">
                          {lang.labelEn || lang.labelTa}
                        </p>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleContinue}
                disabled={!selectedLanguage}
                size="lg"
                className="text-2xl py-8 px-12 rounded-3xl shadow-elegant"
                aria-label="Continue to dashboard"
              >
                Continue
                <ArrowRight className="w-6 h-6 ml-3" aria-hidden="true" />
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LanguageSelect;
