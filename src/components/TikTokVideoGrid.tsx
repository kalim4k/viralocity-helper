
import React from 'react';
import { TikTokProfile } from './TikTokConnectModal';
import { formatNumber } from '@/utils/formatters';

interface TikTokVideoGridProps {
  videos: TikTokProfile['videos'];
}

export const TikTokVideoGrid: React.FC<TikTokVideoGridProps> = ({ videos }) => {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">Vidéos récentes</h3>
      <div className="grid grid-cols-3 gap-3">
        {videos.map(video => (
          <div key={video.id} className="glass rounded-xl overflow-hidden">
            <div className="aspect-[9/16] relative">
              <img src={video.thumbnail} alt={video.title} className="h-full w-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="text-xs text-white font-medium">{formatNumber(video.views)} vues</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
