import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { SettingsProvider } from "@/contexts/SettingsContext";
import VoiceControl from "@/components/VoiceControl";
import KeyboardShortcutsHelp from "@/components/KeyboardShortcutsHelp";
import { useKeyboardShortcuts, createDefaultShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useState } from "react";
import Home from "./pages/Home";
import CategorySelection from "./pages/CategorySelection";
import LanguageSelect from "./pages/LanguageSelect";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CoursePageNew from "./pages/CoursePageNew";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const navigate = useNavigate();
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [voiceControlActive, setVoiceControlActive] = useState(true);

  // Setup keyboard shortcuts
  const shortcuts = createDefaultShortcuts(
    navigate,
    () => setShowShortcutsHelp(true),
    () => setVoiceControlActive(prev => !prev)
  );
  useKeyboardShortcuts(shortcuts);

  return (
    <>
      <Toaster />
      <Sonner />
      <VoiceControl />
      <KeyboardShortcutsHelp 
        open={showShortcutsHelp} 
        onOpenChange={setShowShortcutsHelp} 
      />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category" element={<CategorySelection />} />
        <Route path="/language" element={<LanguageSelect />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/course" element={<CoursePageNew />} />
        <Route path="/course/:courseId" element={<CoursePageNew />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/settings" element={<Settings />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
