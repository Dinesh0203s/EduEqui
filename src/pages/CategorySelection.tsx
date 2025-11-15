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
      <Header />
      <AccessibilityToolbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                size="lg"
                className="text-lg rounded-2xl"
                aria-label="Go back to home page"
              >
                <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
                Back to Home
              </Button>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-primary">
              Choose Your Learning Path
            </h1>
            <p className="text-2xl text-center mb-12 text-muted-foreground">
              உங்கள் கற்றல் பாதையை தேர்வு செய்யுங்கள்
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
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
                  {
                    colorClass: "gradient-orange",
                    textColor: "text-orange",
                    iconBg: "bg-orange/10",
                    iconColor: "text-orange",
                    borderColor: "border-orange/30"
                  },
                  {
                    colorClass: "gradient-green",
                    textColor: "text-green",
                    iconBg: "bg-green/10",
                    iconColor: "text-green",
                    borderColor: "border-green/30"
                  }
                ];
                const colors = colorSchemes[index % colorSchemes.length];
                
                return (
                  <div 
                    key={category.id}
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
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategorySelection;
