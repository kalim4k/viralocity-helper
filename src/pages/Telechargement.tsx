
import React from 'react';
import { AppLayout } from '../components/AppLayout';
import { Download, FileText, CheckCircle2, Bookmark } from 'lucide-react';

const TelechargementPage = () => {
  const resources = [
    {
      title: "Guide complet: Devenir viral sur TikTok en 2023",
      description: "Un guide PDF de 50 pages avec toutes les stratégies pour optimiser votre croissance sur TikTok.",
      type: "PDF",
      size: "12.5 MB",
      popular: true,
      icon: FileText
    },
    {
      title: "Templates de scripts pour vidéos TikTok",
      description: "10 templates de scripts pour différents formats de vidéos qui génèrent de l'engagement.",
      type: "ZIP",
      size: "8.2 MB",
      popular: false,
      icon: FileText
    },
    {
      title: "Liste de 500+ hashtags par niche",
      description: "Base de données de hashtags organisés par niche et par popularité pour maximiser votre portée.",
      type: "CSV",
      size: "1.8 MB",
      popular: true,
      icon: Bookmark
    },
    {
      title: "Pack de transitions pour vidéos TikTok",
      description: "Fichiers de projet avec 20 transitions faciles à utiliser dans vos montages vidéo.",
      type: "ZIP",
      size: "45.6 MB",
      popular: false,
      icon: Download
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Téléchargements</h1>
        
        <p className="text-tva-text/70 text-sm">
          Accédez à nos ressources gratuites pour booster votre stratégie TikTok et améliorer vos contenus.
        </p>

        <div className="space-y-4">
          {resources.map((resource, index) => (
            <div key={index} className="glass p-4 rounded-xl hover-card cursor-pointer">
              <div className="flex items-start">
                <div className="bg-tva-surface p-3 rounded-lg mr-3">
                  <resource.icon size={20} className="text-tva-primary" />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">{resource.title}</h3>
                    {resource.popular && (
                      <span className="text-xs py-0.5 px-2 bg-tva-primary/20 text-tva-primary rounded-full">
                        Populaire
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-tva-text/70 mb-3">
                    {resource.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3 text-xs text-tva-text/60">
                      <span>{resource.type}</span>
                      <span>{resource.size}</span>
                    </div>
                    
                    <button className="flex items-center space-x-1.5 py-1.5 px-3 bg-tva-primary/10 hover:bg-tva-primary/20 text-tva-primary rounded-lg text-xs font-medium transition-all">
                      <Download size={14} />
                      <span>Télécharger</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <section className="glass p-5 rounded-xl mt-6">
          <div className="flex items-start">
            <div className="bg-tva-secondary/20 p-2 rounded-lg mr-4">
              <CheckCircle2 size={20} className="text-tva-secondary" />
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Obtenez plus de ressources premium</h3>
              <p className="text-sm text-tva-text/70 mb-3">
                Débloquez l'accès à notre bibliothèque complète de ressources exclusives en passant à un forfait premium.
              </p>
              
              <button className="w-full py-2.5 bg-gradient-to-r from-tva-primary to-tva-secondary text-white font-medium rounded-lg hover:opacity-90 transition-all">
                Passer à la version Premium
              </button>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default TelechargementPage;
