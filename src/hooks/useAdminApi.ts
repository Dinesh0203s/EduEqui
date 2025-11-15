import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = "http://localhost:5000/api";

// Types
export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  titleTamil?: string;
  content: string;
  contentTamil?: string;
  order: number;
  videoId?: string;
  quizId?: string;
  video?: Video;
  quiz?: Quiz;
  createdAt?: string;
  updatedAt?: string;
}

export interface Course {
  id: string;
  title: string;
  titleTamil?: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  lessons?: Lesson[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  questions: Question[];
  createdAt?: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Video {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  videoUrl: string;
  islVideoUrl?: string;
  description?: string;
  createdAt?: string;
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  courses: {
    courseId: string;
    courseTitle: string;
    progress: number;
    completedLessons: number;
    totalLessons: number;
    quizScores: {
      quizId: string;
      quizTitle: string;
      score: number;
      maxScore: number;
    }[];
  }[];
}

// Courses API
export const useCourses = () => {
  return useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/courses`);
      if (!response.ok) throw new Error("Failed to fetch courses");
      return response.json();
    },
  });
};

export const useCourse = (courseId: string | null) => {
  return useQuery<Course>({
    queryKey: ["course", courseId],
    queryFn: async () => {
      if (!courseId) throw new Error("Course ID is required");
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
      if (!response.ok) throw new Error("Failed to fetch course");
      return response.json();
    },
    enabled: !!courseId,
  });
};

export const useLessons = (courseId?: string) => {
  return useQuery<Lesson[]>({
    queryKey: ["lessons", courseId],
    queryFn: async () => {
      const url = courseId ? `${API_BASE_URL}/lessons?courseId=${courseId}` : `${API_BASE_URL}/lessons`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch lessons");
      return response.json();
    },
  });
};

export const useLesson = (lessonId: string | null) => {
  return useQuery<Lesson>({
    queryKey: ["lesson", lessonId],
    queryFn: async () => {
      if (!lessonId) throw new Error("Lesson ID is required");
      const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}`);
      if (!response.ok) throw new Error("Failed to fetch lesson");
      return response.json();
    },
    enabled: !!lessonId,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (course: Omit<Course, "id" | "createdAt" | "updatedAt">) => {
      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
      });
      if (!response.ok) throw new Error("Failed to create course");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...course }: Partial<Course> & { id: string }) => {
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
      });
      if (!response.ok) throw new Error("Failed to update course");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete course");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
};

// Lessons API
export const useCreateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (lesson: Omit<Lesson, "id" | "createdAt" | "updatedAt">) => {
      const response = await fetch(`${API_BASE_URL}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lesson),
      });
      if (!response.ok) throw new Error("Failed to create lesson");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.invalidateQueries({ queryKey: ["course"] });
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...lesson }: Partial<Lesson> & { id: string }) => {
      const response = await fetch(`${API_BASE_URL}/lessons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lesson),
      });
      if (!response.ok) throw new Error("Failed to update lesson");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.invalidateQueries({ queryKey: ["course"] });
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/lessons/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete lesson");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.invalidateQueries({ queryKey: ["course"] });
    },
  });
};

// Quizzes API
export const useQuizzes = (courseId?: string) => {
  return useQuery<Quiz[]>({
    queryKey: ["quizzes", courseId],
    queryFn: async () => {
      const url = courseId ? `${API_BASE_URL}/quizzes?courseId=${courseId}` : `${API_BASE_URL}/quizzes`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch quizzes");
      return response.json();
    },
  });
};

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (quiz: Omit<Quiz, "id" | "createdAt">) => {
      const response = await fetch(`${API_BASE_URL}/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quiz),
      });
      if (!response.ok) throw new Error("Failed to create quiz");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });
};

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...quiz }: Partial<Quiz> & { id: string }) => {
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quiz),
      });
      if (!response.ok) throw new Error("Failed to update quiz");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });
};

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete quiz");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });
};

// Videos API
export const useVideos = (courseId?: string) => {
  return useQuery<Video[]>({
    queryKey: ["videos", courseId],
    queryFn: async () => {
      const url = courseId ? `${API_BASE_URL}/videos?courseId=${courseId}` : `${API_BASE_URL}/videos`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch videos");
      return response.json();
    },
  });
};

export const useUploadVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`${API_BASE_URL}/videos/upload`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload video");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
};

export const useDeleteVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete video");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
};

// Student Progress API
export const useStudentProgress = () => {
  return useQuery<StudentProgress[]>({
    queryKey: ["student-progress"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/students/progress`);
      if (!response.ok) throw new Error("Failed to fetch student progress");
      return response.json();
    },
  });
};

