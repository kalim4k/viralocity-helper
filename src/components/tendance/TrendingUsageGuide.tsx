
import React from 'react';
import { Eye, Users } from 'lucide-react';

export const TrendingUsageGuide: React.FC = () => {
  return (
    <div className="glass p-6 rounded-xl mt-10">
      <h3 className="text-lg font-semibold mb-4">Comment utiliser les tendances ?</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Eye size={16} className="text-tva-accent" />
            Pour les vidéos et les sons
          </h4>
          <ul className="list-disc list-inside text-sm space-y-2 text-tva-text/80">
            <li>Analyser les vidéos populaires pour comprendre ce qui fonctionne</li>
            <li>S'inspirer des formats et sujets qui captent l'attention</li>
            <li>Adapter les tendances à votre style et niche</li>
            <li>Utiliser les sons tendance pour augmenter la visibilité</li>
            <li>Créer des transitions originales sur les musiques populaires</li>
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Users size={16} className="text-tva-accent" />
            Pour les créateurs et hashtags
          </h4>
          <ul className="list-disc list-inside text-sm space-y-2 text-tva-text/80">
            <li>Observer les techniques d'engagement des créateurs populaires</li>
            <li>Analyser leur fréquence et timing de publication</li>
            <li>Utiliser les hashtags en tendance appropriés à votre contenu</li>
            <li>Combiner hashtags populaires et nichés pour maximiser la visibilité</li>
            <li>Suivre l'évolution des tendances selon les pays ciblés</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
