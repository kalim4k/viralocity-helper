
import React from 'react';
import { AppLayout } from '../components/AppLayout';
import { Download, FileText, CheckCircle2, Bookmark, ExternalLink, Video, Scissors } from 'lucide-react';
import { toast } from 'sonner';

const TelechargementPage = () => {
  const telegramLink = "https://t.me/+2UZnkFcmwJdjYTg0";
  
  const resources = [
    {
      title: "Formation sur comment créer un compte PayPal vérifié et fonctionnel en Afrique",
      description: "Guide complet pour créer et vérifier un compte PayPal qui fonctionne partout en Afrique.",
      type: "PDF",
      size: "12.5 MB",
      popular: true,
      icon: FileText
    },
    {
      title: "Formation comment créer un compte TikTok monétisé et gagner 10000 abonnés en 30 jours",
      description: "Méthodes éprouvées pour développer rapidement votre audience TikTok et activer la monétisation.",
      type: "PDF",
      size: "18.7 MB",
      popular: true,
      icon: FileText
    },
    {
      title: "CapCut Pro",
      description: "Version premium du logiciel de montage vidéo préféré des créateurs TikTok.",
      type: "APP",
      size: "45.6 MB",
      popular: false,
      icon: Download
    },
    {
      title: "Canva Pro",
      description: "Accès à la version premium de Canva pour créer des miniatures et graphiques professionnels.",
      type: "APP",
      size: "32.1 MB",
      popular: true,
      icon: Download
    },
    {
      title: "Modèles de vidéos TikTok virales",
      description: "Collection de templates pour reproduire les formats de vidéos qui cartonnent sur TikTok.",
      type: "ZIP",
      size: "78.3 MB",
      popular: true,
      icon: Video
    },
    {
      title: "1000 clips de hooks et transitions pour TikTok",
      description: "Pack complet d'éléments visuels pour rendre vos vidéos plus dynamiques et professionnelles.",
      type: "ZIP",
      size: "156.8 MB",
      popular: false,
      icon: Scissors
    }
  ];

  const handleDownload = (resourceTitle) => {
    window.open(telegramLink, '_blank');
    toast.success(`Redirection vers le canal Telegram pour télécharger "${resourceTitle}"`);
  };

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
                    
                    <button 
                      onClick={() => handleDownload(resource.title)}
                      className="flex items-center space-x-1.5 py-1.5 px-3 bg-tva-primary/10 hover:bg-tva-primary/20 text-tva-primary rounded-lg text-xs font-medium transition-all"
                    >
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
              <ExternalLink size={20} className="text-tva-secondary" />
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Rejoignez notre canal Telegram</h3>
              <p className="text-sm text-tva-text/70 mb-3">
                Tous nos téléchargements sont disponibles via notre canal Telegram. Rejoignez-nous pour accéder à encore plus de ressources exclusives gratuitement.
              </p>
              
              <a 
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-gradient-to-r from-tva-primary to-tva-secondary text-white font-medium rounded-lg hover:opacity-90 transition-all flex items-center justify-center"
              >
                <ExternalLink size={16} className="mr-2" />
                Accéder au canal Telegram
              </a>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default TelechargementPage;
