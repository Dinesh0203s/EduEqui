import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  BookOpen,
  Video,
  FileQuestion,
  Users,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Loader2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  useCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
  useLessons,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
  useQuizzes,
  useCreateQuiz,
  useUpdateQuiz,
  useDeleteQuiz,
  useVideos,
  useUploadVideo,
  useDeleteVideo,
  useStudentProgress,
  type Course,
  type Lesson,
  type Quiz,
  type Video,
} from "@/hooks/useAdminApi";

// Form schemas
const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  titleTamil: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  category: z.string().min(1, "Category is required"),
});

const lessonSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  title: z.string().min(1, "Title is required"),
  titleTamil: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  contentTamil: z.string().optional(),
  order: z.number().min(0),
  videoId: z.string().optional(),
  quizId: z.string().optional(),
});

const quizSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  title: z.string().min(1, "Title is required"),
  questions: z.array(
    z.object({
      question: z.string().min(1, "Question is required"),
      options: z.array(z.string()).min(2, "At least 2 options required"),
      correctAnswer: z.number().min(0),
    })
  ).min(1, "At least one question is required"),
});

const AdminDashboard = () => {
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [lessonsCourseId, setLessonsCourseId] = useState<string>("");
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);

  // Queries
  const { data: courses = [], isLoading: coursesLoading } = useCourses();
  const { data: lessons = [], isLoading: lessonsLoading } = useLessons(lessonsCourseId || undefined);
  const { data: quizzes = [], isLoading: quizzesLoading } = useQuizzes();
  const { data: videos = [], isLoading: videosLoading } = useVideos();
  const { data: studentProgress = [], isLoading: progressLoading } = useStudentProgress();

  // Mutations
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();
  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();
  const deleteLesson = useDeleteLesson();
  const createQuiz = useCreateQuiz();
  const updateQuiz = useUpdateQuiz();
  const deleteQuiz = useDeleteQuiz();
  const uploadVideo = useUploadVideo();
  const deleteVideo = useDeleteVideo();

  // Course form
  const courseForm = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      titleTamil: "",
      description: "",
      difficulty: "Beginner",
      category: "",
    },
  });

  // Lesson form
  const lessonForm = useForm<z.infer<typeof lessonSchema>>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      courseId: "",
      title: "",
      titleTamil: "",
      content: "",
      contentTamil: "",
      order: 0,
      videoId: "",
      quizId: "",
    },
  });

  // Quiz form
  const quizForm = useForm<z.infer<typeof quizSchema>>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      courseId: "",
      title: "",
      questions: [{ question: "", options: ["", ""], correctAnswer: 0 }],
    },
  });

  const handleCourseSubmit = async (values: z.infer<typeof courseSchema>) => {
    try {
      if (editingCourse) {
        await updateCourse.mutateAsync({ id: editingCourse.id, ...values });
        toast.success("Course updated successfully");
      } else {
        await createCourse.mutateAsync(values);
        toast.success("Course created successfully");
      }
      setCourseDialogOpen(false);
      setEditingCourse(null);
      courseForm.reset();
    } catch (error) {
      toast.error("Failed to save course");
    }
  };

  const handleLessonSubmit = async (values: z.infer<typeof lessonSchema>) => {
    try {
      if (editingLesson) {
        await updateLesson.mutateAsync({ id: editingLesson.id, ...values });
        toast.success("Lesson updated successfully");
      } else {
        await createLesson.mutateAsync(values);
        toast.success("Lesson created successfully");
      }
      setLessonDialogOpen(false);
      setEditingLesson(null);
      lessonForm.reset();
    } catch (error) {
      toast.error("Failed to save lesson");
    }
  };

  const handleQuizSubmit = async (values: z.infer<typeof quizSchema>) => {
    try {
      if (editingQuiz) {
        await updateQuiz.mutateAsync({ id: editingQuiz.id, ...values });
        toast.success("Quiz updated successfully");
      } else {
        await createQuiz.mutateAsync(values);
        toast.success("Quiz created successfully");
      }
      setQuizDialogOpen(false);
      setEditingQuiz(null);
      quizForm.reset();
    } catch (error) {
      toast.error("Failed to save quiz");
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      await deleteCourse.mutateAsync(id);
      toast.success("Course deleted successfully");
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  const handleDeleteLesson = async (id: string) => {
    try {
      await deleteLesson.mutateAsync(id);
      toast.success("Lesson deleted successfully");
    } catch (error) {
      toast.error("Failed to delete lesson");
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    try {
      await deleteQuiz.mutateAsync(id);
      toast.success("Quiz deleted successfully");
    } catch (error) {
      toast.error("Failed to delete quiz");
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!selectedCourseId) {
      toast.error("Please select a course first");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("courseId", selectedCourseId);
    formData.append("title", file.name);

    try {
      await uploadVideo.mutateAsync(formData);
      toast.success("Video uploaded successfully");
      event.target.value = "";
    } catch (error) {
      toast.error("Failed to upload video");
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      await deleteVideo.mutateAsync(id);
      toast.success("Video deleted successfully");
    } catch (error) {
      toast.error("Failed to delete video");
    }
  };

  const openEditCourse = (course: Course) => {
    setEditingCourse(course);
    courseForm.reset({
      title: course.title,
      titleTamil: course.titleTamil || "",
      description: course.description,
      difficulty: course.difficulty,
      category: course.category,
    });
    setCourseDialogOpen(true);
  };

  const openEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    lessonForm.reset({
      courseId: lesson.courseId,
      title: lesson.title,
      titleTamil: lesson.titleTamil || "",
      content: lesson.content,
      contentTamil: lesson.contentTamil || "",
      order: lesson.order,
      videoId: lesson.videoId || "",
      quizId: lesson.quizId || "",
    });
    setLessonDialogOpen(true);
  };

  const openEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    quizForm.reset({
      courseId: quiz.courseId,
      title: quiz.title,
      questions: quiz.questions,
    });
    setQuizDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage courses, videos, quizzes, and view student progress</p>
          </div>

          <Tabs defaultValue="courses" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="courses">
                <BookOpen className="w-4 h-4 mr-2" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="lessons">
                <FileText className="w-4 h-4 mr-2" />
                Lessons
              </TabsTrigger>
              <TabsTrigger value="videos">
                <Video className="w-4 h-4 mr-2" />
                ISL Videos
              </TabsTrigger>
              <TabsTrigger value="quizzes">
                <FileQuestion className="w-4 h-4 mr-2" />
                Quizzes
              </TabsTrigger>
              <TabsTrigger value="progress">
                <Users className="w-4 h-4 mr-2" />
                Student Progress
              </TabsTrigger>
            </TabsList>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Courses</CardTitle>
                      <CardDescription>Manage your courses</CardDescription>
                    </div>
                    <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => { setEditingCourse(null); courseForm.reset(); }}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Course
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{editingCourse ? "Edit Course" : "Create New Course"}</DialogTitle>
                          <DialogDescription>
                            {editingCourse ? "Update course information" : "Add a new course to the platform"}
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...courseForm}>
                          <form onSubmit={courseForm.handleSubmit(handleCourseSubmit)} className="space-y-4">
                            <FormField
                              control={courseForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Course title" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={courseForm.control}
                              name="titleTamil"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Title (Tamil)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Course title in Tamil" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={courseForm.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea placeholder="Course description" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={courseForm.control}
                                name="difficulty"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Difficulty</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select difficulty" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={courseForm.control}
                                name="category"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g., Mathematics" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <DialogFooter>
                              <Button type="button" variant="outline" onClick={() => setCourseDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="submit" disabled={createCourse.isPending || updateCourse.isPending}>
                                {createCourse.isPending || updateCourse.isPending ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                  </>
                                ) : (
                                  "Save"
                                )}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {coursesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : courses.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No courses yet. Create your first course!</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Difficulty</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {courses.map((course) => (
                          <TableRow key={course.id}>
                            <TableCell className="font-medium">{course.title}</TableCell>
                            <TableCell>{course.category}</TableCell>
                            <TableCell>{course.difficulty}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditCourse(course)}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the course "{course.title}". This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteCourse(course.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Lessons Tab */}
            <TabsContent value="lessons" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Lessons</CardTitle>
                      <CardDescription>Manage lessons for courses</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Select value={lessonsCourseId} onValueChange={setLessonsCourseId}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Filter by course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Courses</SelectItem>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={() => { setEditingLesson(null); lessonForm.reset(); }}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Lesson
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{editingLesson ? "Edit Lesson" : "Create New Lesson"}</DialogTitle>
                            <DialogDescription>
                              {editingLesson ? "Update lesson information" : "Add a new lesson to a course"}
                            </DialogDescription>
                          </DialogHeader>
                          <Form {...lessonForm}>
                            <form onSubmit={lessonForm.handleSubmit(handleLessonSubmit)} className="space-y-4">
                              <FormField
                                control={lessonForm.control}
                                name="courseId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Course</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a course" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {courses.map((course) => (
                                          <SelectItem key={course.id} value={course.id}>
                                            {course.title}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={lessonForm.control}
                                name="title"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Lesson title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={lessonForm.control}
                                name="titleTamil"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Title (Tamil)</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Lesson title in Tamil" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={lessonForm.control}
                                name="content"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                      <Textarea placeholder="Lesson content" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={lessonForm.control}
                                name="contentTamil"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Content (Tamil)</FormLabel>
                                    <FormControl>
                                      <Textarea placeholder="Lesson content in Tamil" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={lessonForm.control}
                                name="order"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Order</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        placeholder="Lesson order"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setLessonDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button type="submit" disabled={createLesson.isPending || updateLesson.isPending}>
                                  {createLesson.isPending || updateLesson.isPending ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Saving...
                                    </>
                                  ) : (
                                    "Save"
                                  )}
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {lessonsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : lessons.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No lessons yet. Create your first lesson!</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lessons.map((lesson) => {
                          const course = courses.find((c) => c.id === lesson.courseId);
                          return (
                            <TableRow key={lesson.id}>
                              <TableCell>{lesson.order}</TableCell>
                              <TableCell className="font-medium">{lesson.title}</TableCell>
                              <TableCell>{course?.title || "Unknown"}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openEditLesson(lesson)}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will permanently delete the lesson "{lesson.title}". This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteLesson(lesson.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>ISL Videos</CardTitle>
                      <CardDescription>Upload and manage ISL (Indian Sign Language) videos</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <label htmlFor="video-upload">
                        <Button asChild disabled={!selectedCourseId || uploadVideo.isPending}>
                          <span>
                            {uploadVideo.isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Video
                              </>
                            )}
                          </span>
                        </Button>
                        <input
                          id="video-upload"
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={handleVideoUpload}
                          disabled={!selectedCourseId || uploadVideo.isPending}
                        />
                      </label>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {videosLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : videos.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No videos yet. Upload your first ISL video!
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Uploaded</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {videos.map((video) => {
                          const course = courses.find((c) => c.id === video.courseId);
                          return (
                            <TableRow key={video.id}>
                              <TableCell className="font-medium">{video.title}</TableCell>
                              <TableCell>{course?.title || "Unknown"}</TableCell>
                              <TableCell>
                                {video.createdAt
                                  ? new Date(video.createdAt).toLocaleDateString()
                                  : "N/A"}
                              </TableCell>
                              <TableCell className="text-right">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the video "{video.title}". This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteVideo(video.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Quizzes Tab */}
            <TabsContent value="quizzes" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Quizzes</CardTitle>
                      <CardDescription>Create and manage quizzes for courses</CardDescription>
                    </div>
                    <Dialog open={quizDialogOpen} onOpenChange={setQuizDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => { setEditingQuiz(null); quizForm.reset(); }}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Quiz
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{editingQuiz ? "Edit Quiz" : "Create New Quiz"}</DialogTitle>
                          <DialogDescription>
                            {editingQuiz ? "Update quiz information" : "Create a new quiz for a course"}
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...quizForm}>
                          <form onSubmit={quizForm.handleSubmit(handleQuizSubmit)} className="space-y-4">
                            <FormField
                              control={quizForm.control}
                              name="courseId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Course</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a course" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {courses.map((course) => (
                                        <SelectItem key={course.id} value={course.id}>
                                          {course.title}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={quizForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Quiz Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Quiz title" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="space-y-4">
                              <FormLabel>Questions</FormLabel>
                              {quizForm.watch("questions").map((question, index) => (
                                <Card key={index}>
                                  <CardContent className="pt-6 space-y-4">
                                    <FormField
                                      control={quizForm.control}
                                      name={`questions.${index}.question`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Question {index + 1}</FormLabel>
                                          <FormControl>
                                            <Input placeholder="Enter question" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <div className="space-y-2">
                                      <FormLabel>Options</FormLabel>
                                      {question.options.map((_, optIndex) => (
                                        <FormField
                                          key={optIndex}
                                          control={quizForm.control}
                                          name={`questions.${index}.options.${optIndex}`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormControl>
                                                <div className="flex items-center gap-2">
                                                  <Input placeholder={`Option ${optIndex + 1}`} {...field} />
                                                  <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => {
                                                      const currentOptions = quizForm.getValues(`questions.${index}.options`);
                                                      quizForm.setValue(
                                                        `questions.${index}.options`,
                                                        currentOptions.filter((_, i) => i !== optIndex)
                                                      );
                                                    }}
                                                  >
                                                    <Trash2 className="w-4 h-4" />
                                                  </Button>
                                                </div>
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      ))}
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const currentOptions = quizForm.getValues(`questions.${index}.options`);
                                          quizForm.setValue(`questions.${index}.options`, [...currentOptions, ""]);
                                        }}
                                      >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Option
                                      </Button>
                                    </div>
                                    <FormField
                                      control={quizForm.control}
                                      name={`questions.${index}.correctAnswer`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Correct Answer (Option Index)</FormLabel>
                                          <Select
                                            onValueChange={(value) => field.onChange(parseInt(value))}
                                            value={field.value?.toString()}
                                          >
                                            <FormControl>
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select correct answer" />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              {question.options.map((_, optIndex) => (
                                                <SelectItem key={optIndex} value={optIndex.toString()}>
                                                  Option {optIndex + 1}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => {
                                        const currentQuestions = quizForm.getValues("questions");
                                        quizForm.setValue(
                                          "questions",
                                          currentQuestions.filter((_, i) => i !== index)
                                        );
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Remove Question
                                    </Button>
                                  </CardContent>
                                </Card>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  const currentQuestions = quizForm.getValues("questions");
                                  quizForm.setValue("questions", [
                                    ...currentQuestions,
                                    { question: "", options: ["", ""], correctAnswer: 0 },
                                  ]);
                                }}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Question
                              </Button>
                            </div>
                            <DialogFooter>
                              <Button type="button" variant="outline" onClick={() => setQuizDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="submit" disabled={createQuiz.isPending || updateQuiz.isPending}>
                                {createQuiz.isPending || updateQuiz.isPending ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                  </>
                                ) : (
                                  "Save"
                                )}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {quizzesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : quizzes.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No quizzes yet. Create your first quiz!</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Questions</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {quizzes.map((quiz) => {
                          const course = courses.find((c) => c.id === quiz.courseId);
                          return (
                            <TableRow key={quiz.id}>
                              <TableCell className="font-medium">{quiz.title}</TableCell>
                              <TableCell>{course?.title || "Unknown"}</TableCell>
                              <TableCell>{quiz.questions.length}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openEditQuiz(quiz)}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will permanently delete the quiz "{quiz.title}". This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteQuiz(quiz.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Student Progress Tab */}
            <TabsContent value="progress" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Student Progress</CardTitle>
                  <CardDescription>View student progress across all courses</CardDescription>
                </CardHeader>
                <CardContent>
                  {progressLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : studentProgress.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No student progress data available</p>
                  ) : (
                    <div className="space-y-6">
                      {studentProgress.map((student) => (
                        <Card key={student.studentId}>
                          <CardHeader>
                            <CardTitle>{student.studentName}</CardTitle>
                            <CardDescription>Student ID: {student.studentId}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {student.courses.map((course) => (
                                <div key={course.courseId} className="border rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold">{course.courseTitle}</h4>
                                    <span className="text-sm text-muted-foreground">
                                      {course.completedLessons}/{course.totalLessons} lessons
                                    </span>
                                  </div>
                                  <div className="w-full bg-secondary rounded-full h-2 mb-4">
                                    <div
                                      className="bg-primary h-2 rounded-full transition-all"
                                      style={{ width: `${course.progress}%` }}
                                    />
                                  </div>
                                  <div className="text-sm text-muted-foreground mb-2">
                                    Progress: {course.progress}%
                                  </div>
                                  {course.quizScores.length > 0 && (
                                    <div className="mt-4">
                                      <h5 className="font-medium mb-2">Quiz Scores:</h5>
                                      <div className="space-y-1">
                                        {course.quizScores.map((quiz) => (
                                          <div key={quiz.quizId} className="flex justify-between text-sm">
                                            <span>{quiz.quizTitle}</span>
                                            <span>
                                              {quiz.score}/{quiz.maxScore} ({Math.round((quiz.score / quiz.maxScore) * 100)}%)
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;

