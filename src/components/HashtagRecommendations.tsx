
import React from 'react';

interface HashtagRecommendationsProps {
  hashtags: string[];
}

export const HashtagRecommendations: React.FC<HashtagRecommendationsProps> = ({ hashtags }) => {
  // Si aucun hashtag n'est fourni ou si la liste est vide, afficher un message
  if (!hashtags || hashtags.length === 0) {
    return (
      <div className="glass p-4 rounded-xl">
        <h3 className="font-semibold mb-3">Hashtags recommandés</h3>
        <p className="text-sm text-tva-text/70">Aucun hashtag recommandé disponible.</p>
      </div>
    );
  }

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
