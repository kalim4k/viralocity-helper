
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import GenerateursPage from "./pages/Generateurs";
import RevenuePage from "./pages/Revenue";
import AnalysePage from "./pages/Analyse";
import TelechargementPage from "./pages/Telechargement";
import TendancePage from "./pages/Tendance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/generateurs" 
              element={
                <ProtectedRoute>
                  <GenerateursPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/revenue" 
              element={
                <ProtectedRoute>
                  <RevenuePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analyse" 
              element={
                <ProtectedRoute>
                  <AnalysePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/telechargement" 
              element={
                <ProtectedRoute>
                  <TelechargementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tendance" 
              element={
                <ProtectedRoute>
                  <TendancePage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
