import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  title: string;
  titleTamil: string;
  difficulty: string;
  progress: number;
  onClick: () => void;
  colorIndex?: number;
}

const CourseCard = ({ title, titleTamil, difficulty, progress, onClick, colorIndex = 0 }: CourseCardProps) => {
  const colorSchemes = [
    { textColor: "text-blue", iconBg: "bg-blue/10", iconColor: "text-blue", borderColor: "border-blue/30", gradient: "gradient-blue" },
    { textColor: "text-purple", iconBg: "bg-purple/10", iconColor: "text-purple", borderColor: "border-purple/30", gradient: "gradient-purple" },
    { textColor: "text-orange", iconBg: "bg-orange/10", iconColor: "text-orange", borderColor: "border-orange/30", gradient: "gradient-orange" },
    { textColor: "text-green", iconBg: "bg-green/10", iconColor: "text-green", borderColor: "border-green/30", gradient: "gradient-green" },
    { textColor: "text-pink", iconBg: "bg-pink/10", iconColor: "text-pink", borderColor: "border-pink/30", gradient: "gradient-pink" },
    { textColor: "text-teal", iconBg: "bg-teal/10", iconColor: "text-teal", borderColor: "border-teal/30", gradient: "gradient-blue" },
  ];
  
  const colors = colorSchemes[colorIndex % colorSchemes.length];

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`p-6 bg-card border-2 ${colors.borderColor} rounded-3xl shadow-elegant relative overflow-hidden`}>
        <div className={`absolute inset-0 ${colors.gradient} opacity-5`}></div>
        <div className="relative flex items-start gap-4 mb-4">
          <div className={`p-4 ${colors.iconBg} rounded-2xl`}>
            <BookOpen className={`w-8 h-8 ${colors.iconColor}`} aria-hidden="true" />
          </div>
          
          <div className="flex-1">
            <h3 className={`text-xl font-bold ${colors.textColor} mb-1`}>{titleTamil}</h3>
            <h4 className={`text-xl font-bold ${colors.textColor} mb-2`}>{title}</h4>
            <p className="text-lg text-muted-foreground">
              Difficulty: <span className="font-semibold">{difficulty}</span>
            </p>
          </div>
        </div>
        
        <div className="mb-4 relative">
          <div className="flex justify-between text-lg mb-2">
            <span>Progress</span>
            <span className={`font-bold ${colors.textColor}`}>{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" aria-label={`Course progress: ${progress}%`} />
        </div>
        
        <Button 
          onClick={onClick}
          className={`w-full text-lg py-6 rounded-2xl ${colors.gradient} text-white border-0 hover:opacity-90`}
          aria-label={`Continue learning ${title}`}
        >
          Continue Learning
        </Button>
      </Card>
    </motion.div>
  );
};

export default CourseCard;
