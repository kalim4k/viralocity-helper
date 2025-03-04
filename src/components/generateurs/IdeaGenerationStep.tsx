
import React, { useState } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { geminiService, VideoIdea } from '@/services/geminiService';

interface IdeaGenerationStepProps {
  onIdeaSelected: (idea: VideoIdea) => void;
}

export const IdeaGenerationStep: React.FC<IdeaGenerationStepProps> = ({ onIdeaSelected }) => {
  const [niche, setNiche] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [ideas, setIdeas] = useState<VideoIdea[]>([]);

  const handleGenerateIdeas = async () => {
    if (!niche.trim()) {
      toast.error('Veuillez entrer une niche ou un sujet');
      return;
    }

    setIsGenerating(true);

    try {
      const generatedIdeas = await geminiService.generateVideoIdeas(niche);
      setIdeas(generatedIdeas);
      toast.success('Idées de vidéos générées avec succès!');
    } catch (error) {
      console.error('Error generating ideas:', error);
      toast.error('Erreur lors de la génération des idées');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <section className="glass p-4 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold">Générer des idées de vidéos</h2>
        <p className="text-sm text-tva-text/70">
          Entrez votre niche ou le sujet de votre vidéo pour recevoir des idées personnalisées basées sur les tendances actuelles.
        </p>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Ex: cuisine, fitness, mode, technologie..."
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="flex-1 bg-tva-surface/60 border border-tva-border"
          />
          <Button
            onClick={handleGenerateIdeas}
            disabled={isGenerating || !niche.trim()}
            className="bg-tva-primary hover:bg-tva-primary/90 text-white"
          >
            {isGenerating ? (
              <>
                <span className="animate-pulse">Génération...</span>
              </>
            ) : (
              <>
                Générer
                <Sparkles size={16} />
              </>
            )}
          </Button>
        </div>
      </section>

      {ideas.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mt-6 mb-3">Idées recommandées</h3>
          
          <div className="space-y-3">
            {ideas.map((idea, index) => (
              <div key={index} className="glass p-4 rounded-xl hover-card cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="badge">{idea.type}</span>
                  <div className="flex items-center space-x-1">
                    <Sparkles size={14} className="text-yellow-400" />
                    <span className="text-xs font-semibold">{idea.viralPotential}%</span>
                  </div>
                </div>
                
                <h4 className="font-medium mb-2">{idea.title}</h4>
                <p className="text-sm text-tva-text/80 mb-3">{idea.description}</p>
                
                <div className="flex justify-between items-center text-xs text-tva-text/70">
                  <div>
                    <span>Public: {idea.audience}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="flex items-center text-tva-primary" 
                    onClick={() => onIdeaSelected(idea)}
                  >
                    <span className="mr-1">Choisir</span>
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
