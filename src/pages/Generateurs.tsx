import React, { useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import { Sparkles, MessageSquare, Hash, FileText, Video, ChevronRight } from 'lucide-react';

const GenerateursPage = () => {
  const [activeTab, setActiveTab] = useState<string>('ideas');

  const tabs = [
    { id: 'ideas', label: 'Idées', icon: Sparkles },
    { id: 'scripts', label: 'Scripts', icon: FileText },
    { id: 'hooks', label: 'Hooks', icon: Video },
    { id: 'hashtags', label: 'Hashtags', icon: Hash }
  ];

  // Exemples d'idées de vidéos générées
  const videoIdeas = [
    {
      title: "Comment j'ai gagné 10K abonnés en 1 semaine",
      type: "Growth",
      viralScore: 92,
      trend: "En hausse",
      views: "500K-1M"
    },
    {
      title: "3 transitions faciles pour débutants",
      type: "Tutorial",
      viralScore: 87,
      trend: "Stable",
      views: "200K-500K"
    },
    {
      title: "Ce que personne ne dit sur les revenus TikTok",
      type: "Informative",
      viralScore: 95,
      trend: "Trending",
      views: "1M+"
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Générateurs</h1>
          <button className="text-xs py-1.5 px-3 rounded-full bg-tva-surface border border-tva-border">
            Mon historique
          </button>
        </div>

        {/* Tabs navigation */}
        <div className="glass rounded-xl p-1 flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1.5 flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-tva-primary text-white'
                  : 'text-tva-text/70 hover:text-tva-text hover:bg-tva-surface'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content area */}
        {activeTab === 'ideas' && (
          <>
            <section className="glass p-4 rounded-xl space-y-4">
              <h2 className="text-lg font-semibold">Analysez votre compte</h2>
              <p className="text-sm text-tva-text/70">
                Nous analyserons votre profil pour générer des idées de vidéos personnalisées en fonction de votre niche et des tendances actuelles.
              </p>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="@votrepseudo" 
                  className="flex-1 bg-tva-surface/60 border border-tva-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-tva-primary" 
                />
                <button className="bg-tva-primary hover:bg-tva-primary/90 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all">
                  Analyser
                </button>
              </div>
            </section>

            <h3 className="text-lg font-semibold mt-6 mb-3">Idées recommandées</h3>
            
            <div className="space-y-3">
              {videoIdeas.map((idea, index) => (
                <div key={index} className="glass p-4 rounded-xl hover-card cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="badge">{idea.type}</span>
                    <div className="flex items-center space-x-1">
                      <Sparkles size={14} className="text-yellow-400" />
                      <span className="text-xs font-semibold">{idea.viralScore}%</span>
                    </div>
                  </div>
                  
                  <h4 className="font-medium mb-2">{idea.title}</h4>
                  
                  <div className="flex justify-between items-center text-xs text-tva-text/70">
                    <div className="flex items-center space-x-3">
                      <span>Trend: {idea.trend}</span>
                      <span>~{idea.views} vues</span>
                    </div>
                    <button className="flex items-center text-tva-primary hover:text-tva-primary/80">
                      <span className="mr-1">Choisir</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-3 mt-4 text-sm font-medium text-tva-primary bg-tva-primary/10 rounded-xl hover:bg-tva-primary/20 transition-all">
              Voir plus d'idées
            </button>
          </>
        )}

        {activeTab === 'scripts' && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <MessageSquare size={40} className="text-tva-text/20 mb-4" />
            <h3 className="text-lg font-medium mb-2">Choisissez d'abord une idée de vidéo</h3>
            <p className="text-sm text-tva-text/60 max-w-xs">
              Sélectionnez une idée de vidéo dans l'onglet "Idées" pour générer un script adapté.
            </p>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
      </div>
    </AppLayout>
  );
};

export default GenerateursPage;
