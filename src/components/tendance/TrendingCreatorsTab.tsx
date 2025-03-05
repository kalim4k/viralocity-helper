
import React from 'react';
import { Loader2, Users } from 'lucide-react';
import { TrendingCreatorCard } from '@/components/TrendingCreatorCard';
import { TrendingCreator } from '@/types/tiktokTrends.types';

interface TrendingCreatorsTabProps {
  isLoading: boolean;
  trendingCreators: TrendingCreator[] | undefined;
  limit?: number;
}

export const TrendingCreatorsTab: React.FC<TrendingCreatorsTabProps> = ({ 
  isLoading, 
  trendingCreators, 
  limit 
}) => {
  const displayCreators = limit && trendingCreators ? trendingCreators.slice(0, limit) : trendingCreators;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users size={20} className="text-tva-primary" />
        <h2 className="font-semibold">Créateurs en tendance</h2>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-tva-primary" />
        </div>
      ) : !displayCreators || displayCreators.length === 0 ? (
        <div className="glass p-4 rounded-xl text-center py-12">
          <p>Aucun créateur en tendance trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayCreators.map((creator) => (
            <TrendingCreatorCard key={creator.user_id} creator={creator} />
          ))}
        </div>
      )}
    </div>
  );
};
