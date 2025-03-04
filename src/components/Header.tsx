
import React from 'react';
import { Bell, Download, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
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
          
          <div className="h-8 w-8 rounded-full bg-tva-surface border border-tva-border flex items-center justify-center overflow-hidden">
            <span className="text-xs font-medium">TV</span>
          </div>
        </div>
      </div>
    </header>
  );
};
