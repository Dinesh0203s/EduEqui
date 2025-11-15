import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Play, Pause, RotateCcw, ArrowLeft, BookOpen, Loader2, 
  ChevronRight, Volume2, VolumeX, Languages 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import { useCourse, useLessons, useLesson } from "@/hooks/useAdminApi";
import { speakWithTTS } from "@/lib/tts";

interface Transcription {
  language: string;
  text: string;
  timestamps?: Array<{ start: number; end: number; text: string }>;
}

interface LessonData {
  id: string;
  course_id: string;
  title: string;
  title_tamil: string;
  description: string;
  description_tamil: string;
  video_url: string;
  video_duration?: number;
  transcriptions: Transcription[];
  content_text: string;
  content_text_tamil: string;
  order: number;
}

const CoursePageNew = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ta'>('en');
  const [autoReadEnabled, setAutoReadEnabled] = useState(true);
  const videoRef = useRef<HTMLIFrameElement>(null);

  // Fetch course and lessons data
  const { data: course, isLoading: courseLoading } = useCourse(courseId || null);
  const { data: lessons = [], isLoading: lessonsLoading } = useLessons(courseId);
  const { data: selectedLesson, isLoading: lessonLoading } = useLesson(selectedLessonId);

  // Auto-select first lesson
  useEffect(() => {
    if (lessons.length > 0 && !selectedLessonId) {
      setSelectedLessonId(lessons[0].id);
    }
  }, [lessons, selectedLessonId]);

  // Auto-read content for blind users when lesson changes
  useEffect(() => {
    if (selectedLesson && autoReadEnabled) {
      const timer = setTimeout(() => {
        handleAutoRead();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedLesson, autoReadEnabled]);

  const handleAutoRead = async () => {
    if (!selectedLesson) return;
    
    const lesson = selectedLesson as any;
    const englishText = `${lesson.title}. ${lesson.description}. ${lesson.content_text}`;
    const tamilText = `${lesson.title_tamil}. ${lesson.description_tamil}. ${lesson.content_text_tamil}`;

    setIsTTSPlaying(true);
    
    // Speak English first
    await speakWithTTS({
      text: englishText,
      languageCode: 'en-US'
    });
    
    // Then Tamil
    setTimeout(async () => {
      await speakWithTTS({
        text: tamilText,
        languageCode: 'ta-IN'
      });
      setIsTTSPlaying(false);
    }, 500);
  };

  const handleTTSPlayPause = async () => {
    if (isTTSPlaying) {
      window.speechSynthesis.cancel();
      setIsTTSPlaying(false);
    } else {
      await handleAutoRead();
    }
  };

  const handleTTSRestart = async () => {
    window.speechSynthesis.cancel();
    setIsTTSPlaying(false);
    setTimeout(() => {
      handleAutoRead();
    }, 300);
  };

  const handleStopTTS = () => {
    window.speechSynthesis.cancel();
    setIsTTSPlaying(false);
  };

  const getTranscription = (language: string): string => {
    if (!selectedLesson) return '';
    const lesson = selectedLesson as any;
    const transcription = lesson.transcriptions?.find((t: Transcription) => t.language === language);
    return transcription?.text || '';
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

  if (!course) {
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

  const lesson = selectedLesson as any;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to main content */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-lg"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>
      
      <Header />
      <AccessibilityToolbar />
      
      <main className="flex-1 py-12 px-4" id="main-content" role="main">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back Button */}
            <nav className="mb-8" aria-label="Navigation">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                size="lg"
                className="text-lg rounded-2xl min-w-[180px] min-h-[48px]"
                aria-label="Go back to dashboard"
              >
                <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
                Back to Dashboard
              </Button>
            </nav>

            {/* Course Header */}
            <section className="text-center mb-12" aria-labelledby="course-title">
              <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" aria-hidden="true" />
              <h1 id="course-title" className="text-4xl md:text-5xl font-bold mb-2 text-primary" lang="ta">
                {(course as any).name_tamil || (course as any).name}
              </h1>
              <h2 className="text-3xl font-bold text-muted-foreground">
                {(course as any).name}
              </h2>
              <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                {(course as any).description}
              </p>
            </section>

            {/* Lessons Navigation */}
            {lessons.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Lessons / பாடங்கள்</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2" role="list" aria-label="Available lessons">
                    {lessons.map((lessonItem: any, index: number) => (
                      <Button
                        key={lessonItem.id}
                        role="listitem"
                        variant={selectedLessonId === lessonItem.id ? "default" : "outline"}
                        className="w-full justify-start text-left min-h-[48px]"
                        onClick={() => {
                          setSelectedLessonId(lessonItem.id);
                          handleStopTTS();
                        }}
                        aria-label={`Lesson ${index + 1}: ${lessonItem.title_tamil || lessonItem.title}`}
                        aria-current={selectedLessonId === lessonItem.id ? "page" : undefined}
                      >
                        <span className="mr-2 font-semibold">{index + 1}.</span>
                        <span>{lessonItem.title_tamil || lessonItem.title}</span>
                        <ChevronRight className="w-4 h-4 ml-auto" aria-hidden="true" />
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lesson Content */}
            {lesson && !lessonLoading && (
              <>
                {/* Lesson Title */}
                <section className="text-center mb-8" aria-labelledby="lesson-title">
                  <h2 id="lesson-title" className="text-3xl font-bold mb-2" lang="ta">
                    {lesson.title_tamil || lesson.title}
                  </h2>
                  <h3 className="text-2xl text-muted-foreground">
                    {lesson.title}
                  </h3>
                </section>

                {/* Audio Controls for Blind Users */}
                <Card className="p-6 mb-8 gradient-card border-2 border-primary/20 rounded-3xl">
                  <div className="flex flex-col items-center gap-6">
                    <h3 className="text-2xl font-bold text-center">
                      Audio Lesson / ஒலி பாடம்
                    </h3>
                    
                    <div className="flex gap-4 items-center">
                      <Button
                        onClick={handleTTSPlayPause}
                        size="lg"
                        className="w-24 h-24 rounded-full shadow-glow"
                        aria-label={isTTSPlaying ? "Pause audio lesson" : "Play audio lesson"}
                      >
                        {isTTSPlaying ? (
                          <Pause className="w-10 h-10" aria-hidden="true" />
                        ) : (
                          <Play className="w-10 h-10 ml-1" aria-hidden="true" />
                        )}
                      </Button>
                      
                      <Button
                        onClick={handleTTSRestart}
                        size="lg"
                        variant="outline"
                        className="w-24 h-24 rounded-full"
                        aria-label="Restart audio lesson from beginning"
                      >
                        <RotateCcw className="w-10 h-10" aria-hidden="true" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAutoReadEnabled(!autoReadEnabled)}
                        aria-label={`Auto-read is ${autoReadEnabled ? 'enabled' : 'disabled'}. Click to toggle.`}
                      >
                        {autoReadEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
                        Auto-Read: {autoReadEnabled ? 'ON' : 'OFF'}
                      </Button>
                    </div>
                    
                    <p 
                      className="text-xl text-center text-muted-foreground"
                      role="status"
                      aria-live="polite"
                    >
                      {isTTSPlaying ? "Playing... / இயங்குகிறது..." : "Ready to play / விளையாட தயார்"}
                    </p>
                  </div>
                </Card>

                {/* Video Player with Transcriptions */}
                <Card className="p-6 mb-8 gradient-card border-2 border-primary/20 rounded-3xl">
                  <h3 className="text-2xl font-bold mb-4">
                    Video Lesson / வீடியோ பாடம்
                  </h3>
                  
                  <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-4">
                    <iframe
                      ref={videoRef}
                      src={lesson.video_url}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={lesson.title}
                    />
                  </div>

                  {/* Transcription Tabs for Hearing Disability */}
                  <div className="mt-6">
                    <Tabs value={currentLanguage} onValueChange={(v) => setCurrentLanguage(v as 'en' | 'ta')}>
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="en" className="min-h-[48px]">
                          <Languages className="w-4 h-4 mr-2" />
                          English Transcription
                        </TabsTrigger>
                        <TabsTrigger value="ta" className="min-h-[48px]">
                          <Languages className="w-4 h-4 mr-2" />
                          Tamil / தமிழ் வசனம்
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="en">
                        <Card className="p-6 bg-primary/5">
                          <p className="text-lg leading-relaxed">
                            {getTranscription('en') || 'Transcription not available'}
                          </p>
                        </Card>
                      </TabsContent>
                      
                      <TabsContent value="ta">
                        <Card className="p-6 bg-accent/5">
                          <p className="text-lg leading-relaxed" lang="ta">
                            {getTranscription('ta') || 'வசனம் கிடைக்கவில்லை'}
                          </p>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                </Card>

                {/* Text Content */}
                <Card className="p-6 mb-8 gradient-card border-2 border-primary/20 rounded-3xl">
                  <h3 className="text-2xl font-bold mb-6">
                    Lesson Content / பாட உள்ளடக்கம்
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-primary/5 rounded-2xl">
                      <h4 className="text-lg font-semibold mb-3" lang="ta">தமிழ்:</h4>
                      <p className="text-xl leading-relaxed" lang="ta">
                        {lesson.content_text_tamil}
                      </p>
                    </div>
                    
                    <div className="p-6 bg-accent/5 rounded-2xl">
                      <h4 className="text-lg font-semibold mb-3">English:</h4>
                      <p className="text-xl leading-relaxed">
                        {lesson.content_text}
                      </p>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {/* Loading State */}
            {lessonLoading && (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading lesson...</p>
              </div>
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

export default CoursePageNew;
