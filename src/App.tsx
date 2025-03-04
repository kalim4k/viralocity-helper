
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GenerateursPage from "./pages/Generateurs";
import RevenuePage from "./pages/Revenue";
import AnalysePage from "./pages/Analyse";
import TelechargementPage from "./pages/Telechargement";
import TendancePage from "./pages/Tendance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/generateurs" element={<GenerateursPage />} />
          <Route path="/revenue" element={<RevenuePage />} />
          <Route path="/analyse" element={<AnalysePage />} />
          <Route path="/telechargement" element={<TelechargementPage />} />
          <Route path="/tendance" element={<TendancePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
