
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { Toaster } from '@/components/ui/toaster';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex flex-col bg-tva-bg text-tva-text">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-50%] left-[-20%] w-[70%] h-[70%] rounded-full bg-tva-primary opacity-[0.02] blur-[120px]"></div>
        <div className="absolute bottom-[-30%] right-[-10%] w-[60%] h-[60%] rounded-full bg-tva-secondary opacity-[0.02] blur-[100px]"></div>
      </div>
      
      <Header />
      
      <main className="flex-1 pb-20 px-4 pt-4 max-w-3xl mx-auto w-full relative z-10">
        {/* Removed key={location.pathname} to prevent re-mounting */}
        <div className="transition-opacity duration-300 ease-in-out">
          {children}
        </div>
      </main>
      
      <BottomNavigation />
      <Toaster />
    </div>
  );
};
