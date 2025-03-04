
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import { Flame, TiktokIcon, User, UserCheck } from 'lucide-react';

// Create a TikTok icon component since it's not directly available in lucide-react
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

interface TikTokProfile {
  username: string;
  displayName: string;
  avatar: string;
  followers: number;
  likes: number;
  videos: Array<{
    id: string;
    thumbnail: string;
    views: number;
    title: string;
  }>;
}

const Index = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [profile, setProfile] = useState<TikTokProfile | null>(null);
  
  const handleConnectTikTok = () => {
    // This would be replaced with actual TikTok API connection logic
    // For now, we'll simulate a successful connection with mock data
    setIsConnected(true);
    setProfile({
      username: '@tikviraluser',
      displayName: 'TikViral Creator',
      avatar: 'https://i.pravatar.cc/150?img=32',
      followers: 45200,
      likes: 728500,
      videos: [
        {
          id: '1',
          thumbnail: 'https://picsum.photos/200/350',
          views: 12500,
          title: 'Mon dernier tutoriel #viral'
        },
        {
          id: '2',
          thumbnail: 'https://picsum.photos/200/350?random=2',
          views: 8300,
          title: 'Comment devenir viral sur TikTok'
        },
        {
          id: '3',
          thumbnail: 'https://picsum.photos/200/350?random=3',
          views: 32100,
          title: 'Mes astuces pour gagner des followers'
        }
      ]
    });
  };
  
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
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
            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-tva-primary">
                  <img src={profile?.avatar} alt="Profile" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{profile?.displayName}</h3>
                  <p className="text-sm text-tva-text/70">{profile?.username}</p>
                </div>
                <div className="flex items-center text-sm text-tva-accent font-medium gap-1">
                  <UserCheck size={16} />
                  <span>Connecté</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="glass p-4 rounded-xl text-center">
                  <p className="text-sm text-tva-text/70">Abonnés</p>
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-tva-primary to-tva-secondary">
                    {formatNumber(profile?.followers || 0)}
                  </p>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                  <p className="text-sm text-tva-text/70">Likes</p>
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-tva-primary to-tva-accent">
                    {formatNumber(profile?.likes || 0)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Vidéos récentes</h3>
              <div className="grid grid-cols-3 gap-3">
                {profile?.videos.map(video => (
                  <div key={video.id} className="glass rounded-xl overflow-hidden">
                    <div className="aspect-[9/16] relative">
                      <img src={video.thumbnail} alt={video.title} className="h-full w-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="text-xs text-white font-medium">{formatNumber(video.views)} vues</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/generateurs')}
              className="w-full py-3 px-4 bg-gradient-to-r from-tva-primary to-tva-secondary text-white font-medium rounded-xl hover:shadow-lg hover:opacity-90 transition-all"
            >
              Commencer à créer du contenu viral
            </button>
          </section>
        )}
      </div>
    </AppLayout>
  );
};

export default Index;
