
import React, { useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import { Sparkles, FileText, Video, Hash, MessageSquare } from 'lucide-react';
import { ProgressSteps, Step } from '@/components/ProgressSteps';
import { IdeaGenerationStep } from '@/components/generateurs/IdeaGenerationStep';
import { ScriptGenerationStep } from '@/components/generateurs/ScriptGenerationStep';
import { ScriptAnalysisStep } from '@/components/generateurs/ScriptAnalysisStep';
import { MetadataGenerationStep } from '@/components/generateurs/MetadataGenerationStep';
import { VideoIdea, VideoScript, VideoAnalysis } from '@/services/geminiService';
import { toast } from 'sonner';

const GenerateursPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const [selectedIdea, setSelectedIdea] = useState<VideoIdea | null>(null);
  const [generatedScript, setGeneratedScript] = useState<VideoScript | null>(null);
  const [scriptType, setScriptType] = useState<"voiceover" | "scenario" | null>(null);
  const [scriptAnalysis, setScriptAnalysis] = useState<VideoAnalysis | null>(null);

  const steps: Step[] = [
    { id: 'ideas', label: 'Idées', icon: Sparkles },
    { id: 'script', label: 'Script', icon: FileText },
    { id: 'analysis', label: 'Analyse', icon: MessageSquare },
    { id: 'metadata', label: 'Métadonnées', icon: Hash }
  ];

  const handleStepClick = (index: number) => {
    // Only allow navigation to completed steps or the next available step
    if (index <= Math.max(...completedSteps, 0) + 1 && index <= completedSteps.length) {
      setCurrentStep(index);
    }
  };

  const handleIdeaSelected = (idea: VideoIdea) => {
    setSelectedIdea(idea);
    setCurrentStep(1);
    
    if (!completedSteps.includes(0)) {
      setCompletedSteps([...completedSteps, 0]);
    }
    
    toast.success('Idée sélectionnée! Passons à la création du script.');
  };

  const handleScriptGenerated = (script: VideoScript, type: "voiceover" | "scenario") => {
    setGeneratedScript(script);
    setScriptType(type);
    setCurrentStep(2);
    
    if (!completedSteps.includes(1)) {
      setCompletedSteps([...completedSteps, 1]);
    }
    
    toast.success('Script généré! Passons à l\'analyse.');
  };

  const handleAnalysisComplete = (analysis: VideoAnalysis) => {
    setScriptAnalysis(analysis);
    setCurrentStep(3);
    
    if (!completedSteps.includes(2)) {
      setCompletedSteps([...completedSteps, 2]);
    }
    
    toast.success('Analyse terminée! Générons les métadonnées.');
  };

  const handleComplete = () => {
    if (!completedSteps.includes(3)) {
      setCompletedSteps([...completedSteps, 3]);
    }
    
    toast.success('Félicitations! Votre contenu TikTok est prêt à être créé!');
  };

  const handleBackClick = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetWorkflow = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setSelectedIdea(null);
    setGeneratedScript(null);
    setScriptType(null);
    setScriptAnalysis(null);
    toast.info('Workflow réinitialisé. Commençons un nouveau projet!');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Générateurs</h1>
          {completedSteps.length > 0 && (
            <button 
              onClick={resetWorkflow}
              className="text-xs py-1.5 px-3 rounded-full bg-tva-surface border border-tva-border"
            >
              Nouveau projet
            </button>
          )}
        </div>

        {/* Progress steps */}
        <ProgressSteps
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />

        {/* Step content */}
        {currentStep === 0 && (
          <IdeaGenerationStep onIdeaSelected={handleIdeaSelected} />
        )}

        {currentStep === 1 && selectedIdea && (
          <ScriptGenerationStep
            selectedIdea={selectedIdea}
            onScriptGenerated={handleScriptGenerated}
            onBackClick={handleBackClick}
          />
        )}

        {currentStep === 2 && selectedIdea && generatedScript && scriptType && (
          <ScriptAnalysisStep
            selectedIdea={selectedIdea}
            generatedScript={generatedScript}
            scriptType={scriptType}
            onAnalysisComplete={handleAnalysisComplete}
            onBackClick={handleBackClick}
          />
        )}

        {currentStep === 3 && selectedIdea && generatedScript && (
          <MetadataGenerationStep
            selectedIdea={selectedIdea}
            generatedScript={generatedScript}
            onBackClick={handleBackClick}
            onComplete={handleComplete}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default GenerateursPage;
