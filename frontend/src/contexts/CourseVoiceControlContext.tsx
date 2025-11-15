import { createContext, useContext, ReactNode } from 'react';

interface CourseVoiceActions {
  pauseCourse?: () => void;
  resumeCourse?: () => void;
  nextLesson?: () => void;
  previousLesson?: () => void;
}

const CourseVoiceControlContext = createContext<CourseVoiceActions | null>(null);

export const CourseVoiceControlProvider = ({ 
  children, 
  actions 
}: { 
  children: ReactNode; 
  actions: CourseVoiceActions;
}) => {
  return (
    <CourseVoiceControlContext.Provider value={actions}>
      {children}
    </CourseVoiceControlContext.Provider>
  );
};

export const useCourseVoiceActions = (): CourseVoiceActions | null => {
  return useContext(CourseVoiceControlContext);
};

