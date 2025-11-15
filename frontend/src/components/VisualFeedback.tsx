import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type FeedbackType = 'success' | 'error' | 'warning' | 'info';

interface VisualFeedbackProps {
  type: FeedbackType;
  message: string;
  show: boolean;
  onClose?: () => void;
  duration?: number;
}

const VisualFeedback = ({ 
  type, 
  message, 
  show, 
  onClose, 
  duration = 3000 
}: VisualFeedbackProps) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-500',
      borderColor: 'border-green-600',
      textColor: 'text-white',
      iconColor: 'text-white'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-500',
      borderColor: 'border-red-600',
      textColor: 'text-white',
      iconColor: 'text-white'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-orange-500',
      borderColor: 'border-orange-600',
      textColor: 'text-white',
      iconColor: 'text-white'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-500',
      borderColor: 'border-blue-600',
      textColor: 'text-white',
      iconColor: 'text-white'
    }
  };

  const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`
            fixed top-20 left-1/2 transform -translate-x-1/2 z-[9999]
            ${bgColor} ${borderColor} ${textColor}
            border-4 rounded-2xl shadow-2xl
            px-6 py-4 min-w-[300px] max-w-md
          `}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="flex items-center gap-4">
            <Icon className={`w-8 h-8 flex-shrink-0 ${iconColor}`} aria-hidden="true" />
            <p className="font-semibold text-lg">{message}</p>
          </div>
          
          {/* Visual pulse animation for additional emphasis */}
          <div className="absolute inset-0 rounded-2xl border-4 border-white opacity-50 animate-ping" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook for easy visual feedback
export const useVisualFeedback = () => {
  const [feedback, setFeedback] = useState<{
    type: FeedbackType;
    message: string;
    show: boolean;
  }>({
    type: 'info',
    message: '',
    show: false
  });

  const showFeedback = (type: FeedbackType, message: string) => {
    setFeedback({ type, message, show: true });
  };

  const hideFeedback = () => {
    setFeedback(prev => ({ ...prev, show: false }));
  };

  return {
    feedback,
    showFeedback,
    hideFeedback,
    showSuccess: (message: string) => showFeedback('success', message),
    showError: (message: string) => showFeedback('error', message),
    showWarning: (message: string) => showFeedback('warning', message),
    showInfo: (message: string) => showFeedback('info', message),
  };
};

export default VisualFeedback;
