
import React from 'react';

interface HashtagRecommendationsProps {
  hashtags: string[];
}

export const HashtagRecommendations: React.FC<HashtagRecommendationsProps> = ({ hashtags }) => {
  return (
    <div className="glass p-4 rounded-xl">
      <h3 className="font-semibold mb-3">Hashtags recommandés</h3>
      <div className="flex flex-wrap gap-2">
        {hashtags.map((hashtag, index) => (
          <span 
            key={index} 
            className="bg-tva-surface px-2 py-1 rounded-lg text-xs text-tva-primary"
          >
            {hashtag.startsWith('#') ? hashtag : `#${hashtag}`}
          </span>
        ))}
      </div>
    </div>
  );
};
