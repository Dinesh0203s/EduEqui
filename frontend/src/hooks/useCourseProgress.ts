import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface CourseProgress {
  courseId: string;
  userId: string;
  completedLessons: string[];
  currentLessonId: string;
  progress: number; // 0-100
  lastUpdated: string;
}

export const useCourseProgress = () => {
  const { user } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // Get progress from localStorage
  const getLocalProgress = useCallback((courseId: string): CourseProgress | null => {
    try {
      const key = `course_progress_${user?.id}_${courseId}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error reading progress:', error);
      return null;
    }
  }, [user?.id]);

  // Save progress to localStorage and backend
  const saveProgress = useCallback(
    async (
      courseId: string,
      completedLessons: string[],
      currentLessonId: string,
      totalLessons: number
    ) => {
      if (!user?.id) return;

      const progress = Math.round((completedLessons.length / totalLessons) * 100);
      const progressData: CourseProgress = {
        courseId,
        userId: user.id,
        completedLessons,
        currentLessonId,
        progress,
        lastUpdated: new Date().toISOString(),
      };

      // Save to localStorage
      try {
        const key = `course_progress_${user.id}_${courseId}`;
        localStorage.setItem(key, JSON.stringify(progressData));
      } catch (error) {
        console.error('Error saving progress to localStorage:', error);
      }

      // Save to backend (optional - localStorage is primary)
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_BASE_URL}/api/progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            userId: user.id,
            courseId,
            completedLessons,
            currentLessonId,
            progress,
          }),
        });

        if (!response.ok) {
          console.warn('Failed to save progress to backend (using localStorage only)');
        } else {
          console.log('Progress saved to backend successfully');
        }
      } catch (error) {
        // Silently fail - localStorage is the primary storage
        console.warn('Error saving progress to backend (using localStorage only):', error);
      }

      return progressData;
    },
    [user?.id, API_BASE_URL]
  );

  // Mark lesson as completed
  const markLessonCompleted = useCallback(
    async (courseId: string, lessonId: string, totalLessons: number) => {
      const currentProgress = getLocalProgress(courseId);
      const completedLessons = currentProgress?.completedLessons || [];

      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
      }

      return saveProgress(
        courseId,
        completedLessons,
        lessonId,
        totalLessons
      );
    },
    [getLocalProgress, saveProgress]
  );

  // Get progress percentage
  const getProgressPercentage = useCallback((courseId: string): number => {
    const progress = getLocalProgress(courseId);
    return progress?.progress || 0;
  }, [getLocalProgress]);

  // Get completed lessons count
  const getCompletedCount = useCallback((courseId: string): number => {
    const progress = getLocalProgress(courseId);
    return progress?.completedLessons.length || 0;
  }, [getLocalProgress]);

  return {
    getLocalProgress,
    saveProgress,
    markLessonCompleted,
    getProgressPercentage,
    getCompletedCount,
  };
};

