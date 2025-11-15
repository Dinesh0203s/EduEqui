import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Pause, ArrowLeft, BookOpen, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import VoiceButton from "@/components/VoiceButton";
import { useCourse, useLessons, type Lesson } from "@/hooks/useAdminApi";

const CoursePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId: paramCourseId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  // Get courseId from params, location state, or default
  const courseId = paramCourseId || location.state?.courseId || null;

  // Fetch course data with lessons
  const { data: course, isLoading: courseLoading, error: courseError } = useCourse(courseId);
  const { data: lessons = [], isLoading: lessonsLoading } = useLessons(courseId || undefined);

  // Set first lesson as selected by default
  useEffect(() => {
    if (lessons.length > 0 && !selectedLessonId) {
      setSelectedLessonId(lessons[0].id);
    }
  }, [lessons, selectedLessonId]);

  // Get selected lesson data
  const selectedLesson = lessons.find((l: Lesson) => l.id === selectedLessonId) || lessons[0];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying && selectedLesson && 'speechSynthesis' in window) {
      const text = `${selectedLesson.contentTamil || ''} ${selectedLesson.content || ''}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
    }
  };

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
              <Button onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
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
                      
                      <Button
                        onClick={handlePlayPause}
                        size="lg"
                        className="w-32 h-32 rounded-full text-2xl shadow-glow"
                        aria-label={isPlaying ? "Pause audio lesson" : "Play audio lesson"}
                        aria-pressed={isPlaying}
                      >
                        {isPlaying ? (
                          <Pause className="w-12 h-12" aria-hidden="true" />
                        ) : (
                          <Play className="w-12 h-12 ml-2" aria-hidden="true" />
                        )}
                      </Button>
                      
                      <p 
                        className="text-xl text-center text-muted-foreground"
                        role="status"
                        aria-live="polite"
                      >
                        {isPlaying ? "Playing... / இயங்குகிறது..." : "Click to listen / கேட்க கிளிக் செய்யவும்"}
                      </p>
                    </div>
                  </Card>
                </section>

                {/* Text Content Section */}
                <Card className="p-8 mb-8 gradient-card border-2 border-primary/20 rounded-3xl">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold">Lesson Content / பாட உள்ளடக்கம்</h3>
                    <VoiceButton 
                      englishText={lessonContent.content || ""}
                      tamilText={lessonContent.contentTamil || ""}
                    />
                  </div>
                  
                  <div className="space-y-6">
                    {lessonContent.contentTamil && (
                      <div className="p-6 bg-primary/5 rounded-2xl">
                        <p className="text-xl leading-relaxed text-foreground font-medium">
                          {lessonContent.contentTamil}
                        </p>
                      </div>
                    )}
                    
                    {lessonContent.content && (
                      <div className="p-6 bg-accent/5 rounded-2xl">
                        <p className="text-xl leading-relaxed text-foreground">
                          {lessonContent.content}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>

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
                      className="text-2xl py-8 px-12 rounded-3xl shadow-elegant"
                      aria-label="Take quiz to test your knowledge"
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
