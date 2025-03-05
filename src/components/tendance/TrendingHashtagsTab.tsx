
import React from 'react';
import { Loader2, Hash } from 'lucide-react';
import { TrendingHashtagCard } from '@/components/TrendingHashtagCard';
import { HashtagRecommendations } from '@/components/HashtagRecommendations';
import { TrendingHashtag } from '@/types/tiktokTrends.types';

interface TrendingHashtagsTabProps {
  isLoading: boolean;
  trendingHashtags: TrendingHashtag[] | undefined;
  limit?: number;
  showRecommendations?: boolean;
}

export const TrendingHashtagsTab: React.FC<TrendingHashtagsTabProps> = ({ 
  isLoading, 
  trendingHashtags, 
  limit,
  showRecommendations = true
}) => {
  const displayHashtags = limit && trendingHashtags ? trendingHashtags.slice(0, limit) : trendingHashtags;
  
  // Extract top hashtags for recommendations
  const getTopHashtags = () => {
    if (!trendingHashtags || trendingHashtags.length === 0) return [];
    return trendingHashtags.slice(0, 10).map(hashtag => hashtag.hashtag_name);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Hash size={20} className="text-tva-primary" />
        <h2 className="font-semibold">Hashtags en tendance</h2>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-tva-primary" />
        </div>
      ) : !displayHashtags || displayHashtags.length === 0 ? (
        <div className="glass p-4 rounded-xl text-center py-12">
          <p>Aucun hashtag en tendance trouvé</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {displayHashtags.map((hashtag) => (
              <TrendingHashtagCard key={hashtag.hashtag_id} hashtag={hashtag} />
            ))}
          </div>
          
          {showRecommendations && trendingHashtags && trendingHashtags.length > 0 && (
            <HashtagRecommendations hashtags={getTopHashtags()} />
          )}
        </>
      )}
    </div>
  );
};
