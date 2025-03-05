
import React from 'react';
import { TrendingVideo } from '@/types/tiktokTrends.types';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';

interface TrendingVideoCardProps {
  video: TrendingVideo;
}

export const TrendingVideoCard: React.FC<TrendingVideoCardProps> = ({ video }) => {
  return (
    <a href={video.item_url} target="_blank" rel="noopener noreferrer">
      <Card className="overflow-hidden hover-card h-full transition-all duration-300 hover:scale-[1.02]">
        <div className="relative aspect-[9/16] w-full">
          <img 
            src={video.cover} 
            alt={video.title} 
            className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-xs py-1 px-2 rounded-full">
            <Play size={12} />
            <span>{Math.floor(video.duration)}s</span>
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="text-sm font-medium line-clamp-2 mb-1">{video.title}</h3>
          <div className="text-xs text-tva-text/60">
            {video.region}
          </div>
        </CardContent>
      </Card>
    </a>
  );
};
