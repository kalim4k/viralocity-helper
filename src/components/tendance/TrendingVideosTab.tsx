
import React from 'react';
import { Loader2, Eye } from 'lucide-react';
import { TrendingVideoCard } from '@/components/TrendingVideoCard';
import { TrendingVideo } from '@/types/tiktokTrends.types';

interface TrendingVideosTabProps {
  isLoading: boolean;
  trendingVideos: TrendingVideo[] | undefined;
  limit?: number;
}

export const TrendingVideosTab: React.FC<TrendingVideosTabProps> = ({ 
  isLoading, 
  trendingVideos, 
  limit 
}) => {
  const displayVideos = limit && trendingVideos ? trendingVideos.slice(0, limit) : trendingVideos;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Eye size={20} className="text-tva-primary" />
        <h2 className="font-semibold">Vidéos tendance</h2>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-tva-primary" />
        </div>
      ) : !displayVideos || displayVideos.length === 0 ? (
        <div className="glass p-4 rounded-xl text-center py-12">
          <p>Aucune vidéo en tendance trouvée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayVideos.map((video) => (
            <TrendingVideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};
