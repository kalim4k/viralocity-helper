
import React, { useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import { Search, BarChart3, RefreshCw, Heart, MessageSquare, ChevronRight, ExternalLink } from 'lucide-react';

const AnalysePage = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = () => {
    if (!videoUrl) return;
    
    setIsAnalyzing(true);
    
    // Simuler une analyse
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Analyser</h1>
          <button className="text-xs py-1.5 px-3 rounded-full bg-tva-surface border border-tva-border">
            Mon historique
          </button>
        </div>

        <div className="flex space-x-2">
          <button className="flex-1 py-2 bg-tva-primary text-white rounded-lg text-sm font-medium">
            Analyser une vidéo
          </button>
          <button className="flex-1 py-2 bg-tva-surface text-tva-text rounded-lg text-sm font-medium">
            Analyser un compte
          </button>
        </div>

        <section className="glass p-4 rounded-xl space-y-4">
          <h2 className="text-lg font-semibold">Analysez une vidéo TikTok</h2>
          <p className="text-sm text-tva-text/70">
            Entrez le lien d'une vidéo TikTok pour l'analyser et obtenir des conseils d'amélioration.
          </p>
          <div className="flex space-x-2">
            <input 
              type="text" 
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://tiktok.com/@compte/video/123456" 
              className="flex-1 bg-tva-surface/60 border border-tva-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-tva-primary" 
            />
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !videoUrl}
              className={`${
                isAnalyzing ? 'bg-tva-primary/70' : 'bg-tva-primary hover:bg-tva-primary/90'
              } text-white py-2 px-4 rounded-lg text-sm font-medium transition-all`}
            >
              {isAnalyzing ? 'Analyse...' : 'Analyser'}
            </button>
          </div>
        </section>

        {isAnalyzing && (
          <div className="glass p-8 rounded-xl flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-tva-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-tva-text/70">Analyse en cours...</p>
          </div>
        )}

        {showResults && (
          <div className="space-y-6 animate-slide-up">
            <section className="glass p-4 rounded-xl">
              <div className="relative rounded-lg overflow-hidden mb-4">
                <div className="aspect-[9/16] bg-tva-surface flex items-center justify-center">
                  <ExternalLink size={24} className="text-tva-text/40" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <h3 className="text-white font-medium text-sm">Comment j'ai gagné 10K abonnés avec cette astuce</h3>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="bg-tva-surface rounded-lg p-2 text-center">
                  <p className="text-xs text-tva-text/70 mb-1">Vues</p>
                  <p className="font-semibold">183.5K</p>
                </div>
                <div className="bg-tva-surface rounded-lg p-2 text-center">
                  <p className="text-xs text-tva-text/70 mb-1">Likes</p>
                  <p className="font-semibold">24.2K</p>
                </div>
                <div className="bg-tva-surface rounded-lg p-2 text-center">
                  <p className="text-xs text-tva-text/70 mb-1">Commentaires</p>
                  <p className="font-semibold">432</p>
                </div>
                <div className="bg-tva-surface rounded-lg p-2 text-center">
                  <p className="text-xs text-tva-text/70 mb-1">Partages</p>
                  <p className="font-semibold">1.8K</p>
                </div>
              </div>
            </section>
            
            <section className="glass p-4 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Performance de la vidéo</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Engagement</span>
                    <span className="text-sm font-medium text-tva-secondary">Excellent</span>
                  </div>
                  <div className="w-full bg-tva-border/30 h-2 rounded-full">
                    <div className="bg-gradient-to-r from-tva-primary to-tva-secondary h-2 rounded-full w-[85%]"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Taux de complétion</span>
                    <span className="text-sm font-medium text-yellow-400">Moyen</span>
                  </div>
                  <div className="w-full bg-tva-border/30 h-2 rounded-full">
                    <div className="bg-gradient-to-r from-tva-primary to-yellow-400 h-2 rounded-full w-[45%]"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Hook (5s)</span>
                    <span className="text-sm font-medium text-tva-accent">À améliorer</span>
                  </div>
                  <div className="w-full bg-tva-border/30 h-2 rounded-full">
                    <div className="bg-gradient-to-r from-tva-accent to-red-400 h-2 rounded-full w-[30%]"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Score de viralité</span>
                    <span className="text-sm font-medium text-tva-primary">72/100</span>
                  </div>
                  <div className="w-full bg-tva-border/30 h-2 rounded-full">
                    <div className="bg-gradient-to-r from-tva-primary to-tva-secondary h-2 rounded-full w-[72%]"></div>
                  </div>
                </div>
              </div>
            </section>
            
            <section className="glass p-4 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Recommandations</h3>
              
              <div className="space-y-3">
                <div className="bg-tva-surface p-3 rounded-lg">
                  <div className="flex items-start">
                    <div className="bg-tva-accent/20 p-1.5 rounded-lg mr-3">
                      <RefreshCw size={16} className="text-tva-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Améliorer votre hook</h4>
                      <p className="text-xs text-tva-text/70">Les 5 premières secondes sont cruciales. Commencez par une question provocante ou un fait surprenant pour capter l'attention immédiatement.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-tva-surface p-3 rounded-lg">
                  <div className="flex items-start">
                    <div className="bg-yellow-400/20 p-1.5 rounded-lg mr-3">
                      <Heart size={16} className="text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Stimuler l'engagement</h4>
                      <p className="text-xs text-tva-text/70">Ajoutez un appel à l'action clair à la fin de votre vidéo pour inciter aux commentaires et partages.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-tva-surface p-3 rounded-lg">
                  <div className="flex items-start">
                    <div className="bg-tva-secondary/20 p-1.5 rounded-lg mr-3">
                      <MessageSquare size={16} className="text-tva-secondary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Optimiser vos hashtags</h4>
                      <p className="text-xs text-tva-text/70">Utilisez des hashtags plus spécifiques à votre niche pour atteindre une audience plus ciblée et engagée.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-4 py-2.5 text-sm font-medium text-center text-tva-primary flex items-center justify-center">
                <span>Voir l'analyse complète</span>
                <ChevronRight size={16} className="ml-1" />
              </button>
            </section>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AnalysePage;
