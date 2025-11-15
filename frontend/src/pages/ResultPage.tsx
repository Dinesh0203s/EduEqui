import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Star, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const score = location.state?.score || 0;
  const total = location.state?.total || 3;
  const courseId = location.state?.courseId || "math";
  const percentage = Math.round((score / total) * 100);

  const getMotivationalMessage = () => {
    if (percentage >= 80) {
      return {
        english: "Excellent work! You're mastering this!",
        tamil: "மிகச்சிறந்த வேலை! நீங்கள் இதில் தேர்ச்சி பெறுகிறீர்கள்!",
      };
    } else if (percentage >= 60) {
      return {
        english: "Good job! Keep practicing!",
        tamil: "நன்றாக உள்ளது! தொடர்ந்து பயிற்சி செய்யுங்கள்!",
      };
    } else {
      return {
        english: "Don't give up! Practice makes perfect!",
        tamil: "கைவிடாதீர்கள்! பயிற்சி நிறைவை உருவாக்குகிறது!",
      };
    }
  };

  const message = getMotivationalMessage();

  useEffect(() => {
    // Voice encouragement
    if ('speechSynthesis' in window) {
      const text = `${message.tamil} ${message.english} You scored ${score} out of ${total}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 500);
    }
  }, [score, total, message]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <AccessibilityToolbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Trophy Animation */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-8"
            >
              <Trophy className="w-32 h-32 text-accent mx-auto animate-pulse-glow" aria-hidden="true" />
            </motion.div>

            {/* Score Card */}
            <Card className="p-12 mb-8 gradient-card border-4 border-primary/30 rounded-3xl shadow-glow text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <h1 className="text-5xl font-bold mb-6 text-primary">
                  Quiz Complete!
                </h1>
                <p className="text-4xl font-bold mb-8">
                  வினாடி வினா முடிந்தது!
                </p>

                <div className="my-8">
                  <div className="text-7xl font-bold text-accent mb-4">
                    {score}/{total}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-10 h-10 ${
                          i < Math.round((score / total) * 5)
                            ? "text-accent fill-accent"
                            : "text-muted"
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="text-3xl font-semibold text-primary">
                    {percentage}% Score
                  </p>
                </div>
              </motion.div>
            </Card>

            {/* Motivational Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Card className="p-8 mb-8 bg-primary/10 border-2 border-primary/30 rounded-3xl text-center">
                <p className="text-3xl font-bold text-primary mb-3">
                  {message.tamil}
                </p>
                <p className="text-2xl font-semibold">
                  {message.english}
                </p>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Button
                onClick={() => navigate("/course", { state: { courseId } })}
                size="lg"
                className="text-2xl py-8 px-12 rounded-3xl shadow-elegant"
                aria-label="Continue learning"
              >
                Continue Learning
                <ArrowRight className="w-6 h-6 ml-3" aria-hidden="true" />
              </Button>
              
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                size="lg"
                className="text-2xl py-8 px-12 rounded-3xl border-2 border-primary"
                aria-label="Go to dashboard"
              >
                <Home className="w-6 h-6 mr-3" aria-hidden="true" />
                Dashboard
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResultPage;
