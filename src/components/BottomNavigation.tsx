
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Search, Home, Zap } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navigationItems = useMemo(() => [
    { name: 'Accueil', path: '/', icon: Home },
    { name: 'Générateurs', path: '/generateurs', icon: Sparkles },
    { name: 'Analyse', path: '/analyse', icon: Search },
    { name: 'Boost', path: '/boost', icon: Zap },
  ], []);
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    // Check if current path starts with the navigation item path
    if (path !== '/' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };
  
  const handleNavigation = (path: string) => {
    if (location.pathname !== path) {
      // Using replace: true to prevent history buildup
      navigate(path, { replace: true });
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20">
      <div className="glass mx-4 mb-4 rounded-2xl overflow-hidden">
        <nav className="flex items-center justify-around py-3 px-1">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-tva-surface text-tva-primary glow-border'
                  : 'text-tva-text/60 hover:text-tva-text'
              }`}
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              <item.icon
                size={24}
                className={`mb-1 transition-transform ${
                  isActive(item.path) ? 'text-tva-primary' : ''
                }`}
              />
              <span className="text-xs font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
