import { useRef } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { speakWithTTS } from "@/lib/tts";

interface CategoryCardProps {
  title: string;
  titleTamil: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  colorClass?: string;
  textColor?: string;
  iconBg?: string;
  iconColor?: string;
  borderColor?: string;
}

const CategoryCard = ({ 
  title, 
  titleTamil, 
  description, 
  icon: Icon, 
  onClick,
  colorClass = "gradient-blue",
  textColor = "text-blue",
  iconBg = "bg-blue/10",
  iconColor = "text-blue",
  borderColor = "border-blue/30"
}: CategoryCardProps) => {
  const isSpeakingRef = useRef(false);
  
  const handleHover = () => {
    if (isSpeakingRef.current) return;
    
    isSpeakingRef.current = true;
    speakWithTTS({
      text: `${title}. ${description}`,
      languageCode: 'en-US',
      force: true
    })
    .finally(() => {
      setTimeout(() => {
        isSpeakingRef.current = false;
      }, 1000);
    })
    .catch(error => {
      console.error('Error in TTS:', error);
      isSpeakingRef.current = false;
    });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={handleHover}
      onFocus={handleHover}
    >
      <Card
        className={`p-8 bg-card cursor-pointer hover:shadow-elegant transition-all border-2 ${borderColor} rounded-3xl relative overflow-hidden`}
        onClick={onClick}
        onMouseEnter={handleHover}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        aria-label={`${title} - ${description}`}
      >
        <div className={`absolute inset-0 ${colorClass} opacity-5`}></div>
        <div className="relative flex flex-col items-center text-center gap-4">
          <div className={`p-6 ${iconBg} rounded-full`}>
            <Icon className={`w-16 h-16 ${iconColor}`} aria-hidden="true" />
          </div>
          
          <div>
            <h3 className={`text-2xl font-bold ${textColor} mb-1`}>{titleTamil}</h3>
            <h4 className={`text-2xl font-bold ${textColor} mb-2`}>{title}</h4>
            <p className="text-lg text-muted-foreground">{description}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CategoryCard;
