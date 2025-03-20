
import React, { useState, useEffect, useRef } from 'react';
import { AppLayout } from '../components/AppLayout';
import { fetchTikTokProfile } from '@/services/tiktokService';
import { TikTokProfile } from '@/types/tiktok.types';
import { TikTokProfileCard } from '@/components/TikTokProfileCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Search, Zap, ChevronRight, Users, Shield, Rocket } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

// Types pour notre simulation de boost
interface BoostState {
  isAnalyzing: boolean;
  isHacking: boolean;
  isComplete: boolean;
  progress: number;
  targetFollowers: number;
  messages: string[];
  donorProfile: TikTokProfile | null;
}

// Initialisation des états
const initialBoostState: BoostState = {
  isAnalyzing: false,
  isHacking: false,
  isComplete: false,
  progress: 0,
  targetFollowers: 5000,
  messages: [],
  donorProfile: null
};

// Messages de hacking pour l'animation
const hackingMessages = [
  "Initialisation du processus de boost...",
  "Analyse des algorithmes TikTok...",
  "Extraction de la structure de recommandation...",
  "Contournement des mesures de sécurité...",
  "Injection des données d'engagement...",
  "Recalibrage des métriques de popularité...",
  "Optimisation des KPIs de votre profil...",
  "Mise à jour forcée du nombre d'abonnés...",
  "Synchronisation avec les serveurs TikTok...",
  "Effacement des traces d'opération...",
  "Finalisation du boost..."
];

