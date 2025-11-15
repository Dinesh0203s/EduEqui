import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import VoiceButton from "@/components/VoiceButton";

const quizQuestions = [
  {
    id: 1,
    question: "What is 2 + 2?",
    questionTamil: "2 + 2 என்றால் என்ன?",
    options: [
      { id: "a", text: "3", textTamil: "3" },
      { id: "b", text: "4", textTamil: "4" },
      { id: "c", text: "5", textTamil: "5" },
      { id: "d", text: "6", textTamil: "6" },
    ],
    correct: "b",
  },
  {
    id: 2,
    question: "Which shape has 4 equal sides?",
    questionTamil: "எந்த வடிவத்திற்கு 4 சம பக்கங்கள் உள்ளன?",
    options: [
      { id: "a", text: "Circle / வட்டம்", textTamil: "வட்டம்" },
      { id: "b", text: "Triangle / முக்கோணம்", textTamil: "முக்கோணம்" },
      { id: "c", text: "Square / சதுரம்", textTamil: "சதுரம்" },
      { id: "d", text: "Pentagon / ஐங்கோணம்", textTamil: "ஐங்கோணம்" },
    ],
    correct: "c",
  },
  {
    id: 3,
    question: "What is 10 - 7?",
    questionTamil: "10 - 7 என்றால் என்ன?",
    options: [
      { id: "a", text: "2", textTamil: "2" },
      { id: "b", text: "3", textTamil: "3" },
      { id: "c", text: "4", textTamil: "4" },
      { id: "d", text: "5", textTamil: "5" },
    ],
    correct: "b",
  },
];

const QuizPage = () => {
  const navigate = useNavigate();
   const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const courseId = location.state?.courseId || "math";
  const question = quizQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
    setShowFeedback(true);

    const isCorrect = answerId === question.correct;
    if (isCorrect) {
      setScore(score + 1);
    }

    // Voice feedback
    if ('speechSynthesis' in window) {
      const text = isCorrect ? "Correct! சரியானது!" : "Try again! மீண்டும் முயற்சிக்கவும்!";
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      navigate("/result", { state: { score, total: quizQuestions.length, courseId } });
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
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
            {/* Progress */}
            <div className="mb-8 text-center">
              <p className="text-2xl font-semibold text-primary mb-2">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </p>
              <p className="text-xl text-muted-foreground">
                கேள்வி {currentQuestion + 1} / {quizQuestions.length}
              </p>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-8 mb-8 gradient-card border-2 border-primary/20 rounded-3xl shadow-elegant">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-3 text-primary">
                        {question.questionTamil}
                      </h2>
                      <h3 className="text-2xl font-bold">
                        {question.question}
                      </h3>
                    </div>
                    <VoiceButton 
                      englishText={question.question}
                      tamilText={question.questionTamil}
                    />
                  </div>

                  {/* Options */}
                  <div className="space-y-4">
                    {question.options.map((option) => {
                      const isSelected = selectedAnswer === option.id;
                      const isCorrect = option.id === question.correct;
                      const showCorrect = showFeedback && isCorrect;
                      const showWrong = showFeedback && isSelected && !isCorrect;

                      return (
                        <motion.div
                          key={option.id}
                          whileHover={!showFeedback ? { scale: 1.02 } : {}}
                          whileTap={!showFeedback ? { scale: 0.98 } : {}}
                        >
                          <Card
                            className={`p-6 cursor-pointer transition-all rounded-2xl border-2 ${
                              showCorrect
                                ? "border-green-500 bg-green-50 dark:bg-green-950"
                                : showWrong
                                ? "border-red-500 bg-red-50 dark:bg-red-950"
                                : isSelected
                                ? "border-primary bg-primary/10"
                                : "border-primary/20 hover:border-primary/50"
                            }`}
                            onClick={() => !showFeedback && handleAnswerSelect(option.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && !showFeedback && handleAnswerSelect(option.id)}
                            aria-label={`Option ${option.id}: ${option.text}`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xl font-semibold mb-1">
                                  {option.id.toUpperCase()}. {option.text}
                                </p>
                              </div>
                              {showCorrect && (
                                <CheckCircle className="w-8 h-8 text-green-600" aria-hidden="true" />
                              )}
                              {showWrong && (
                                <XCircle className="w-8 h-8 text-red-600" aria-hidden="true" />
                              )}
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Feedback & Next Button */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <Card className="p-6 mb-6 inline-block gradient-card rounded-3xl border-2 border-primary/20">
                    <p className="text-2xl font-bold mb-2">
                      {selectedAnswer === question.correct ? (
                        <span className="text-green-600">✓ Correct! / சரியானது!</span>
                      ) : (
                        <span className="text-red-600">✗ Incorrect / தவறு</span>
                      )}
                    </p>
                    <p className="text-xl text-muted-foreground">
                      {selectedAnswer === question.correct 
                        ? "Great job! / நன்றாக செய்தீர்கள்!"
                        : "Keep trying! / தொடர்ந்து முயற்சிக்கவும்!"
                      }
                    </p>
                  </Card>

                  <div>
                    <Button
                      onClick={handleNext}
                      size="lg"
                      className="text-2xl py-8 px-12 rounded-3xl shadow-elegant"
                      aria-label={isLastQuestion ? "Finish quiz" : "Next question"}
                    >
                      {isLastQuestion ? "Finish Quiz / முடி" : "Next Question / அடுத்தது"}
                      <ArrowRight className="w-6 h-6 ml-3" aria-hidden="true" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default QuizPage;
