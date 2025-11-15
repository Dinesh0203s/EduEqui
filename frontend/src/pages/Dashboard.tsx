import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Settings, HelpCircle, LogOut, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import CourseCard from "@/components/CourseCard";
import { useCourses } from "@/hooks/useAdminApi";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseProgress } from "@/hooks/useCourseProgress";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: allCourses = [], isLoading } = useCourses();
  const { user, logout } = useAuth();
  const { getProgressPercentage } = useCourseProgress();
  
  // Debug: Log all courses received
  useEffect(() => {
    console.log('All courses from API:', allCourses);
  }, [allCourses]);
  
  // Filter to show only Mathematics and Science courses (exact match)
  const courses = allCourses.filter((course: any) => {
    const title = (course.title || course.name || '').trim();
    const titleLower = title.toLowerCase();
    // Match exactly "Mathematics" or "Science" (not "Environmental Science" or "Computer Science")
    const isMatch = title === 'Mathematics' || title === 'Science' ||
           title === 'கணிதம்' || title === 'அறிவியல்' ||
           titleLower === 'mathematics' || titleLower === 'science';
    
    if (isMatch) {
      console.log('Matched course:', { title, id: course.id, _id: course._id });
    }
    
    return isMatch;
  });
  
  // Debug: Log filtered courses
  useEffect(() => {
    console.log('Filtered courses:', courses);
  }, [courses]);
  
  const userName = user?.name || "User";

  const handleCourseClick = (courseId: string) => {
    console.log('handleCourseClick called with:', courseId);
    if (!courseId) {
      console.error('Course ID is missing!');
      alert('Error: Course ID is missing. Please try again.');
      return;
    }
    
    try {
      console.log('Navigating to:', `/course/${courseId}`);
      navigate(`/course/${courseId}`);
    } catch (error) {
      console.error('Navigation error:', error);
      alert('Error navigating to course. Please try again.');
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
      
      <main className="flex-1 py-12 px-4" id="main-content" role="main" aria-label="Dashboard main content">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Welcome Section */}
            <section 
              className="mb-12 text-center"
              aria-labelledby="welcome-heading"
              role="region"
            >
              <h1 id="welcome-heading" className="text-4xl md:text-5xl font-bold mb-4 text-primary">
                வணக்கம் {userName}!
              </h1>
              <p className="text-2xl text-muted-foreground">
                Welcome back! Ready to continue learning?
              </p>
            </section>

            {/* Navigation Buttons */}
            <nav 
              className="flex flex-wrap justify-center gap-4 mb-12"
              aria-label="Quick actions"
              role="navigation"
            >
              <Button
                variant="outline"
                size="lg"
                className="text-lg rounded-2xl min-w-[140px] min-h-[48px]"
                onClick={() => navigate('/profile')}
                aria-label="Go to your profile page"
              >
                <User className="w-5 h-5 mr-2" aria-hidden="true" />
                Profile
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="text-lg rounded-2xl min-w-[140px] min-h-[48px]"
                onClick={() => navigate('/settings')}
                aria-label="Go to settings page. Keyboard shortcut: Alt plus S"
              >
                <Settings className="w-5 h-5 mr-2" aria-hidden="true" />
                Settings
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="text-lg rounded-2xl min-w-[140px] min-h-[48px]"
                aria-label="Get help and support"
              >
                <HelpCircle className="w-5 h-5 mr-2" aria-hidden="true" />
                Help
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="text-lg rounded-2xl min-w-[140px] min-h-[48px]"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                aria-label="Log out and return to home"
              >
                <LogOut className="w-5 h-5 mr-2" aria-hidden="true" />
                Log Out
              </Button>
            </nav>

            {/* Courses Section */}
            <section 
              className="mb-8"
              aria-labelledby="courses-heading"
              role="region"
            >
              <div className="mb-8">
                <h2 id="courses-heading" className="text-3xl font-bold mb-2 flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-primary" aria-hidden="true" />
                  Your Courses
                </h2>
                <p className="text-xl text-muted-foreground">
                  உங்கள் பாடநெறிகள்
                </p>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading courses...</p>
                </div>
              ) : (
                <div 
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                  role="list"
                  aria-label="Course list"
                >
                  {courses.map((course: any, index: number) => {
                    const courseId = course.id || course._id;
                    console.log(`Course ${index}:`, {
                      title: course.title || course.name,
                      id: course.id,
                      _id: course._id,
                      courseId: courseId
                    });
                    
                    return (
                      <motion.div
                        key={courseId || index}
                        role="listitem"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <CourseCard
                          title={course.title || course.name}
                          titleTamil={course.titleTamil || course.name_tamil}
                          difficulty={course.difficulty || "Beginner"}
                          progress={getProgressPercentage(courseId)}
                          onClick={() => {
                            console.log('CourseCard clicked:', courseId);
                            if (courseId) {
                              handleCourseClick(courseId);
                            } else {
                              console.error('No course ID available!', course);
                            }
                          }}
                          colorIndex={index}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </section>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;