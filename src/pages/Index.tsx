
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import { Flame } from 'lucide-react';
import { TikTokConnectModal, TikTokProfile } from '../components/TikTokConnectModal';
import { TikTokProfileCard } from '../components/TikTokProfileCard';
import { TikTokVideoGrid } from '../components/TikTokVideoGrid';

// Create a TikTok icon component
const TiktokIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    <path d="M15 8a4 4 0 0 0 4 4V4a4 4 0 0 1-4 4Z" />
    <path d="M15 8v8a4 4 0 0 1-4 4" />
  </svg>
);

const Index = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [profile, setProfile] = useState<TikTokProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleConnectTikTok = () => {
    setIsModalOpen(true);
  };
  
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  
  const handleConnectionSuccess = (profileData: TikTokProfile) => {
    setIsConnected(true);
    setProfile(profileData);
  };
  
  return (
    <AppLayout>
      <div className="space-y-8 pb-4">
        <section className="text-center space-y-4 py-6">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-tva-surface border border-tva-border">
            <Flame size={16} className="text-tva-accent mr-2" />
            <span className="text-xs font-medium">Plateforme tout-en-un pour créateurs TikTok</span>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight">
            Rendez vos contenus <span className="text-transparent bg-clip-text bg-gradient-to-r from-tva-primary to-tva-secondary">viral sur TikTok</span>
          </h1>
          
          <p className="text-tva-text/70 max-w-md mx-auto">
            Analysez, créez et optimisez vos vidéos avec notre suite d'outils alimentée par l'IA pour maximiser votre croissance sur TikTok.
          </p>
        </section>
        
        {!isConnected ? (
          <section className="glass p-7 rounded-2xl text-center space-y-6 animate-pulse-soft">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-tva-primary to-tva-secondary flex items-center justify-center">
              <TiktokIcon />
            </div>
            <h3 className="text-xl font-semibold">Connectez votre compte TikTok</h3>
            <p className="text-sm text-tva-text/70 max-w-md mx-auto">
              Pour accéder à toutes les fonctionnalités de l'application et obtenir des recommandations personnalisées, connectez votre compte TikTok.
            </p>
            <button 
              onClick={handleConnectTikTok}
              className="w-full max-w-md mx-auto py-3 px-4 bg-gradient-to-r from-tva-primary to-tva-secondary text-white font-medium rounded-xl hover:shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <TiktokIcon />
              Connecter mon compte TikTok
            </button>
          </section>
        ) : (
          <section className="space-y-6">
            {profile && (
              <>
                <TikTokProfileCard profile={profile} />
                <TikTokVideoGrid videos={profile.videos} />
                
                <button 
                  onClick={() => navigate('/generateurs')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-tva-primary to-tva-secondary text-white font-medium rounded-xl hover:shadow-lg hover:opacity-90 transition-all"
                >
                  Commencer à créer du contenu viral
                </button>
              </>
            )}
          </section>
        )}
      </div>
      
      <TikTokConnectModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleConnectionSuccess}
      />
    </AppLayout>
  );
};

export default Index;
