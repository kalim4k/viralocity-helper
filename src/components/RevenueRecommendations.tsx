
import React from 'react';
import { Info, TrendingUp, AlertCircle } from 'lucide-react';

interface RevenueRecommendationsProps {
  recommendations: string[];
  isEligible: boolean;
}

export const RevenueRecommendations: React.FC<RevenueRecommendationsProps> = ({ 
  recommendations,
  isEligible
}) => {
  return (
    <section className="glass p-4 rounded-xl">
      <div className="flex items-start">
        <div className={`p-2 rounded-lg mr-3 ${isEligible ? 'bg-tva-primary/10' : 'bg-amber-500/10'}`}>
          {isEligible ? (
            <Info size={18} className="text-tva-primary" />
          ) : (
            <AlertCircle size={18} className="text-amber-500" />
          )}
        </div>
        <div>
          <h3 className="font-semibold mb-2">
            {isEligible ? 'Conseils d\'optimisation' : 'Prérequis pour monétiser'}
          </h3>
          <ul className="text-sm text-tva-text space-y-2">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-center">
                <TrendingUp size={14} className="text-tva-secondary mr-2 shrink-0" />
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
