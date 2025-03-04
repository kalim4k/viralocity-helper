
import React, { useState } from 'react';
import { FileText, Mic, Film, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { geminiService, VideoIdea, VideoScript } from '@/services/geminiService';

interface ScriptGenerationStepProps {
  selectedIdea: VideoIdea;
  onScriptGenerated: (script: VideoScript, scriptType: "voiceover" | "scenario") => void;
  onBackClick: () => void;
}

export const ScriptGenerationStep: React.FC<ScriptGenerationStepProps> = ({
  selectedIdea,
  onScriptGenerated,
  onBackClick
}) => {
  const [scriptType, setScriptType] = useState<"voiceover" | "scenario" | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedScript, setGeneratedScript] = useState<VideoScript | null>(null);

  const handleGenerateScript = async () => {
    if (!scriptType) {
      toast.error('Veuillez sélectionner un type de script');
      return;
    }

    setIsGenerating(true);

    try {
      const script = await geminiService.generateVideoScript(selectedIdea, scriptType);
      setGeneratedScript(script);
      toast.success('Script généré avec succès!');
    } catch (error) {
      console.error('Error generating script:', error);
      toast.error('Erreur lors de la génération du script');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onBackClick} className="p-2">
          <ArrowLeft size={16} />
          <span className="ml-1">Retour</span>
        </Button>
        <h2 className="text-lg font-semibold">Créer votre script</h2>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

      <div className="glass p-4 rounded-xl mb-6">
        <h3 className="font-medium mb-3">Idée sélectionnée :</h3>
        <h4 className="text-lg font-bold mb-2">{selectedIdea.title}</h4>
        <p className="text-sm">{selectedIdea.description}</p>
        <div className="flex items-center space-x-2 mt-2">
          <span className="badge">{selectedIdea.type}</span>
          <span className="text-xs">Public: {selectedIdea.audience}</span>
        </div>
      </div>

      <section className="glass p-5 rounded-xl space-y-5">
        <h3 className="font-medium">Type de script :</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setScriptType("voiceover")}
            className={`flex flex-col items-center p-4 rounded-xl transition-all ${
              scriptType === "voiceover"
                ? "bg-tva-primary/20 border-2 border-tva-primary"
                : "bg-tva-surface hover:bg-tva-surface/80"
            }`}
          >
            <Mic size={32} className={`mb-2 ${scriptType === "voiceover" ? "text-tva-primary" : ""}`} />
            <span className="font-medium">Voix Off</span>
            <p className="text-xs text-center mt-1 text-tva-text/80">
              Narration parlée accompagnant les visuels
            </p>
          </button>

          <button
            onClick={() => setScriptType("scenario")}
            className={`flex flex-col items-center p-4 rounded-xl transition-all ${
              scriptType === "scenario"
                ? "bg-tva-primary/20 border-2 border-tva-primary"
                : "bg-tva-surface hover:bg-tva-surface/80"
            }`}
          >
            <Film size={32} className={`mb-2 ${scriptType === "scenario" ? "text-tva-primary" : ""}`} />
            <span className="font-medium">Scénario</span>
            <p className="text-xs text-center mt-1 text-tva-text/80">
              Actions et dialogues pour une mise en scène
            </p>
          </button>
        </div>

        <div className="flex justify-center mt-4">
          <Button
            onClick={handleGenerateScript}
            disabled={isGenerating || !scriptType}
            className="bg-tva-primary hover:bg-tva-primary/90 text-white w-full"
          >
            {isGenerating ? (
              <span className="animate-pulse">Génération en cours...</span>
            ) : (
              <>
                Générer le script
                <FileText size={16} className="ml-2" />
              </>
            )}
          </Button>
        </div>
      </section>

      {generatedScript && (
        <div className="glass p-4 rounded-xl space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Script généré :</h3>
            <span className="text-xs text-tva-text/80">Durée estimée: {generatedScript.durationEstimate}</span>
          </div>
          
          <div className="bg-tva-background/80 p-4 rounded-lg text-sm whitespace-pre-line text-tva-text border border-tva-border">
            {generatedScript.script}
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={() => onScriptGenerated(generatedScript, scriptType as "voiceover" | "scenario")}
              className="bg-tva-primary hover:bg-tva-primary/90 text-white"
            >
              Continuer
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
