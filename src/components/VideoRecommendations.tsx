
import React from 'react';
import { VideoAnalysisRecommendation } from '@/types/tiktokVideo.types';
import * as LucideIcons from 'lucide-react';

interface VideoRecommendationsProps {
  recommendations: VideoAnalysisRecommendation[];
}

export const VideoRecommendations: React.FC<VideoRecommendationsProps> = ({ recommendations }) => {
  // Fonction pour obtenir l'icône Lucide correspondante
  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.Info;
    return Icon;
  };
  
  // Fonction pour obtenir la couleur en fonction de la priorité
  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return { bg: 'bg-tva-accent/20', text: 'text-tva-accent' };
      case 'medium': return { bg: 'bg-yellow-400/20', text: 'text-yellow-400' };
      case 'low': return { bg: 'bg-tva-secondary/20', text: 'text-tva-secondary' };
      default: return { bg: 'bg-tva-primary/20', text: 'text-tva-primary' };
    }
  };

  return (
    <div className="space-y-3">
      {recommendations.map((recommendation, index) => {
        const colors = getPriorityColor(recommendation.priority);
        const Icon = getIcon(recommendation.icon);
        
        return (
          <div key={index} className="bg-tva-surface p-3 rounded-lg">
            <div className="flex items-start">
              <div className={`${colors.bg} p-1.5 rounded-lg mr-3`}>
                <Icon size={16} className={colors.text} />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">{recommendation.title}</h4>
                <p className="text-xs text-tva-text/70">{recommendation.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
