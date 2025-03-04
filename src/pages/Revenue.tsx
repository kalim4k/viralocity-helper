
import React, { useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import { DollarSign, TrendingUp, Users, Eye, Heart, Info } from 'lucide-react';

const RevenuePage = () => {
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = () => {
    if (!tiktokUrl) return;
    
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
          <h1 className="text-2xl font-bold">Simulateur de Revenue</h1>
          <button className="text-xs py-1.5 px-3 rounded-full bg-tva-surface border border-tva-border">
            Mon historique
          </button>
        </div>

        <section className="glass p-4 rounded-xl space-y-4">
          <h2 className="text-lg font-semibold">Analysez un compte TikTok</h2>
          <p className="text-sm text-tva-text/70">
            Entrez le lien d'un compte TikTok pour estimer ses revenus potentiels en fonction des métriques.
          </p>
          <div className="flex space-x-2">
            <input 
              type="text" 
              value={tiktokUrl}
              onChange={(e) => setTiktokUrl(e.target.value)}
              placeholder="https://tiktok.com/@compte" 
              className="flex-1 bg-tva-surface/60 border border-tva-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-tva-primary" 
            />
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !tiktokUrl}
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
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-tva-surface flex items-center justify-center">
                  <span className="text-sm font-medium">@user</span>
                </div>
                <div>
                  <h3 className="font-semibold">Créateur de mode</h3>
                  <p className="text-xs text-tva-text/70">Mode & Style • 245 vidéos</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-tva-surface rounded-lg p-3 text-center">
                  <Users size={18} className="text-tva-primary mx-auto mb-1" />
                  <p className="text-xs text-tva-text/70 mb-1">Abonnés</p>
                  <p className="font-semibold">183.5K</p>
                </div>
                <div className="bg-tva-surface rounded-lg p-3 text-center">
                  <Eye size={18} className="text-tva-primary mx-auto mb-1" />
                  <p className="text-xs text-tva-text/70 mb-1">Vues totales</p>
                  <p className="font-semibold">4.2M</p>
                </div>
                <div className="bg-tva-surface rounded-lg p-3 text-center">
                  <Heart size={18} className="text-tva-primary mx-auto mb-1" />
                  <p className="text-xs text-tva-text/70 mb-1">Likes</p>
                  <p className="font-semibold">720.3K</p>
                </div>
              </div>
            </section>

            <section className="glass p-4 rounded-xl space-y-4">
              <h3 className="text-lg font-semibold">Estimation des revenus</h3>
              
              <div className="relative bg-tva-surface p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Fonds Créateurs TikTok</span>
                  <div className="flex items-center">
                    <DollarSign size={16} className="text-green-400 mr-1" />
                    <span className="font-semibold">$750 - $1,200</span>
                  </div>
                </div>
                <div className="w-full bg-tva-border/30 h-2 rounded-full">
                  <div className="bg-gradient-to-r from-green-400 to-tva-primary h-2 rounded-full w-3/4"></div>
                </div>
                <span className="text-xs text-tva-text/60 mt-1 block">Estimation mensuelle</span>
              </div>
              
              <div className="relative bg-tva-surface p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Partenariats de marque</span>
                  <div className="flex items-center">
                    <DollarSign size={16} className="text-green-400 mr-1" />
                    <span className="font-semibold">$1,500 - $3,000</span>
                  </div>
                </div>
                <div className="w-full bg-tva-border/30 h-2 rounded-full">
                  <div className="bg-gradient-to-r from-green-400 to-tva-primary h-2 rounded-full w-1/2"></div>
                </div>
                <span className="text-xs text-tva-text/60 mt-1 block">Par campagne (3-5 vidéos)</span>
              </div>
              
              <div className="relative bg-tva-surface p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Revenus annuels estimés</span>
                  <div className="flex items-center">
                    <DollarSign size={16} className="text-green-400 mr-1" />
                    <span className="font-semibold">$15,000 - $30,000</span>
                  </div>
                </div>
                <div className="w-full bg-tva-border/30 h-2 rounded-full">
                  <div className="bg-gradient-to-r from-green-400 to-tva-primary h-2 rounded-full w-2/3"></div>
                </div>
                <span className="text-xs text-tva-text/60 mt-1 block">Basé sur la croissance actuelle</span>
              </div>
            </section>
            
            <section className="glass p-4 rounded-xl">
              <div className="flex items-start">
                <div className="bg-tva-primary/10 p-2 rounded-lg mr-3">
                  <Info size={18} className="text-tva-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Conseils d'optimisation</h3>
                  <ul className="text-sm text-tva-text/80 space-y-2">
                    <li className="flex items-center">
                      <TrendingUp size={14} className="text-tva-secondary mr-2" />
                      Augmentez votre fréquence de publication à 5-7 vidéos par semaine
                    </li>
                    <li className="flex items-center">
                      <TrendingUp size={14} className="text-tva-secondary mr-2" />
                      Explorez les collaborations avec d'autres créateurs mode
                    </li>
                    <li className="flex items-center">
                      <TrendingUp size={14} className="text-tva-secondary mr-2" />
                      Votre taux d'engagement est élevé, contactez les marques directement
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default RevenuePage;