const BoostPage = () => {
  const [username, setUsername] = useState('');
  const [donorUsername, setDonorUsername] = useState('');
  const [profile, setProfile] = useState<TikTokProfile | null>(null);
  const [boostState, setBoostState] = useState<BoostState>(initialBoostState);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Fonction pour rechercher un profil TikTok
  const handleSearch = async () => {
    if (!username.trim()) {
      toast.error("Veuillez entrer un nom d'utilisateur TikTok");
      return;
    }
    
    try {
      setBoostState(prev => ({ ...prev, isAnalyzing: true }));
      const profileData = await fetchTikTokProfile(username.replace('@', ''));
      setProfile(profileData);
      toast.success("Profil TikTok trouvé !");
      setBoostState(prev => ({ ...prev, isAnalyzing: false }));
    } catch (error) {
      console.error("Erreur lors de la recherche du profil:", error);
      toast.error("Impossible de trouver ce compte TikTok");
      setBoostState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  // Fonction pour rechercher un profil donneur
  const handleDonorSearch = async () => {
    if (!donorUsername.trim()) {
      toast.error("Veuillez entrer un nom d'utilisateur TikTok donneur");
      return;
    }
    
    try {
      const donorProfileData = await fetchTikTokProfile(donorUsername.replace('@', ''));
      setBoostState(prev => ({ 
        ...prev, 
        donorProfile: donorProfileData
      }));
      toast.success("Profil donneur trouvé !");
    } catch (error) {
      console.error("Erreur lors de la recherche du profil donneur:", error);
      toast.error("Impossible de trouver ce compte donneur");
    }
  };

  // Fonction pour lancer le boost
  const handleStartBoost = () => {
    if (!profile) return;
    
    // Vérifier si un profil donneur est sélectionné
    if (!boostState.donorProfile) {
      toast.error("Veuillez sélectionner un profil donneur");
      return;
    }
    
    setBoostState(prev => ({ 
      ...prev, 
      isHacking: true,
      progress: 0,
      messages: [],
      isComplete: false
    }));
    
    // Lancer la séquence d'animation
    simulateHacking();
  };

  // Simuler le processus de hacking
  const simulateHacking = () => {
    let progress = 0;
    const messageInterval = 2500; // 2.5 secondes entre chaque message
    const duration = 30000; // 30 secondes au total
    const progressStep = 100 / (duration / 100); // Incrément de progression toutes les 100ms
    
    // Ajouter des messages d'avancement progressivement
    const messageTimer = setInterval(() => {
      const nextMessageIndex = Math.floor(Math.random() * hackingMessages.length);
      setBoostState(prev => ({
        ...prev,
        messages: [...prev.messages, hackingMessages[nextMessageIndex]]
      }));
      
      // Scroller vers le bas du terminal
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, messageInterval);
    
    // Mettre à jour la progression
    const progressTimer = setInterval(() => {
      progress += progressStep;
      setBoostState(prev => ({
        ...prev,
        progress: Math.min(progress, 100)
      }));
      
      // Lorsque la progression est terminée
      if (progress >= 100) {
        clearInterval(progressTimer);
        clearInterval(messageTimer);
        
        // Marquer comme terminé
        setTimeout(() => {
          setBoostState(prev => ({
            ...prev,
            isHacking: false,
            isComplete: true
          }));
          
          // Afficher le message de réussite
          toast.success("Boost terminé avec succès !");
        }, 1000);
      }
    }, 100);
  };

  // Obtenir le profil "boosté" à afficher
  const getBoostedProfile = () => {
    if (!profile || !boostState.isComplete) return null;
    
    // Créer une copie profonde du profil avec les abonnés augmentés
    const boostedProfile = JSON.parse(JSON.stringify(profile));
    boostedProfile.followers += boostState.targetFollowers;
    
    return boostedProfile;
  };

  // Générer des caractères aléatoires pour l'effet matrix
  const generateMatrixChars = () => {
    const chars = "10";
    return Array.from({ length: 50 }, (_, i) => ({
      char: chars[Math.floor(Math.random() * chars.length)],
      delay: i
    }));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center">
            <Zap className="text-tva-accent mr-2" />
            Boost d'Abonnés <span className="text-xs font-normal ml-2 text-tva-accent">(Simulation)</span>
          </h1>
          <div className="badge">
            <Shield size={14} className="mr-1" />
            Réservé aux licences actives
          </div>
        </div>

        {/* SECTION RECHERCHE */}
        <section className="glass p-5 rounded-xl space-y-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Search size={18} className="mr-2 text-tva-primary" />
            Sélectionner un compte à booster
          </h2>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nom d'utilisateur TikTok (sans @)"
                className="flex-1 bg-tva-surface/60 border border-tva-border"
              />
              <Button
                onClick={handleSearch}
                disabled={boostState.isAnalyzing || !username.trim()}
                className="bg-tva-primary hover:bg-tva-primary/90 text-white"
              >
                {boostState.isAnalyzing ? (
                  <span className="animate-pulse">Recherche...</span>
                ) : (
                  <>Rechercher</>
                )}
              </Button>
            </div>
            
            {profile && (
              <div className="animate-fade-in">
                <TikTokProfileCard profile={profile} />
              </div>
            )}
          </div>
        </section>

        {/* CONFIGURATION DU BOOST */}
        {profile && !boostState.isHacking && !boostState.isComplete && (
          <section className="glass p-5 rounded-xl space-y-4 animate-slide-up">
            <h2 className="text-lg font-semibold flex items-center">
              <Rocket size={18} className="mr-2 text-tva-secondary" />
              Configuration du boost
            </h2>
            
            <div className="space-y-6">
              {/* Slider pour le nombre d'abonnés */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Nombre d'abonnés à ajouter</label>
                  <span className="text-sm font-semibold text-tva-primary">
                    {boostState.targetFollowers.toLocaleString()} abonnés
                  </span>
                </div>
                <Slider 
                  value={[boostState.targetFollowers]} 
                  min={1000} 
                  max={100000} 
                  step={1000}
                  onValueChange={(values) => setBoostState(prev => ({ ...prev, targetFollowers: values[0] }))}
                />
                <div className="flex justify-between text-xs text-tva-text/70">
                  <span>1K</span>
                  <span>25K</span>
                  <span>50K</span>
                  <span>75K</span>
                  <span>100K</span>
                </div>
              </div>
              
              {/* Compte donneur */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Compte donneur (compte populaire)</label>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={donorUsername}
                    onChange={(e) => setDonorUsername(e.target.value)}
                    placeholder="Ex: charlidamelio (sans @)"
                    className="flex-1 bg-tva-surface/60 border border-tva-border"
                  />
                  <Button 
                    onClick={handleDonorSearch}
                    disabled={!donorUsername.trim()}
                    variant="outline"
                  >
                    Vérifier
                  </Button>
                </div>
                {boostState.donorProfile && (
                  <div className="p-2 bg-tva-surface/40 rounded-lg flex items-center">
                    <img 
                      src={boostState.donorProfile.avatar} 
                      alt={boostState.donorProfile.nickname}
                      className="w-8 h-8 rounded-full object-cover mr-2" 
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{boostState.donorProfile.nickname}</p>
                      <p className="text-xs text-tva-text/70">{boostState.donorProfile.username}</p>
                    </div>
                    <Users size={14} className="text-tva-primary mr-1" />
                    <span className="text-xs font-semibold">{boostState.donorProfile.followers.toLocaleString()}</span>
                  </div>
                )}
                
                <p className="text-xs text-tva-accent/70 italic">
                  <Shield size={12} className="inline mr-1" />
                  Le compte donneur est utilisé uniquement pour la simulation et n'est pas affecté.
                </p>
              </div>
              
              {/* Bouton de lancement */}
              <Button 
                className="w-full bg-gradient-to-r from-tva-accent to-tva-primary text-white font-semibold py-3"
                disabled={!boostState.donorProfile}
                onClick={handleStartBoost}
              >
                LANCER LE BOOST
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </section>
        )}

        {/* SECTION HACKING */}
        {boostState.isHacking && (
          <section className="glass p-5 rounded-xl space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold flex items-center text-glitch">
              <Zap size={18} className="mr-2 text-tva-accent animate-pulse" />
              Boost en cours...
            </h2>
            
            <Progress value={boostState.progress} className="h-1 bg-tva-surface" />
            
            <div 
              ref={terminalRef}
              className="bg-black/90 rounded-md h-60 overflow-y-auto p-4 font-mono text-sm"
            >
              <div className="text-tva-primary mb-2">$ initialisation_boost.sh --target={username} --count={boostState.targetFollowers}</div>
              
              {boostState.messages.map((message, index) => (
                <div key={index} className="mb-1 flex">
                  <span className="text-green-400 mr-2">&gt;</span>
                  <span className="terminal-text">{message}</span>
                </div>
              ))}
              
              <div className="flex flex-wrap h-20 overflow-hidden">
                {generateMatrixChars().map((item, index) => (
                  <span 
                    key={index} 
                    className="matrix-char"
                    style={{ '--i': item.delay } as React.CSSProperties}
                  >
                    {item.char}
                  </span>
                ))}
              </div>
            </div>
            
            <p className="text-center text-xs text-tva-text/70 animate-pulse">
              Ne fermez pas cette page pendant le processus de boost
            </p>
          </section>
        )}

        {/* RÉSULTAT */}
        {boostState.isComplete && (
          <section className="glass p-5 rounded-xl space-y-6 animate-scale-in border-2 border-tva-accent">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-tva-accent/20 mb-2">
                <Rocket size={24} className="text-tva-accent" />
              </div>
              <h2 className="text-xl font-bold">Boost Terminé avec Succès!</h2>
              <p className="text-sm text-tva-text/70">
                Votre compte a été boosté avec {boostState.targetFollowers.toLocaleString()} nouveaux abonnés
              </p>
            </div>
            
            {getBoostedProfile() && (
              <div className="border border-tva-border rounded-xl p-4">
                <TikTokProfileCard profile={getBoostedProfile()!} />
                
                <div className="mt-4 p-3 bg-tva-surface/40 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Avant</span>
                    <span className="font-semibold">{profile!.followers.toLocaleString()} abonnés</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Après</span>
                    <span className="font-semibold text-tva-accent">{getBoostedProfile()!.followers.toLocaleString()} abonnés</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="text-center space-y-2">
              <p className="text-xs text-tva-accent/80 italic">
                <Shield size={12} className="inline mr-1" />
                Ceci est une simulation. Aucun compte n'a été réellement modifié.
              </p>
              
              <Button 
                className="bg-tva-primary text-white"
                onClick={() => {
                  setBoostState(initialBoostState);
                  setProfile(null);
                  setUsername('');
                  setDonorUsername('');
                }}
              >
                Recommencer
              </Button>
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  );
};

export default BoostPage;
