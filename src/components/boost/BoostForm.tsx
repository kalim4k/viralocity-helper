
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TikTokProfile } from '@/types/tiktok.types';
import { Search, Zap, UserSearch } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { formatNumber } from '@/utils/formatters';
import { TikTokProfileCard } from '@/components/TikTokProfileCard';

interface BoostFormProps {
  onProfileFetch: (username: string) => Promise<void>;
  profile: TikTokProfile | null;
  targetFollowers: number;
  setTargetFollowers: React.Dispatch<React.SetStateAction<number>>;
  donorAccount: string;
  setDonorAccount: React.Dispatch<React.SetStateAction<string>>;
  onStartBoost: () => void;
  isLoading: boolean;
}

export const BoostForm: React.FC<BoostFormProps> = ({
  onProfileFetch,
  profile,
  targetFollowers,
  setTargetFollowers,
  donorAccount,
  setDonorAccount,
  onStartBoost,
  isLoading
}) => {
  const [username, setUsername] = useState<string>('');
  const [maxFollowers, setMaxFollowers] = useState<number>(1000000); // 1M par défaut

  useEffect(() => {
    if (profile) {
      // Max est 10x le nombre actuel d'abonnés ou au moins 100K
      const newMax = Math.max(profile.followers * 10, 100000);
      setMaxFollowers(newMax);
      // Valeur par défaut est les abonnés actuels + 20%
      const defaultTarget = profile.followers + Math.floor(profile.followers * 0.2);
      setTargetFollowers(defaultTarget);
    }
  }, [profile, setTargetFollowers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onProfileFetch(username);
  };

  const handleSliderChange = (values: number[]) => {
    setTargetFollowers(values[0]);
  };

  const getFollowerGain = () => {
    if (!profile) return 0;
    return targetFollowers - profile.followers;
  };

  const getFollowerGainPercentage = () => {
    if (!profile || profile.followers === 0) return 0;
    return ((targetFollowers - profile.followers) / profile.followers) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Formulaire de recherche */}
      <form onSubmit={handleSearch} className="glass p-5 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold">Rechercher votre compte TikTok</h2>
        <div className="flex space-x-2">
          <Input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nom d'utilisateur TikTok (sans @)" 
            className="flex-1"
          />
          <Button 
            type="submit"
            disabled={isLoading || !username.trim()}
            className="bg-gradient-to-r from-tva-primary to-tva-secondary text-white" 
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Recherche...</span>
              </div>
            ) : (
              <>
                <Search size={16} className="mr-2" />
                Rechercher
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Affichage du profil et paramètres de boost */}
      {profile && (
        <div className="space-y-6">
          <TikTokProfileCard profile={profile} />

          <div className="glass p-5 rounded-xl space-y-6">
            <h2 className="text-lg font-semibold">Configuration du boost</h2>
            
            {/* Slider pour le nombre d'abonnés */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-tva-text/70">Nombre d'abonnés souhaité</span>
                <div className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-tva-primary to-tva-secondary">
                  {formatNumber(targetFollowers)}
                </div>
              </div>
              
              <Slider 
                min={profile.followers} 
                max={maxFollowers}
                step={100}
                value={[targetFollowers]}
                onValueChange={handleSliderChange}
                className="py-4"
              />
              
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="glass p-3 rounded-lg">
                  <p className="text-xs text-tva-text/70">Gain d'abonnés</p>
                  <p className="text-lg font-semibold">+{formatNumber(getFollowerGain())}</p>
                </div>
                <div className="glass p-3 rounded-lg">
                  <p className="text-xs text-tva-text/70">Augmentation</p>
                  <p className="text-lg font-semibold">+{getFollowerGainPercentage().toFixed(2)}%</p>
                </div>
              </div>
            </div>
            
            {/* Compte donneur */}
            <div className="space-y-3">
              <label className="text-sm text-tva-text/70">
                Compte donneur (compte populaire qui va "transférer" les abonnés)
              </label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <UserSearch size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tva-text/50" />
                  <Input 
                    type="text" 
                    value={donorAccount}
                    onChange={(e) => setDonorAccount(e.target.value)}
                    placeholder="Ex: charlidamelio, khaby.lame" 
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            
            {/* Bouton de démarrage */}
            <Button 
              onClick={onStartBoost}
              disabled={!profile || !donorAccount.trim() || targetFollowers <= profile.followers}
              className="w-full py-6 bg-gradient-to-r from-tva-primary to-tva-secondary hover:opacity-90 text-white gap-2"
            >
              <Zap size={20} className="animate-pulse" />
              LANCER LE BOOST
            </Button>
            
            <p className="text-xs text-center text-tva-text/50 mt-2">
              Ceci est une simulation uniquement. Aucun abonné ne sera réellement ajouté à votre compte.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
