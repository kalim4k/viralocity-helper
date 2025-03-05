
import React from 'react';
import { TrendingSong } from '@/types/tiktokTrends.types';
import { Card, CardContent } from '@/components/ui/card';
import { Music, PlayCircle } from 'lucide-react';
import { formatCount } from '@/services/trendingService';

interface TrendingSongCardProps {
  song: TrendingSong;
}

export const TrendingSongCard: React.FC<TrendingSongCardProps> = ({ song }) => {
  return (
    <a href={song.link} target="_blank" rel="noopener noreferrer">
      <Card className="overflow-hidden hover-card h-full transition-all duration-300 hover:scale-[1.02]">
        <div className="relative aspect-square w-full">
          <img 
            src={song.cover} 
            alt={`${song.title} by ${song.author}`} 
            className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/0 flex flex-col justify-end p-3">
            <div className="absolute top-2 right-2 bg-tva-primary text-white text-xs py-1 px-2 rounded-full">
              #{song.rank}
            </div>
            <PlayCircle className="h-12 w-12 text-white/70 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="text-sm font-medium line-clamp-1 mb-1">{song.title}</h3>
          <div className="flex items-center gap-1 text-xs text-tva-text/60">
            <Music size={12} />
            <span className="line-clamp-1">{song.author}</span>
          </div>
        </CardContent>
      </Card>
    </a>
  );
};
