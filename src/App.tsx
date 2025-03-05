
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LicenseProvider } from "@/contexts/LicenseContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ProtectedLicenseRoute } from "@/components/ProtectedLicenseRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import GenerateursPage from "./pages/Generateurs";
import RevenuePage from "./pages/Revenue";
import AnalysePage from "./pages/Analyse";
import TelechargementPage from "./pages/Telechargement";
import TendancePage from "./pages/Tendance";
import ProfilePage from "./pages/Profile";
import AdminLicensesPage from "./pages/admin/AdminLicenses"; 
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LicenseProvider>
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
                  <ProtectedLicenseRoute>
                    <GenerateursPage />
                  </ProtectedLicenseRoute>
                } 
              />
              <Route 
                path="/revenue" 
                element={
                  <ProtectedLicenseRoute>
                    <RevenuePage />
                  </ProtectedLicenseRoute>
                } 
              />
              <Route 
                path="/analyse" 
                element={
                  <ProtectedLicenseRoute>
                    <AnalysePage />
                  </ProtectedLicenseRoute>
                } 
              />
              <Route 
                path="/telechargement" 
                element={
                  <ProtectedLicenseRoute>
                    <TelechargementPage />
                  </ProtectedLicenseRoute>
                } 
              />
              <Route 
                path="/tendance" 
                element={
                  <ProtectedLicenseRoute>
                    <TendancePage />
                  </ProtectedLicenseRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/licenses" 
                element={
                  <ProtectedRoute>
                    <AdminLicensesPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LicenseProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
