
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import { Sparkles, Zap, Hash, FileText, Flame } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Rediriger vers la page des générateurs (si nécessaire)
    // navigate('/generateurs');
  }, [navigate]);
  
  const features = [
    {
      icon: Sparkles,
      title: "Générateurs",
      description: "Créez des scripts, hooks, descriptions et hashtags viraux",
      path: "/generateurs",
      color: "from-tva-primary to-blue-500"
    },
    {
      icon: Zap,
      title: "Revenue",
      description: "Simulez et analysez votre potentiel de revenus TikTok",
      path: "/revenue",
      color: "from-green-400 to-tva-secondary"
    },
    {
      icon: Hash,
      title: "Analyse",
      description: "Analysez les performances de vos vidéos et optimisez-les",
      path: "/analyse",
      color: "from-pink-500 to-tva-accent"
    },
    {
      icon: FileText,
      title: "Téléchargement",
      description: "Téléchargez nos ressources gratuites pour créateurs",
      path: "/telechargement",
      color: "from-purple-500 to-indigo-500"
    }
  ];
  
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
        
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              onClick={() => navigate(feature.path)}
              className="glass hover-card p-5 rounded-2xl cursor-pointer"
            >
              <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                <feature.icon size={24} className="text-white" />
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-tva-text/70">{feature.description}</p>
            </div>
          ))}
        </section>
        
        <section className="glass p-5 rounded-2xl space-y-3">
          <h3 className="text-lg font-semibold">Commencez votre voyage vers la viralité</h3>
          <p className="text-sm text-tva-text/70">
            Connectez votre compte TikTok et commencez à analyser votre profil pour des recommandations personnalisées.
          </p>
          <button className="w-full py-3 px-4 bg-gradient-to-r from-tva-primary to-tva-secondary text-white font-medium rounded-xl hover:shadow-lg hover:opacity-90 transition-all">
            Connecter mon compte TikTok
          </button>
        </section>
      </div>
    </AppLayout>
  );
};

export default Index;
