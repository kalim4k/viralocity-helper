
import React from 'react';
import { VideoAnalysisMetrics } from '@/types/tiktokVideo.types';
import { cn } from '@/lib/utils';

interface VideoMetricsDisplayProps {
  metrics: VideoAnalysisMetrics;
}

export const VideoMetricsDisplay: React.FC<VideoMetricsDisplayProps> = ({ metrics }) => {
  // Fonction pour déterminer le libellé d'évaluation en fonction du score
  const getEvaluationLabel = (value: number, category: keyof VideoAnalysisMetrics) => {
    const thresholds = {
      engagementRate: { low: 3, medium: 7, high: 12 },
      completionRate: { low: 40, medium: 60, high: 75 },
      hookScore: { low: 40, medium: 60, high: 75 },
      viralityScore: { low: 40, medium: 60, high: 75 }
    };
    
    const threshold = thresholds[category];
    
    if (value >= threshold.high) return { text: "Excellent", color: "text-tva-secondary" };
    if (value >= threshold.medium) return { text: "Bon", color: "text-tva-primary" };
    if (value >= threshold.low) return { text: "Moyen", color: "text-yellow-400" };
    return { text: "À améliorer", color: "text-tva-accent" };
  };
  
  // Fonction pour déterminer la couleur du gradient en fonction du score
  const getGradientColor = (value: number) => {
    if (value >= 75) return "from-tva-primary to-tva-secondary";
    if (value >= 60) return "from-tva-primary to-tva-primary";
    if (value >= 40) return "from-tva-primary to-yellow-400";
    return "from-tva-accent to-red-400";
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm">Engagement</span>
          <span className={cn("text-sm font-medium", getEvaluationLabel(metrics.engagementRate, 'engagementRate').color)}>
            {getEvaluationLabel(metrics.engagementRate, 'engagementRate').text}
          </span>
        </div>
        <div className="w-full bg-tva-border/30 h-2 rounded-full">
          <div 
            className={`bg-gradient-to-r ${getGradientColor(metrics.engagementRate)} h-2 rounded-full`}
            style={{ width: `${Math.min(100, metrics.engagementRate * 8)}%` }}
          ></div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm">Taux de complétion</span>
          <span className={cn("text-sm font-medium", getEvaluationLabel(metrics.completionRate, 'completionRate').color)}>
            {getEvaluationLabel(metrics.completionRate, 'completionRate').text}
          </span>
        </div>
        <div className="w-full bg-tva-border/30 h-2 rounded-full">
          <div 
            className={`bg-gradient-to-r ${getGradientColor(metrics.completionRate)} h-2 rounded-full`}
            style={{ width: `${metrics.completionRate}%` }}
          ></div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm">Hook (5s)</span>
          <span className={cn("text-sm font-medium", getEvaluationLabel(metrics.hookScore, 'hookScore').color)}>
            {getEvaluationLabel(metrics.hookScore, 'hookScore').text}
          </span>
        </div>
        <div className="w-full bg-tva-border/30 h-2 rounded-full">
          <div 
            className={`bg-gradient-to-r ${getGradientColor(metrics.hookScore)} h-2 rounded-full`}
            style={{ width: `${metrics.hookScore}%` }}
          ></div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm">Score de viralité</span>
          <span className="text-sm font-medium text-tva-primary">{metrics.viralityScore}/100</span>
        </div>
        <div className="w-full bg-tva-border/30 h-2 rounded-full">
          <div 
            className={`bg-gradient-to-r ${getGradientColor(metrics.viralityScore)} h-2 rounded-full`}
            style={{ width: `${metrics.viralityScore}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
