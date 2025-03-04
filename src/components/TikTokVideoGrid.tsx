
import React from 'react';
import { TikTokProfile } from './TikTokConnectModal';
import { formatNumber } from '@/utils/formatters';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface TikTokVideoGridProps {
  videos: TikTokProfile['videos'];
}

export const TikTokVideoGrid: React.FC<TikTokVideoGridProps> = ({ videos }) => {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">Vidéos récentes</h3>
      {videos && videos.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {videos.map(video => (
            <TooltipProvider key={video.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="glass rounded-xl overflow-hidden">
                    <div className="aspect-[9/16] relative">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="h-full w-full object-cover" 
                        onError={(e) => {
                          // Fallback if image fails to load
                          (e.target as HTMLImageElement).src = `https://picsum.photos/200/350?random=${video.id}`;
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="text-xs text-white font-medium">{formatNumber(video.views)} vues</p>
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm max-w-[200px] truncate">{video.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 glass rounded-xl">
          <p className="text-sm text-tva-text/70">Aucune vidéo disponible</p>
        </div>
      )}
    </div>
  );
};
