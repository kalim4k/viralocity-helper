
import React from 'react';
import { TrendingHashtag } from '@/types/tiktokTrends.types';
import { Card, CardContent } from '@/components/ui/card';
import { Hash, TrendingUp, Eye } from 'lucide-react';
import { formatCount } from '@/services/trendingService';

interface TrendingHashtagCardProps {
  hashtag: TrendingHashtag;
}

export const TrendingHashtagCard: React.FC<TrendingHashtagCardProps> = ({ hashtag }) => {
  return (
    <Card className="hover-card h-full transition-all duration-300 hover:scale-[1.02]">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-tva-accent/20 flex items-center justify-center">
              <Hash size={16} className="text-tva-accent" />
            </div>
            <h3 className="text-md font-medium">#{hashtag.hashtag_name}</h3>
          </div>
          <div className="bg-tva-primary text-white text-xs py-1 px-2 rounded-full">
            #{hashtag.rank}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs mb-3">
          <div className="flex items-center gap-1">
            <TrendingUp size={14} className="text-tva-accent" />
            <span>{formatCount(hashtag.publish_cnt)} publications</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={14} className="text-tva-accent" />
            <span>{formatCount(hashtag.video_views)} vues</span>
          </div>
        </div>
        
        {hashtag.creators && hashtag.creators.length > 0 && (
          <div className="flex -space-x-2 overflow-hidden">
            {hashtag.creators.map((creator, index) => (
              <img
                key={index}
                src={creator.avatar_url}
                alt={creator.nick_name}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-background"
                title={creator.nick_name}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
