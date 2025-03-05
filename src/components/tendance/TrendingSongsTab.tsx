
import React from 'react';
import { Loader2, Music } from 'lucide-react';
import { TrendingSongCard } from '@/components/TrendingSongCard';
import { TrendingSong } from '@/types/tiktokTrends.types';

interface TrendingSongsTabProps {
  isLoading: boolean;
  trendingSongs: TrendingSong[] | undefined;
  limit?: number;
}

export const TrendingSongsTab: React.FC<TrendingSongsTabProps> = ({ 
  isLoading, 
  trendingSongs, 
  limit 
}) => {
  const displaySongs = limit && trendingSongs ? trendingSongs.slice(0, limit) : trendingSongs;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Music size={20} className="text-tva-primary" />
        <h2 className="font-semibold">Sons en tendance</h2>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-tva-primary" />
        </div>
      ) : !displaySongs || displaySongs.length === 0 ? (
        <div className="glass p-4 rounded-xl text-center py-12">
          <p>Aucun son en tendance trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displaySongs.map((song) => (
            <TrendingSongCard key={song.clip_id} song={song} />
          ))}
        </div>
      )}
    </div>
  );
};
