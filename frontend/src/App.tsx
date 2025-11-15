import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import VoiceControl from "@/components/VoiceControl";
import KeyboardShortcutsHelp from "@/components/KeyboardShortcutsHelp";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useKeyboardShortcuts, createDefaultShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import CategorySelection from "./pages/CategorySelection";
import LanguageSelect from "./pages/LanguageSelect";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CoursePage from "./pages/CoursePage";
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
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/category" element={<ProtectedRoute><CategorySelection /></ProtectedRoute>} />
        <Route path="/language" element={<ProtectedRoute><LanguageSelect /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/course" element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
        <Route path="/course/:courseId" element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
        <Route path="/result" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SettingsProvider>
        <TooltipProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </SettingsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
