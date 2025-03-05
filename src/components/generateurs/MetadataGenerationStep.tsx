
import React, { useState, useEffect } from 'react';
import { Hash, ArrowLeft, Copy, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { geminiService, VideoIdea, VideoScript, VideoAnalysis, VideoMetadata } from '@/services/geminiService';

interface MetadataGenerationStepProps {
  selectedIdea: VideoIdea;
  generatedScript: VideoScript;
  onBackClick: () => void;
  onComplete: (metadata: { title: string; description: string; hashtags: string[] }) => void;
}

export const MetadataGenerationStep: React.FC<MetadataGenerationStepProps> = ({
  selectedIdea,
  generatedScript,
  onBackClick,
  onComplete
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [copied, setCopied] = useState<{title: boolean; description: boolean; hashtags: boolean}>({
    title: false,
    description: false,
    hashtags: false
  });

  useEffect(() => {
    generateMetadata();
  }, []);

  const generateMetadata = async () => {
    setIsGenerating(true);

    try {
      const videoMetadata = await geminiService.generateMetadata(selectedIdea, generatedScript.script);
      setMetadata(videoMetadata);
      toast.success('Métadonnées générées avec succès!');
    } catch (error) {
      console.error('Error generating metadata:', error);
      toast.error('Erreur lors de la génération des métadonnées');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, field: 'title' | 'description' | 'hashtags') => {
    navigator.clipboard.writeText(text);
    setCopied({...copied, [field]: true});
    
    setTimeout(() => {
      setCopied({...copied, [field]: false});
    }, 2000);
    
    toast.success(`${field === 'title' ? 'Titre' : field === 'description' ? 'Description' : 'Hashtags'} copié!`);
  };

  const handleComplete = () => {
    if (metadata) {
      onComplete({
        title: metadata.title,
        description: metadata.description,
        hashtags: metadata.hashtags
      });
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onBackClick} className="p-2">
          <ArrowLeft size={16} />
          <span className="ml-1">Retour</span>
        </Button>
        <h2 className="text-lg font-semibold">Métadonnées</h2>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

      {isGenerating ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-pulse flex flex-col items-center">
            <Hash size={32} className="mb-3 text-tva-primary" />
            <p>Génération des métadonnées...</p>
          </div>
        </div>
      ) : metadata ? (
        <div className="space-y-5">
          <div className="glass p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Titre optimisé</h3>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-8"
                onClick={() => copyToClipboard(metadata.title, 'title')}
              >
                {copied.title ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
            <p className="bg-tva-background/80 p-3 rounded-lg text-tva-text border border-tva-border">{metadata.title}</p>
          </div>
          
          <div className="glass p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Description</h3>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-8"
                onClick={() => copyToClipboard(metadata.description, 'description')}
              >
                {copied.description ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
            <p className="bg-tva-background/80 p-3 rounded-lg text-sm whitespace-pre-line text-tva-text border border-tva-border">{metadata.description}</p>
          </div>
          
          <div className="glass p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Hashtags</h3>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-8"
                onClick={() => copyToClipboard(metadata.hashtags.join(' '), 'hashtags')}
              >
                {copied.hashtags ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 bg-tva-background/80 p-3 rounded-lg text-tva-text border border-tva-border">
              {metadata.hashtags.map((tag, index) => (
                <span key={index} className="text-tva-primary">{tag}</span>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleComplete}
              className="bg-tva-primary hover:bg-tva-primary/90 text-white px-8"
            >
              Terminer
              <Check size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <Button
            onClick={generateMetadata}
            className="bg-tva-primary hover:bg-tva-primary/90 text-white"
          >
            Réessayer la génération
            <Hash size={16} className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};
