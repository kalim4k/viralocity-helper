
import React from 'react';
import { UserCheck } from 'lucide-react';
import { TikTokProfile } from './TikTokConnectModal';
import { formatNumber } from '@/utils/formatters';

interface TikTokProfileCardProps {
  profile: TikTokProfile;
}

export const TikTokProfileCard: React.FC<TikTokProfileCardProps> = ({ profile }) => {
  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-tva-primary">
          <img src={profile.avatar} alt="Profile" className="h-full w-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{profile.displayName}</h3>
          <p className="text-sm text-tva-text/70">{profile.username}</p>
        </div>
        <div className="flex items-center text-sm text-tva-accent font-medium gap-1">
          <UserCheck size={16} />
          <span>Connecté</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="glass p-4 rounded-xl text-center">
          <p className="text-sm text-tva-text/70">Abonnés</p>
          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-tva-primary to-tva-secondary">
            {formatNumber(profile.followers)}
          </p>
        </div>
        <div className="glass p-4 rounded-xl text-center">
          <p className="text-sm text-tva-text/70">Likes</p>
          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-tva-primary to-tva-accent">
            {formatNumber(profile.likes)}
          </p>
        </div>
      </div>
    </div>
  );
};
