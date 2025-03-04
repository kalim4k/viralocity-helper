
import React, { useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  AlertTriangle,
  Search,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TikTokConnectModal, TikTokProfile } from '@/components/TikTokConnectModal';
import { TikTokProfileCard } from '@/components/TikTokProfileCard';
import { RevenueChart } from '@/components/RevenueChart';
import { RevenueRecommendations } from '@/components/RevenueRecommendations';
import { formatNumber } from '@/utils/formatters';
import { toast } from 'sonner';
import { analyzeRevenueFromUsername, RevenueEstimate } from '@/services/revenueService';

const RevenuePage = () => {
  const [tiktokUsername, setTiktokUsername] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [revenueData, setRevenueData] = useState<RevenueEstimate | null>(null);

  // Analyser un compte TikTok
  const handleAnalyze = async () => {
    if (!tiktokUsername.trim()) {
      toast.error("Veuillez entrer un nom d'utilisateur TikTok");
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const revenue = await analyzeRevenueFromUsername(tiktokUsername);
      setRevenueData(revenue);
      
      if (!revenue.isEligible) {
        toast.warning("Ce compte n'a pas assez d'abonnés pour générer des revenus significatifs.", {
          description: "Minimum requis: 10 000 abonnés",
          duration: 6000
        });
      } else {
        toast.success("Analyse des revenus complétée avec succès !");
      }
    } catch (error) {
      console.error("Erreur lors de l'analyse:", error);
      toast.error("Impossible d'analyser ce compte", {
        description: error instanceof Error ? error.message : "Erreur inconnue"
      });
      setRevenueData(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Ouvrir la modale de connexion
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Traiter le profil une fois connecté
  const handleProfileSuccess = async (profile: TikTokProfile) => {
    setTiktokUsername(profile.username);
    
    // Lancer directement l'analyse après connexion
    setIsAnalyzing(true);
    
    try {
      const revenue = await analyzeRevenueFromUsername(profile.username.replace('@', ''));
      setRevenueData(revenue);
      
      if (!revenue.isEligible) {
        toast.warning("Ce compte n'a pas assez d'abonnés pour générer des revenus significatifs.", {
          description: "Minimum requis: 10 000 abonnés"
        });
      }
    } catch (error) {
      console.error("Erreur après connexion:", error);
      toast.error("Impossible d'analyser ce compte");
      setRevenueData(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Données pour le graphique
  const getChartData = () => {
    if (!revenueData) return [];
    
    return [
      {
        name: 'Par jour',
        min: revenueData.dailyRevenue.min,
        max: revenueData.dailyRevenue.max
      },
      {
        name: 'Par mois',
        min: revenueData.monthlyRevenue.min,
        max: revenueData.monthlyRevenue.max
      },
      {
        name: 'Par campagne',
        min: revenueData.brandDealRevenue.min,
        max: revenueData.brandDealRevenue.max
      },
      {
        name: 'Par an',
        min: revenueData.annualRevenue.min / 12, // Divisé par 12 pour l'échelle
        max: revenueData.annualRevenue.max / 12
      }
    ];
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Simulateur de Revenus</h1>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs py-1.5 px-3 rounded-full bg-tva-surface border border-tva-border"
            onClick={handleOpenModal}
          >
            <Users size={14} className="mr-1" />
            Connecter un compte
          </Button>
        </div>

        <section className="glass p-4 rounded-xl space-y-4">
          <h2 className="text-lg font-semibold">Analysez un compte TikTok</h2>
          <p className="text-sm text-tva-text/70">
            Entrez le nom d'utilisateur d'un compte TikTok pour estimer ses revenus potentiels en fonction des métriques.
          </p>
          <div className="flex space-x-2">
            <Input 
              type="text" 
              value={tiktokUsername}
              onChange={(e) => setTiktokUsername(e.target.value)}
              placeholder="Ex: charlidamelio (sans @)" 
              className="flex-1 bg-tva-surface/60 border border-tva-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-tva-primary text-black" 
            />
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !tiktokUsername.trim()}
              className="bg-tva-primary hover:bg-tva-primary/90 text-white" 
            >
              {isAnalyzing ? (
                <>
                  <span className="animate-pulse mr-2">Analyse...</span>
                </>
              ) : (
                <>
                  <Search size={16} className="mr-1" />
                  Analyser
                </>
              )}
            </Button>
          </div>
        </section>

        {isAnalyzing && (
          <div className="glass p-8 rounded-xl flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-tva-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-tva-text/70">Analyse en cours...</p>
          </div>
        )}

        {revenueData && (
          <div className="space-y-6 animate-slide-up">
            {/* Carte de profil */}
            <TikTokProfileCard profile={revenueData.profile} />

            {/* Statistiques */}
            <section className="glass p-4 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Statistiques du compte</h3>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-tva-surface rounded-lg p-3 text-center">
                  <Users size={18} className="text-tva-primary mx-auto mb-1" />
                  <p className="text-xs text-tva-text/70 mb-1">Abonnés</p>
                  <p className="font-semibold">{formatNumber(revenueData.profile.followers)}</p>
                </div>
                <div className="bg-tva-surface rounded-lg p-3 text-center">
                  <Eye size={18} className="text-tva-primary mx-auto mb-1" />
                  <p className="text-xs text-tva-text/70 mb-1">Vues totales</p>
                  <p className="font-semibold">{formatNumber(revenueData.totalViews)}</p>
                </div>
                <div className="bg-tva-surface rounded-lg p-3 text-center">
                  <Heart size={18} className="text-tva-primary mx-auto mb-1" />
                  <p className="text-xs text-tva-text/70 mb-1">Likes</p>
                  <p className="font-semibold">{formatNumber(revenueData.profile.likes)}</p>
                </div>
              </div>

              {!revenueData.isEligible && (
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center">
                  <AlertTriangle size={18} className="text-amber-500 mr-2 shrink-0" />
                  <p className="text-sm">
                    Ce compte n'a pas atteint le minimum de 10 000 abonnés requis pour le programme de monétisation.
                  </p>
                </div>
              )}
            </section>

            {/* Estimation des revenus */}
            <section className="glass p-4 rounded-xl space-y-4">
              <h3 className="text-lg font-semibold">Estimation des revenus</h3>
              
              <div className="mb-4">
                <RevenueChart data={getChartData()} />
              </div>
              
              <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                <div className="relative bg-tva-surface p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Revenus mensuels</span>
                    <div className="flex items-center">
                      <DollarSign size={16} className="text-green-400 mr-1" />
                      <span className="font-semibold">
                        {revenueData.monthlyRevenue.min}€ - {revenueData.monthlyRevenue.max}€
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-tva-border/30 h-2 rounded-full">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-tva-primary h-2 rounded-full" 
                      style={{ width: revenueData.isEligible ? '75%' : '10%' }}
                    ></div>
                  </div>
                  <span className="text-xs text-tva-text/60 mt-1 block">
                    Basé sur {formatNumber(revenueData.averageViewsPerVideo)} vues par vidéo
                  </span>
                </div>
                
                <div className="relative bg-tva-surface p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Partenariats de marque</span>
                    <div className="flex items-center">
                      <DollarSign size={16} className="text-green-400 mr-1" />
                      <span className="font-semibold">
                        {revenueData.brandDealRevenue.min}€ - {revenueData.brandDealRevenue.max}€
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-tva-border/30 h-2 rounded-full">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-tva-primary h-2 rounded-full" 
                      style={{ width: revenueData.isEligible ? '50%' : '5%' }}
                    ></div>
                  </div>
                  <span className="text-xs text-tva-text/60 mt-1 block">
                    Par campagne (estimation par collaboration)
                  </span>
                </div>
              </div>
              
              <div className="relative bg-tva-surface p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Revenus annuels estimés</span>
                  <div className="flex items-center">
                    <DollarSign size={16} className="text-green-400 mr-1" />
                    <span className="font-semibold">
                      {revenueData.annualRevenue.min}€ - {revenueData.annualRevenue.max}€
                    </span>
                  </div>
                </div>
                <div className="w-full bg-tva-border/30 h-2 rounded-full">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-tva-primary h-2 rounded-full" 
                    style={{ width: revenueData.isEligible ? '66%' : '8%' }}
                  ></div>
                </div>
                <span className="text-xs text-tva-text/60 mt-1 block">
                  Inclut les revenus de contenu et {revenueData.isEligible ? '4-6' : '0'} partenariats par an
                </span>
              </div>
            </section>
            
            {/* Recommandations */}
            <RevenueRecommendations 
              recommendations={revenueData.recommendations}
              isEligible={revenueData.isEligible}
            />
            
            {/* Appel à l'action */}
            <div className="glass p-4 rounded-xl text-center">
              <p className="text-sm mb-3">
                Vous souhaitez optimiser votre stratégie TikTok et augmenter vos revenus ?
              </p>
              <Button className="bg-gradient-to-r from-tva-primary to-tva-secondary text-white">
                <span>Générer du contenu optimisé</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Modale de connexion */}
      <TikTokConnectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleProfileSuccess}
      />
    </AppLayout>
  );
};

export default RevenuePage;
