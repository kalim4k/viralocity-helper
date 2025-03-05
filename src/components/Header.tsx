
import React from 'react';
import { Bell, Download, DollarSign, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 w-full glass px-4 py-3">
      <div className="flex justify-between items-center max-w-3xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-tva-primary to-tva-secondary flex items-center justify-center">
            <span className="text-white font-bold">TV</span>
          </div>
          <span className="font-semibold text-xl tracking-tight">TikViral</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link to="/revenue" className="relative p-2 rounded-full hover:bg-tva-surface transition-colors">
            <DollarSign size={20} className="text-tva-text" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-tva-accent rounded-full"></span>
          </Link>
          
          <Link to="/telechargement" className="relative p-2 rounded-full hover:bg-tva-surface transition-colors">
            <Download size={20} className="text-tva-text" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-tva-accent rounded-full"></span>
          </Link>
          
          <button className="relative p-2 rounded-full hover:bg-tva-surface transition-colors">
            <Bell size={20} className="text-tva-text" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-tva-accent rounded-full"></span>
          </button>
          
          <Link to="/profile" className="h-8 w-8 rounded-full bg-tva-surface border border-tva-border flex items-center justify-center overflow-hidden hover:bg-tva-surface/80 transition-colors">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs font-medium">TV</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};
