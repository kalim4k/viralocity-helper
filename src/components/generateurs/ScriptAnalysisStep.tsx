
import React, { useState, useEffect } from 'react';
import { MessageSquare, ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { geminiService, VideoIdea, VideoScript, VideoAnalysis } from '@/services/geminiService';

interface ScriptAnalysisStepProps {
  selectedIdea: VideoIdea;
  generatedScript: VideoScript;
  scriptType: "voiceover" | "scenario";
  onAnalysisComplete: (analysis: VideoAnalysis) => void;
  onBackClick: () => void;
}

export const ScriptAnalysisStep: React.FC<ScriptAnalysisStepProps> = ({
  selectedIdea,
  generatedScript,
  scriptType,
  onAnalysisComplete,
  onBackClick
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null);

  useEffect(() => {
    analyzeScript();
  }, []);

  const analyzeScript = async () => {
    setIsAnalyzing(true);

    try {
      const scriptAnalysis = await geminiService.analyzeScript(generatedScript.script);
      setAnalysis(scriptAnalysis);
      toast.success('Script analysé avec succès!');
    } catch (error) {
      console.error('Error analyzing script:', error);
      toast.error('Erreur lors de l\'analyse du script');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onBackClick} className="p-2">
          <ArrowLeft size={16} />
          <span className="ml-1">Retour</span>
        </Button>
        <h2 className="text-lg font-semibold">Analyse de script</h2>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

      <div className="glass p-4 rounded-xl">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Votre script ({scriptType === "voiceover" ? "Voix Off" : "Scénario"}) :</h3>
          <span className="text-xs text-tva-text/80">Durée: {generatedScript.durationEstimate}</span>
        </div>
        <div className="bg-tva-background/80 p-3 rounded-lg text-sm max-h-40 overflow-y-auto whitespace-pre-line text-tva-text border border-tva-border">
          {generatedScript.script}
        </div>
      </div>

      {isAnalyzing ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="animate-pulse flex flex-col items-center">
            <MessageSquare size={32} className="mb-3 text-tva-primary" />
            <p>Analyse en cours...</p>
          </div>
        </div>
      ) : analysis ? (
        <div className="space-y-4">
          <div className="glass p-4 rounded-xl">
            <div className="flex items-center mb-3">
              <Lightbulb size={18} className="text-yellow-400 mr-2" />
              <h3 className="font-medium">Hook recommandé</h3>
            </div>
            <p className="text-sm bg-tva-background/80 p-3 rounded-lg text-tva-text border border-tva-border">{analysis.hookSuggestion}</p>
          </div>
          
          <div className="glass p-4 rounded-xl">
            <div className="flex items-center mb-3">
              <MessageSquare size={18} className="text-tva-primary mr-2" />
              <h3 className="font-medium">Conseils de montage</h3>
            </div>
            <p className="text-sm bg-tva-background/80 p-3 rounded-lg whitespace-pre-line text-tva-text border border-tva-border">{analysis.editingTips}</p>
          </div>
          
          <div className="glass p-4 rounded-xl">
            <div className="flex items-center mb-3">
              <MessageSquare size={18} className="text-tva-secondary mr-2" />
              <h3 className="font-medium">Appel à l'action</h3>
            </div>
            <p className="text-sm bg-tva-background/80 p-3 rounded-lg text-tva-text border border-tva-border">{analysis.callToAction}</p>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button
              onClick={() => onAnalysisComplete(analysis)}
              className="bg-tva-primary hover:bg-tva-primary/90 text-white"
            >
              Continuer
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <Button
            onClick={analyzeScript}
            className="bg-tva-primary hover:bg-tva-primary/90 text-white"
          >
            Réessayer l'analyse
            <MessageSquare size={16} className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};
