
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, Search, Home, Flame } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navigationItems = [
    { name: 'Accueil', path: '/', icon: Home },
    { name: 'Générateurs', path: '/generateurs', icon: Sparkles },
    { name: 'Revenue', path: '/revenue', icon: TrendingUp },
    { name: 'Analyse', path: '/analyse', icon: Search },
    { name: 'Tendance', path: '/tendance', icon: Flame },
  ];
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20">
      <div className="glass mx-4 mb-4 rounded-2xl overflow-hidden">
        <nav className="flex items-center justify-around py-3 px-1">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-tva-surface text-tva-primary glow-border'
                  : 'text-tva-text/60 hover:text-tva-text'
              }`}
            >
              <item.icon
                size={24}
                className={`mb-1 transition-transform ${
                  isActive(item.path) ? 'animate-pulse-soft' : 'group-hover:scale-110'
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
