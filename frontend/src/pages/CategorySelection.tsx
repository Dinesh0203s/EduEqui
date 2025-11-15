import { useNavigate } from "react-router-dom";
import { Eye, Ear, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import CategoryCard from "@/components/CategoryCard";

const categories = [
  {
    id: "blind",
    title: "Blind / Visually Impaired",
    titleTamil: "காட்சி குறைபாடு",
    description: "Audio-first learning with screen reader support and voice navigation",
    icon: Eye,
  },
  {
    id: "deaf",
    title: "Deaf / Hard of Hearing",
    titleTamil: "செவித்திறன் குறைபாடு",
    description: "Visual learning with sign language support and text transcripts",
    icon: Ear,
  },
];

const CategorySelection = () => {
  const navigate = useNavigate();

  const handleCategorySelect = (categoryId: string) => {
    navigate("/language", { state: { category: categoryId } });
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
      
      <main className="flex-1 py-12 px-4" id="main-content" role="main" aria-label="Category selection main content">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <nav className="mb-8" aria-label="Navigation">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                size="lg"
                className="text-lg rounded-2xl min-w-[160px] min-h-[48px]"
                aria-label="Go back to home page. Voice command: go back"
              >
                <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
                Back to Home
              </Button>
            </nav>

            <section 
              className="text-center mb-12"
              aria-labelledby="category-heading"
            >
              <h1 id="category-heading" className="text-4xl md:text-5xl font-bold mb-4 text-primary">
                Choose Your Learning Path
              </h1>
              <p className="text-2xl text-muted-foreground" lang="ta">
                உங்கள் கற்றல் பாதையை தேர்வு செய்யுங்கள்
              </p>
            </section>

            <section 
              aria-labelledby="categories-list-heading"
              role="region"
            >
              <h2 id="categories-list-heading" className="sr-only">Available learning categories</h2>
              <div 
                className="grid md:grid-cols-2 gap-8 mb-8"
                role="list"
                aria-label="Learning path categories"
              >
                {categories.map((category, index) => {
                  const colorSchemes = [
                    {
                      colorClass: "gradient-blue",
                      textColor: "text-blue",
                      iconBg: "bg-blue/10",
                      iconColor: "text-blue",
                      borderColor: "border-blue/30"
                    },
                    {
                      colorClass: "gradient-purple",
                      textColor: "text-purple",
                      iconBg: "bg-purple/10",
                      iconColor: "text-purple",
                      borderColor: "border-purple/30"
                    },
                  ];
                  const colors = colorSchemes[index % colorSchemes.length];
                  
                  return (
                    <div 
                      key={category.id}
                      role="listitem"
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <CategoryCard
                        title={category.title}
                        titleTamil={category.titleTamil}
                        description={category.description}
                        icon={category.icon}
                        onClick={() => {}}
                        {...colors}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategorySelection;