
import React, { useState, useEffect, useRef } from 'react';
import { AppLayout } from '../components/AppLayout';
import { BoostForm } from '../components/boost/BoostForm';
import { BoostAnimation } from '../components/boost/BoostAnimation';
import { BoostResult } from '../components/boost/BoostResult';
import { TikTokProfile } from '@/types/tiktok.types';
import { toast } from 'sonner';
import { fetchTikTokProfile } from '@/services/tiktokService';

enum BoostStage {
  FORM = 'form',
  BOOSTING = 'boosting',
  RESULT = 'result'
}

const BoostPage = () => {
  const [stage, setStage] = useState<BoostStage>(BoostStage.FORM);
  const [profile, setProfile] = useState<TikTokProfile | null>(null);
  const [targetFollowers, setTargetFollowers] = useState<number>(0);
  const [donorAccount, setDonorAccount] = useState<string>('');
  const [boostedProfile, setBoostedProfile] = useState<TikTokProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Référence pour stocker le minuteur d'animation
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Nettoyer le timer lors du démontage du composant
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleProfileFetch = async (username: string) => {
    if (!username.trim()) {
      toast.error("Veuillez entrer un nom d'utilisateur TikTok");
      return;
    }

    setIsLoading(true);

    try {
      const profileData = await fetchTikTokProfile(username);
      setProfile(profileData);
      // Définir un nombre d'abonnés cible par défaut (actuels + 10000)
      setTargetFollowers(profileData.followers + 10000);
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
      toast.error("Impossible de récupérer ce profil TikTok");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartBoost = () => {
    if (!profile) {
      toast.error("Veuillez d'abord rechercher un profil TikTok");
      return;
    }

    if (!donorAccount.trim()) {
      toast.error("Veuillez entrer un compte donneur");
      return;
    }

    if (targetFollowers <= profile.followers) {
      toast.error("Le nombre d'abonnés cible doit être supérieur au nombre actuel");
      return;
    }

    // Passer à l'étape d'animation
    setStage(BoostStage.BOOSTING);

    // Configurer le minuteur pour passer à l'étape de résultat après 30 secondes
    timerRef.current = setTimeout(() => {
      // Créer une copie du profil avec le nouveau nombre d'abonnés
      const boostedProfileData = {
        ...profile,
        followers: targetFollowers,
        displayStats: {
          ...profile.displayStats,
          followers: targetFollowers.toLocaleString('fr-FR')
        }
      };

      setBoostedProfile(boostedProfileData);
      setStage(BoostStage.RESULT);
    }, 30000); // 30 secondes d'animation
  };

  const handleReset = () => {
    setStage(BoostStage.FORM);
    setBoostedProfile(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Boost TikTok</h1>
          <div className="inline-flex gap-2 items-center py-1 px-3 rounded-full text-xs font-medium bg-tva-surface border border-tva-border">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>Simulateur uniquement</span>
          </div>
        </div>

        {stage === BoostStage.FORM && (
          <BoostForm 
            onProfileFetch={handleProfileFetch}
            profile={profile}
            targetFollowers={targetFollowers}
            setTargetFollowers={setTargetFollowers}
            donorAccount={donorAccount}
            setDonorAccount={setDonorAccount}
            onStartBoost={handleStartBoost}
            isLoading={isLoading}
          />
        )}

        {stage === BoostStage.BOOSTING && profile && (
          <BoostAnimation 
            profile={profile}
            targetFollowers={targetFollowers}
            donorAccount={donorAccount}
          />
        )}

        {stage === BoostStage.RESULT && boostedProfile && (
          <BoostResult 
            originalProfile={profile!}
            boostedProfile={boostedProfile}
            onReset={handleReset}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default BoostPage;
