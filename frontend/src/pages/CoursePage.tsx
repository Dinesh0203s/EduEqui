import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Pause, ArrowLeft, BookOpen, Loader2, ChevronRight, ChevronLeft, SkipForward, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import VoiceButton from "@/components/VoiceButton";
import { useCourse, useLessons, type Lesson } from "@/hooks/useAdminApi";
import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { speakWithTTS, pauseTTS, resumeTTS, stopTTS } from "@/lib/tts";
import { useCourseProgress } from "@/hooks/useCourseProgress";

const CoursePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId: paramCourseId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const { settings } = useSettings();
  const { user } = useAuth();
  const { markLessonCompleted } = useCourseProgress();

  // Get courseId from params, location state, or default
  const courseId = paramCourseId || location.state?.courseId || null;

  // Debug logging
  useEffect(() => {
    if (courseId) {
      console.log('CoursePage - Course ID:', courseId);
    }
  }, [courseId]);

  // Fetch course data with lessons
  const { data: course, isLoading: courseLoading, error: courseError } = useCourse(courseId);
  const { data: lessons = [], isLoading: lessonsLoading, error: lessonsError } = useLessons(courseId || undefined);

  // Debug logging for lessons
  useEffect(() => {
    console.log('Lessons fetch status:', {
      courseId,
      lessonsLoading,
      lessonsError,
      lessonsCount: lessons?.length || 0,
      lessons
    });
  }, [courseId, lessons, lessonsLoading, lessonsError]);

  // Set first lesson as selected by default
  useEffect(() => {
    if (lessons.length > 0 && !selectedLessonId) {
      setSelectedLessonId(lessons[0].id);
    }
  }, [lessons, selectedLessonId]);

  // Get selected lesson data
  const selectedLesson = lessons.find((l: Lesson) => l.id === selectedLessonId) || lessons[0];

  // Determine language preference
  const getLanguagePreference = (): 'tamil' | 'english' | 'bilingual' => {
    if (settings.language !== 'bilingual') {
      return settings.language;
    }
    if (user?.language_preference === 'ta') {
      return 'tamil';
    }
    if (user?.language_preference === 'en') {
      return 'english';
    }
    return 'bilingual';
  };

  // Auto-play lesson content when lesson changes (if single language selected)
  useEffect(() => {
    if (selectedLesson && settings.language !== 'bilingual') {
      // Auto-play the lesson content in the selected language
      const timer = setTimeout(async () => {
        if (!isPlaying) {
          const languagePref = getLanguagePreference();
          
          try {
            if (languagePref === 'tamil' && selectedLesson.contentTamil) {
              await speakWithTTS({
                text: selectedLesson.contentTamil,
                languageCode: 'ta-IN'
              });
            } else if (languagePref === 'english' && selectedLesson.content) {
              await speakWithTTS({
                text: selectedLesson.content,
                languageCode: 'en-US'
              });
            }
          } catch (error) {
            console.error('Error auto-playing lesson:', error);
          }
        }
      }, 500); // Small delay to ensure content is loaded
      
      return () => clearTimeout(timer);
    }
  }, [selectedLessonId, selectedLesson, settings.language]);

  // Track lesson completion
  useEffect(() => {
    if (selectedLesson && courseId && lessons.length > 0) {
      // Mark lesson as started/visited
      markLessonCompleted(courseId, selectedLesson.id, lessons.length);
    }
  }, [selectedLessonId, selectedLesson, courseId, lessons.length, markLessonCompleted]);

  const handlePlayPause = async () => {
    if (!selectedLesson) return;
    
    if (isPaused) {
      // Resume playing
      resumeTTS();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }
    
    if (isPlaying) {
      // Pause playing
      pauseTTS();
      setIsPaused(true);
      setIsPlaying(false);
      return;
    }
    
    // Start playing
    setIsPlaying(true);
    setIsPaused(false);
    const languagePref = getLanguagePreference();
    
    try {
      if (languagePref === 'tamil' && selectedLesson.contentTamil) {
        // Play only Tamil
        await speakWithTTS({
          text: selectedLesson.contentTamil,
          languageCode: 'ta-IN'
        });
      } else if (languagePref === 'english' && selectedLesson.content) {
        // Play only English
        await speakWithTTS({
          text: selectedLesson.content,
          languageCode: 'en-US'
        });
      } else {
        // Bilingual: Play both
        if (selectedLesson.content) {
          await speakWithTTS({
            text: selectedLesson.content,
            languageCode: 'en-US'
          });
        }
        if (selectedLesson.contentTamil) {
          await speakWithTTS({
            text: selectedLesson.contentTamil,
            languageCode: 'ta-IN'
          });
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    stopTTS();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handlePreviousLesson = () => {
    if (!selectedLessonId || lessons.length === 0) return;
    
    const currentIndex = lessons.findIndex((l: Lesson) => l.id === selectedLessonId);
    if (currentIndex > 0) {
      stopTTS();
      setIsPlaying(false);
      setIsPaused(false);
      setSelectedLessonId(lessons[currentIndex - 1].id);
    }
  };

  const handleNextLesson = () => {
    if (!selectedLessonId || lessons.length === 0) return;
    
    const currentIndex = lessons.findIndex((l: Lesson) => l.id === selectedLessonId);
    if (currentIndex < lessons.length - 1) {
      stopTTS();
      setIsPlaying(false);
      setIsPaused(false);
      setSelectedLessonId(lessons[currentIndex + 1].id);
    }
  };

  // Get current lesson index
  const currentLessonIndex = selectedLessonId 
    ? lessons.findIndex((l: Lesson) => l.id === selectedLessonId) 
    : -1;
  const hasPrevious = currentLessonIndex > 0;
  const hasNext = currentLessonIndex >= 0 && currentLessonIndex < lessons.length - 1;

  const handleTakeQuiz = () => {
    if (selectedLesson?.quizId) {
      navigate("/quiz", { state: { quizId: selectedLesson.quizId, courseId } });
    } else {
      // Navigate to course quiz if available
      navigate("/quiz", { state: { courseId } });
    }
  };

  if (courseLoading || lessonsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading course content...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8">
            <CardHeader>
              <CardTitle>Course Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                The course you're looking for doesn't exist or couldn't be loaded.
              </p>
              {courseId && (
                <p className="text-sm text-muted-foreground mb-4">
                  Course ID: <code className="bg-muted px-2 py-1 rounded">{courseId}</code>
                </p>
              )}
              <div className="flex gap-4">
                <Button onClick={() => navigate("/dashboard")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
                <Button variant="outline" onClick={() => navigate("/")}>
                  Go to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const lessonContent = selectedLesson || {
    title: course.title,
    titleTamil: course.titleTamil,
    content: course.description,
    contentTamil: "",
    video: null,
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
      
      <main className="flex-1 py-12 px-4" id="main-content" role="main" aria-label="Course content main area">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <nav className="mb-8" aria-label="Navigation">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                size="lg"
                className="text-lg rounded-2xl min-w-[180px] min-h-[48px]"
                aria-label="Go back to dashboard. Voice command: go back"
              >
                <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
                Back to Dashboard
              </Button>
            </nav>

            {/* Course Header */}
            <section className="text-center mb-12" aria-labelledby="course-title">
              <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" aria-hidden="true" />
              <h1 id="course-title" className="text-4xl md:text-5xl font-bold mb-2 text-primary" lang="ta">
                {course.titleTamil || course.title}
              </h1>
              <h2 className="text-3xl font-bold text-muted-foreground">
                {course.title}
              </h2>
              <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                {course.description}
              </p>
            </section>

            {/* Lessons Navigation */}
            {lessons.length > 0 && (
              <nav aria-labelledby="lessons-nav-title">
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle id="lessons-nav-title">Lessons / பாடங்கள்</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="space-y-2"
                      role="list"
                      aria-label="Available lessons"
                    >
                      {lessons.map((lesson: Lesson, index: number) => (
                        <Button
                          key={lesson.id}
                          role="listitem"
                          variant={selectedLessonId === lesson.id ? "default" : "outline"}
                          className="w-full justify-start text-left min-h-[48px]"
                          onClick={() => setSelectedLessonId(lesson.id)}
                          aria-label={`Lesson ${index + 1}: ${lesson.titleTamil || lesson.title}`}
                          aria-current={selectedLessonId === lesson.id ? "page" : undefined}
                        >
                          <span className="mr-2 font-semibold">{index + 1}.</span>
                          <span>{lesson.titleTamil || lesson.title}</span>
                          <ChevronRight className="w-4 h-4 ml-auto" aria-hidden="true" />
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </nav>
            )}

            {/* Lesson Content */}
            {selectedLesson && (
              <>
                {/* Lesson Title */}
                <section className="text-center mb-8" aria-labelledby="lesson-title">
                  <h2 id="lesson-title" className="text-3xl font-bold mb-2" lang="ta">
                    {lessonContent.titleTamil || lessonContent.title}
                  </h2>
                  <h3 className="text-2xl text-muted-foreground">
                    {lessonContent.title}
                  </h3>
                </section>

                {/* Audio Player Section */}
                <section aria-labelledby="audio-lesson-heading">
                  <Card className="p-8 mb-8 gradient-card border-2 border-primary/20 rounded-3xl shadow-elegant">
                    <div className="flex flex-col items-center gap-6">
                      <h3 id="audio-lesson-heading" className="text-2xl font-bold">Audio Lesson / ஒலி பாடம்</h3>
                      
                      {/* Navigation and Control Buttons */}
                      <div className="flex items-center gap-4 w-full max-w-2xl justify-center">
                        {/* Previous Lesson Button */}
                        <Button
                          onClick={handlePreviousLesson}
                          variant="outline"
                          size="lg"
                          className="min-h-[48px] min-w-[48px] rounded-full"
                          disabled={!hasPrevious}
                          aria-label="Go to previous lesson"
                        >
                          <ChevronLeft className="w-6 h-6" aria-hidden="true" />
                        </Button>
                        
                        {/* Play/Pause Button */}
                        <Button
                          onClick={handlePlayPause}
                          size="lg"
                          className="w-32 h-32 rounded-full text-2xl shadow-glow"
                          aria-label={isPaused ? "Resume audio lesson" : isPlaying ? "Pause audio lesson" : "Play audio lesson"}
                          aria-pressed={isPlaying}
                        >
                          {isPaused ? (
                            <Play className="w-12 h-12 ml-2" aria-hidden="true" />
                          ) : isPlaying ? (
                            <Pause className="w-12 h-12" aria-hidden="true" />
                          ) : (
                            <Play className="w-12 h-12 ml-2" aria-hidden="true" />
                          )}
                        </Button>
                        
                        {/* Stop Button */}
                        <Button
                          onClick={handleStop}
                          variant="outline"
                          size="lg"
                          className="min-h-[48px] px-6 rounded-full"
                          disabled={!isPlaying && !isPaused}
                          aria-label="Stop audio"
                        >
                          Stop
                          <SkipBack className="w-5 h-5 ml-2" aria-hidden="true" />
                        </Button>
                        
                        {/* Next Lesson Button */}
                        <Button
                          onClick={handleNextLesson}
                          variant="outline"
                          size="lg"
                          className="min-h-[48px] min-w-[48px] rounded-full"
                          disabled={!hasNext}
                          aria-label="Go to next lesson"
                        >
                          <ChevronRight className="w-6 h-6" aria-hidden="true" />
                        </Button>
                      </div>
                      
                      {/* Lesson Navigation Info */}
                      <div className="flex items-center gap-4 text-lg text-muted-foreground">
                        <span>Lesson {currentLessonIndex + 1} of {lessons.length}</span>
                        <span>/</span>
                        <span>பாடம் {currentLessonIndex + 1} / {lessons.length}</span>
                      </div>
                      
                      <p 
                        className="text-xl text-center text-muted-foreground"
                        role="status"
                        aria-live="polite"
                      >
                        {isPaused 
                          ? "Paused / இடைநிறுத்தப்பட்டது" 
                          : isPlaying 
                            ? "Playing... / இயங்குகிறது..." 
                            : "Click to listen / கேட்க கிளிக் செய்யவும்"}
                      </p>
                    </div>
                  </Card>
                </section>

                {/* Text Content Section */}
                <section aria-labelledby="lesson-content-heading">
                  <Card className="p-8 mb-8 gradient-card border-2 border-primary/20 rounded-3xl">
                    <div className="flex justify-between items-start mb-6">
                      <h3 id="lesson-content-heading" className="text-2xl font-bold">Lesson Content / பாட உள்ளடக்கம்</h3>
                      <VoiceButton 
                        englishText={lessonContent.content || ""}
                        tamilText={lessonContent.contentTamil || ""}
                      />
                    </div>
                    
                    <div className="space-y-6">
                      {(() => {
                        const langPref = getLanguagePreference();
                        const showTamil = langPref === 'tamil' || langPref === 'bilingual';
                        const showEnglish = langPref === 'english' || langPref === 'bilingual';
                        
                        return (
                          <>
                            {showTamil && lessonContent.contentTamil && (
                              <div className="p-6 bg-primary/5 rounded-2xl">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-semibold text-primary">தமிழ் / Tamil</span>
                                </div>
                                <p className="text-xl leading-relaxed text-foreground font-medium" lang="ta">
                                  {lessonContent.contentTamil}
                                </p>
                              </div>
                            )}
                            
                            {showEnglish && lessonContent.content && (
                              <div className="p-6 bg-accent/5 rounded-2xl">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-semibold text-accent-foreground">English / ஆங்கிலம்</span>
                                </div>
                                <p className="text-xl leading-relaxed text-foreground">
                                  {lessonContent.content}
                                </p>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </Card>
                </section>

                {/* ISL Video Section */}
                {selectedLesson.video && (
                  <Card className="p-8 mb-8 gradient-card border-2 border-primary/20 rounded-3xl">
                    <h3 className="text-2xl font-bold mb-4">
                      Sign Language Video / சைகை மொழி வீடியோ
                    </h3>
                    <div className="bg-muted/50 rounded-2xl aspect-video overflow-hidden">
                      <video
                        controls
                        className="w-full h-full"
                        src={selectedLesson.video.islVideoUrl || selectedLesson.video.videoUrl}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    {selectedLesson.video.description && (
                      <p className="text-muted-foreground mt-4">
                        {selectedLesson.video.description}
                      </p>
                    )}
                  </Card>
                )}

                {/* Take Quiz Button */}
                {selectedLesson.quizId && (
                  <div className="text-center mb-8">
                    <Button
                      onClick={handleTakeQuiz}
                      size="lg"
                      className="text-2xl py-8 px-12 rounded-3xl shadow-elegant min-h-[64px]"
                      aria-label="Take quiz to test your knowledge of this lesson"
                    >
                      Take Quiz / வினாடி வினா எடுங்கள்
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* No lessons message */}
            {lessons.length === 0 && (
              <Card className="p-8">
                <CardContent className="text-center">
                  <p className="text-xl text-muted-foreground">
                    No lessons available for this course yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CoursePage;
