
import React from 'react';
import { TrendingCreator } from '@/types/tiktokTrends.types';
import { Card, CardContent } from '@/components/ui/card';
import { formatCount } from '@/services/trendingService';
import { Users } from 'lucide-react';

interface TrendingCreatorCardProps {
  creator: TrendingCreator;
}

export const TrendingCreatorCard: React.FC<TrendingCreatorCardProps> = ({ creator }) => {
  return (
    <a href={creator.tt_link} target="_blank" rel="noopener noreferrer">
      <Card className="overflow-hidden hover-card h-full transition-all duration-300 hover:scale-[1.02]">
        <div className="flex p-3 items-center gap-3">
          <div className="relative w-12 h-12 flex-shrink-0">
            <img 
              src={creator.avatar_url} 
              alt={creator.nick_name} 
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium truncate">{creator.nick_name}</h3>
            <div className="flex items-center gap-1 text-xs text-tva-text/60">
              <Users size={12} />
              <span>{formatCount(creator.follower_cnt)} abonnés</span>
            </div>
          </div>
        </div>
        {creator.items && creator.items.length > 0 && (
          <div className="grid grid-cols-3 gap-0.5">
            {creator.items.slice(0, 3).map((video) => (
              <div key={video.item_id} className="relative aspect-square w-full">
                <img 
                  src={video.cover_url} 
                  alt={`Vidéo de ${creator.nick_name}`} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] py-0.5 px-1 rounded">
                  {formatCount(video.vv)} vues
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </a>
  );
};
