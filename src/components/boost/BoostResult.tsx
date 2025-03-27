
import React from 'react';
import { TikTokProfile } from '@/types/tiktok.types';
import { Button } from '@/components/ui/button';
import { TikTokProfileCard } from '@/components/TikTokProfileCard';
import { Check, RefreshCw, TrendingUp, Share2 } from 'lucide-react';
import { formatNumber } from '@/utils/formatters';

interface BoostResultProps {
  originalProfile: TikTokProfile;
  boostedProfile: TikTokProfile;
  onReset: () => void;
}

export const BoostResult: React.FC<BoostResultProps> = ({
  originalProfile,
  boostedProfile,
  onReset
}) => {
  const followerGain = boostedProfile.followers - originalProfile.followers;
  const percentageGain = ((followerGain / originalProfile.followers) * 100).toFixed(2);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass p-6 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500/20 text-green-500">
            <Check size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Boost terminé avec succès!</h2>
            <p className="text-sm text-tva-text/70">
              Votre compte a été artificiellement boosté dans cette simulation
            </p>
          </div>
        </div>

        <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
          <div className="glass p-4 rounded-xl space-y-2">
            <h3 className="text-sm text-tva-text/70">Avant le boost</h3>
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full overflow-hidden">
                <img src={originalProfile.avatar} alt="Avatar" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="font-semibold">{originalProfile.displayName}</p>
                <p className="text-sm text-tva-text/70">{formatNumber(originalProfile.followers)} abonnés</p>
              </div>
            </div>
          </div>

          <div className="glass p-4 rounded-xl space-y-2 bg-gradient-to-r from-tva-primary/10 to-tva-secondary/10 border border-tva-primary/20">
            <h3 className="text-sm text-tva-text/70">Après le boost</h3>
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-tva-primary">
                <img src={boostedProfile.avatar} alt="Avatar" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="font-semibold">{boostedProfile.displayName}</p>
                <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-tva-primary to-tva-secondary">
                  {formatNumber(boostedProfile.followers)} abonnés
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass p-5 rounded-xl">
        <h3 className="text-lg font-semibold mb-4">Statistiques du boost</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-tva-surface p-4 rounded-lg text-center">
            <TrendingUp size={20} className="mx-auto mb-2 text-tva-primary" />
            <p className="text-xs text-tva-text/70">Gain d'abonnés</p>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-tva-primary to-tva-secondary">
              +{formatNumber(followerGain)}
            </p>
          </div>
          
          <div className="bg-tva-surface p-4 rounded-lg text-center">
            <Share2 size={20} className="mx-auto mb-2 text-tva-primary" />
            <p className="text-xs text-tva-text/70">Augmentation</p>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-tva-primary to-tva-secondary">
              +{percentageGain}%
            </p>
          </div>
        </div>

        <div className="p-4 border border-yellow-400/30 bg-yellow-400/10 rounded-lg mb-6">
          <p className="text-sm text-center">
            <strong>Rappel:</strong> Ceci est une simulation uniquement. Aucun abonné n'a été réellement ajouté à votre compte.
          </p>
        </div>

        <TikTokProfileCard profile={boostedProfile} />

        <div className="mt-6">
          <Button 
            onClick={onReset}
            className="w-full py-6 bg-gradient-to-r from-tva-primary to-tva-secondary hover:opacity-90 text-white"
          >
            <RefreshCw size={18} className="mr-2" />
            Simuler un nouveau boost
          </Button>
        </div>
      </div>
    </div>
  );
};
