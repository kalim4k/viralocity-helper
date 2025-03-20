
import React, { useState, useEffect } from 'react';
import { TikTokProfile } from '@/types/tiktok.types';
import { Zap, Shield, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { formatNumber } from '@/utils/formatters';

interface BoostAnimationProps {
  profile: TikTokProfile;
  targetFollowers: number;
  donorAccount: string;
}

export const BoostAnimation: React.FC<BoostAnimationProps> = ({
  profile,
  targetFollowers,
  donorAccount
}) => {
  const [progress, setProgress] = useState(0);
  const [followerCount, setFollowerCount] = useState(profile.followers);
  const [consoleMessages, setConsoleMessages] = useState<string[]>([]);
  const [showServerMessages, setShowServerMessages] = useState(false);
  const [showDonorMessages, setShowDonorMessages] = useState(false);
  const [showFollowerMessages, setShowFollowerMessages] = useState(false);

  // Séquences de messages pour l'animation de console
  const serverInitMessages = [
    "Initialisation du serveur de boost...",
    "Connexion à l'API TikTok...",
    "Authentification réussie...",
    "Préparation des modules d'expansion réseau...",
    "Configuration des paramètres boost optimisés..."
  ];

  const donorMessages = [
    `Analyse du compte donneur: @${donorAccount}...`,
    "Vérification du taux d'engagement...",
    "Analyse des métriques d'audience...",
    "Cartographie des réseaux d'abonnés...",
    "Préparation des vecteurs de redirection..."
  ];

  const followerMessages = [
    `Préparation du transfert d'abonnés vers @${profile.username}...`,
    "Initialisation des protocoles de routage d'utilisateurs...",
    "Optimisation des algorithmes de recommandation...",
    "Bypassing des restrictions de rate limit...",
    `Redirection de ${formatNumber(targetFollowers - profile.followers)} abonnés en cours...`,
    "Finalisation du processus de boost..."
  ];

  // Effet pour gérer la progression et l'animation
  useEffect(() => {
    // Animer la barre de progression
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const next = prev + (100 / 30); // 100% en 30 secondes
        return next > 100 ? 100 : next;
      });
    }, 1000);

    // Animer l'augmentation du nombre d'abonnés
    const followersInterval = setInterval(() => {
      setFollowerCount(prev => {
        const increment = Math.ceil((targetFollowers - profile.followers) / 30);
        const next = prev + increment;
        return next > targetFollowers ? targetFollowers : next;
      });
    }, 1000);

    // Gérer l'affichage des messages de console
    setTimeout(() => {
      showSequentialMessages(serverInitMessages, setConsoleMessages, 400);
    }, 1000);

    setTimeout(() => {
      setShowServerMessages(true);
    }, 3000);

    setTimeout(() => {
      showSequentialMessages(donorMessages, setConsoleMessages, 500);
    }, 5000);

    setTimeout(() => {
      setShowDonorMessages(true);
    }, 8000);

    setTimeout(() => {
      showSequentialMessages(followerMessages, setConsoleMessages, 600);
    }, 12000);

    setTimeout(() => {
      setShowFollowerMessages(true);
    }, 15000);

    // Nettoyer les intervalles à la fin
    return () => {
      clearInterval(progressInterval);
      clearInterval(followersInterval);
    };
  }, [profile.followers, targetFollowers, donorAccount, profile.username, serverInitMessages, donorMessages, followerMessages]);

  // Fonction pour afficher les messages séquentiellement
  const showSequentialMessages = (
    messages: string[],
    setMessagesFn: React.Dispatch<React.SetStateAction<string[]>>,
    delay: number
  ) => {
    messages.forEach((msg, index) => {
      setTimeout(() => {
        setMessagesFn(prev => [...prev, msg]);
      }, index * delay);
    });
  };

  return (
    <div className="glass p-6 rounded-xl space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Zap size={20} className="text-yellow-400 animate-pulse" />
          Boost en cours
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <Shield size={16} className="text-green-400" />
          <span>Sécurisé</span>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progression du boost</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2 bg-tva-surface" />
      </div>

      {/* Console de hack */}
      <div className="bg-black/80 border border-tva-primary/40 rounded-lg p-3 h-60 overflow-y-auto font-mono text-xs text-green-400">
        {consoleMessages.map((msg, index) => (
          <div key={index} className="mb-1 flex">
            <span className="text-tva-primary mr-2">&gt;</span>
            <span className={index === consoleMessages.length - 1 ? "animate-typing" : ""}>
              {msg}
            </span>
          </div>
        ))}
      </div>

      {/* Statistiques en direct */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass p-3 rounded-lg text-center">
          <div className="w-8 h-8 mx-auto flex items-center justify-center rounded-full bg-tva-surface mb-2">
            <Users size={16} className="text-tva-primary" />
          </div>
          <p className="text-xs text-tva-text/70">Abonnés actuels</p>
          <p className="text-xl font-bold">{formatNumber(followerCount)}</p>
        </div>

        <div className={`glass p-3 rounded-lg text-center ${showServerMessages ? "animate-scale-in" : "opacity-50"}`}>
          <div className="w-8 h-8 mx-auto flex items-center justify-center rounded-full bg-tva-surface mb-2">
            <Shield size={16} className="text-tva-primary" />
          </div>
          <p className="text-xs text-tva-text/70">Serveurs actifs</p>
          <p className="text-xl font-bold">{showServerMessages ? "5/5" : "..."}</p>
        </div>

        <div className={`glass p-3 rounded-lg text-center ${showDonorMessages ? "animate-scale-in" : "opacity-50"}`}>
          <div className="w-8 h-8 mx-auto flex items-center justify-center rounded-full bg-tva-surface mb-2">
            <Zap size={16} className="text-tva-primary" />
          </div>
          <p className="text-xs text-tva-text/70">Taux de transfert</p>
          <p className="text-xl font-bold">{showFollowerMessages ? "98%" : (showDonorMessages ? "En cours" : "...")}</p>
        </div>
      </div>

      <p className="text-xs text-center text-tva-text/50 animate-pulse">
        Ne fermez pas cette page pendant le processus de boost
      </p>
    </div>
  );
};
