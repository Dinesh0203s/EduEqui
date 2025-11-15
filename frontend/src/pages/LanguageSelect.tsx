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
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-lg"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>
      
      <Header />
      <AccessibilityToolbar />
      
      <main className="flex-1 py-12 px-4" id="main-content" role="main" aria-label="Language selection main content">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <nav className="mb-8" aria-label="Navigation">
              <Button
                onClick={() => navigate("/category")}
                variant="outline"
                size="lg"
                className="text-lg rounded-2xl min-w-[120px] min-h-[48px]"
                aria-label="Go back to category selection. Voice command: go back"
              >
                <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
                Back
              </Button>
            </nav>

            <section 
              className="text-center mb-12"
              aria-labelledby="language-heading"
            >
              <Languages className="w-20 h-20 text-primary mx-auto mb-6" aria-hidden="true" />
              <h1 id="language-heading" className="text-4xl md:text-5xl font-bold mb-4 text-primary">
                Choose Your Language
              </h1>
              <p className="text-2xl text-muted-foreground" lang="ta">
                உங்கள் மொழியை தேர்வு செய்யுங்கள்
              </p>
            </section>

            <section 
              aria-labelledby="language-options"
              role="region"
            >
              <h2 id="language-options" className="sr-only">Language options</h2>
              <div 
                className="grid gap-6 mb-8"
                role="radiogroup"
                aria-labelledby="language-heading"
                aria-required="true"
              >
                {languages.map((lang, index) => (
                  <motion.div
                    key={lang.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Card
                      className={`p-8 cursor-pointer transition-all rounded-3xl border-4 min-h-[80px] ${
                        selectedLanguage === lang.id
                          ? "border-primary bg-primary/10 shadow-glow"
                          : "border-primary/20 hover:border-primary/50 hover:shadow-elegant"
                      }`}
                      onClick={() => handleLanguageSelect(lang.id)}
                      role="radio"
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleLanguageSelect(lang.id)}
                      aria-label={`Select ${lang.labelEn || lang.label} language`}
                      aria-checked={selectedLanguage === lang.id}
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
            </section>

            <div className="flex justify-center">
              <Button
                onClick={handleContinue}
                disabled={!selectedLanguage}
                size="lg"
                className="text-2xl py-8 px-12 rounded-3xl shadow-elegant min-h-[64px]"
                aria-label="Continue to dashboard with selected language"
                aria-disabled={!selectedLanguage}
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