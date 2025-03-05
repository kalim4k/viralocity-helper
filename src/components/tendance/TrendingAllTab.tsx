
import React from 'react';
import { TrendingVideosTab } from './TrendingVideosTab';
import { TrendingCreatorsTab } from './TrendingCreatorsTab';
import { TrendingSongsTab } from './TrendingSongsTab';
import { TrendingHashtagsTab } from './TrendingHashtagsTab';
import { TrendingVideo, TrendingCreator, TrendingSong, TrendingHashtag } from '@/types/tiktokTrends.types';

interface TrendingAllTabProps {
  trendingVideos: TrendingVideo[] | undefined;
  trendingCreators: TrendingCreator[] | undefined;
  trendingSongs: TrendingSong[] | undefined;
  trendingHashtags: TrendingHashtag[] | undefined;
  isLoadingVideos: boolean;
  isLoadingCreators: boolean;
  isLoadingSongs: boolean;
  isLoadingHashtags: boolean;
}

export const TrendingAllTab: React.FC<TrendingAllTabProps> = ({
  trendingVideos,
  trendingCreators,
  trendingSongs,
  trendingHashtags,
  isLoadingVideos,
  isLoadingCreators,
  isLoadingSongs,
  isLoadingHashtags
}) => {
  return (
    <div className="space-y-10">
      <TrendingVideosTab 
        isLoading={isLoadingVideos} 
        trendingVideos={trendingVideos} 
        limit={4} 
      />
      
      <TrendingCreatorsTab 
        isLoading={isLoadingCreators} 
        trendingCreators={trendingCreators} 
        limit={3} 
      />
      
      <TrendingSongsTab 
        isLoading={isLoadingSongs} 
        trendingSongs={trendingSongs} 
        limit={4} 
      />
      
      <TrendingHashtagsTab 
        isLoading={isLoadingHashtags} 
        trendingHashtags={trendingHashtags} 
        limit={3} 
        showRecommendations={true}
      />
    </div>
  );
};
