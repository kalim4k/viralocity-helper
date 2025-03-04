
import React from 'react';
import { AppLayout } from '../components/AppLayout';
import { Flame, Music, Hash, Sparkles, Users } from 'lucide-react';

const TendancePage = () => {
  const trendingCategories = [
    {
      title: "Songs",
      icon: Music,
      items: [
        { name: "Whatever - Coco & Clair Clair", description: "2.1M+ vidéos", isHot: true },
        { name: "Fantasy - Meiko", description: "1.4M+ vidéos", isHot: false },
        { name: "Petit génie - Jungeli", description: "950K+ vidéos", isHot: true }
      ]
    },
    {
      title: "Challenges",
      icon: Hash,
      items: [
        { name: "Transition Challenge", description: "15M+ vidéos", isHot: true },
        { name: "DanceWithMe", description: "8.2M+ vidéos", isHot: false },
        { name: "OutfitCheck", description: "6.7M+ vidéos", isHot: true }
      ]
    },
    {
      title: "Effets",
      icon: Sparkles,
      items: [
        { name: "Bold Glamour Filter", description: "32M+ utilisations", isHot: true },
        { name: "3D Photo Effect", description: "18M+ utilisations", isHot: true },
        { name: "Mirror Effect", description: "12M+ utilisations", isHot: false }
      ]
    },
    {
      title: "Créateurs Tendance",
      icon: Users,
      items: [
        { name: "@créateursviral", description: "+500K abonnés cette semaine", isHot: true },
        { name: "@content.king", description: "+350K abonnés cette semaine", isHot: false },
        { name: "@tiklife", description: "+280K abonnés cette semaine", isHot: true }
      ]
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Tendances</h1>
          <div className="flex items-center gap-1 text-xs font-medium text-tva-accent">
            <Flame size={16} className="animate-pulse-soft" />
            <span>Mis à jour aujourd'hui</span>
          </div>
        </div>
        
        <p className="text-tva-text/70 text-sm">
          Découvrez ce qui fait vibrer TikTok en ce moment pour optimiser votre contenu.
        </p>

        <div className="space-y-8">
          {trendingCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-3">
              <div className="flex items-center gap-2">
                <category.icon size={20} className="text-tva-primary" />
                <h2 className="font-semibold">{category.title}</h2>
              </div>
              
              <div className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <div 
                    key={itemIndex} 
                    className="glass p-4 rounded-xl hover-card cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium mb-1">{item.name}</h3>
                        <p className="text-xs text-tva-text/70">{item.description}</p>
                      </div>
                      
                      {item.isHot && (
                        <div className="bg-tva-accent/10 text-tva-accent text-xs py-1 px-2 rounded-full flex items-center gap-1">
                          <Flame size={12} />
                          <span>Hot</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default TendancePage;
