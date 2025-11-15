import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Settings, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import CourseCard from "@/components/CourseCard";

const courses = [
  {
    id: "math",
    title: "Mathematics",
    titleTamil: "கணிதம்",
    difficulty: "Beginner",
    progress: 35,
  },
  {
    id: "science",
    title: "Science",
    titleTamil: "அறிவியல்",
    difficulty: "Intermediate",
    progress: 62,
  },
  {
    id: "language",
    title: "Language Arts",
    titleTamil: "மொழி கலைகள்",
    difficulty: "Beginner",
    progress: 48,
  },
  {
    id: "history",
    title: "History",
    titleTamil: "வரலாறு",
    difficulty: "Intermediate",
    progress: 20,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const userName = "ராஜேஷ் / Rajesh";

  const handleCourseClick = (courseId: string) => {
    navigate("/course", { state: { courseId } });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <AccessibilityToolbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Welcome Section */}
            <div className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
                வணக்கம் {userName}!
              </h1>
              <p className="text-2xl text-muted-foreground">
                Welcome back! Ready to continue learning?
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button
                variant="outline"
                size="lg"
                className="text-lg rounded-2xl"
                aria-label="Go to settings"
              >
                <Settings className="w-5 h-5 mr-2" aria-hidden="true" />
                Settings
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="text-lg rounded-2xl"
                aria-label="Get help"
              >
                <HelpCircle className="w-5 h-5 mr-2" aria-hidden="true" />
                Help
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="text-lg rounded-2xl"
                onClick={() => navigate("/")}
                aria-label="Log out"
              >
                <LogOut className="w-5 h-5 mr-2" aria-hidden="true" />
                Log Out
              </Button>
            </div>

            {/* Courses Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary" aria-hidden="true" />
                Your Courses
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                உங்கள் பாடநெறிகள்
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <CourseCard
                      title={course.title}
                      titleTamil={course.titleTamil}
                      difficulty={course.difficulty}
                      progress={course.progress}
                      onClick={() => handleCourseClick(course.id)}
                      colorIndex={index}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
