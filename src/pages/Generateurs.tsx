
import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/AppLayout';
import { Sparkles, FileText, Video, Hash, MessageSquare, Plus, Clock, List, ChevronDown, MoreHorizontal, LockKeyhole } from 'lucide-react';
import { ProgressSteps, Step } from '@/components/ProgressSteps';
import { IdeaGenerationStep } from '@/components/generateurs/IdeaGenerationStep';
import { ScriptGenerationStep } from '@/components/generateurs/ScriptGenerationStep';
import { ScriptAnalysisStep } from '@/components/generateurs/ScriptAnalysisStep';
import { MetadataGenerationStep } from '@/components/generateurs/MetadataGenerationStep';
import { VideoIdea, VideoScript, VideoAnalysis } from '@/services/geminiService';
import { toast } from 'sonner';
import { saveGeneratedProject, getGeneratedProjects, GeneratedProject, deleteGeneratedProject } from '@/services/generatedProjectsService';
import { useAuth } from '@/contexts/AuthContext';
import { useLicense } from '@/contexts/LicenseContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const GenerateursPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const [selectedIdea, setSelectedIdea] = useState<VideoIdea | null>(null);
  const [generatedScript, setGeneratedScript] = useState<VideoScript | null>(null);
  const [scriptType, setScriptType] = useState<"voiceover" | "scenario" | null>(null);
  const [scriptAnalysis, setScriptAnalysis] = useState<VideoAnalysis | null>(null);
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [savedProjects, setSavedProjects] = useState<GeneratedProject[]>([]);
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'projects'>('create');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isLicenseDialogOpen, setIsLicenseDialogOpen] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const { hasLicense } = useLicense();

  const steps: Step[] = [
    { id: 'ideas', label: 'Idées', icon: Sparkles },
    { id: 'script', label: 'Script', icon: FileText },
    { id: 'analysis', label: 'Analyse', icon: MessageSquare },
    { id: 'metadata', label: 'Métadonnées', icon: Hash }
  ];

  // Charger les projets sauvegardés au chargement du composant
  useEffect(() => {
    if (isAuthenticated) {
      loadSavedProjects();
    }
  }, [isAuthenticated]);

  const loadSavedProjects = async () => {
    try {
      setIsLoading(true);
      const projects = await getGeneratedProjects();
      setSavedProjects(projects);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
      toast.error('Erreur lors du chargement des projets');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour vérifier si l'utilisateur peut créer un nouveau projet
  const canCreateNewProject = () => {
    // Si l'utilisateur a une licence, il peut créer autant de projets qu'il veut
    if (hasLicense) return true;
    
    // Sinon, vérifier s'il a déjà un projet gratuit
    return savedProjects.length === 0;
  };

  const handleStepClick = (index: number) => {
    // Only allow navigation to completed steps or the next available step
    if (index <= Math.max(...completedSteps, 0) + 1 && index <= completedSteps.length) {
      setCurrentStep(index);
    }
  };

  const handleIdeaSelected = (idea: VideoIdea) => {
    if (!canCreateNewProject()) {
      setIsLicenseDialogOpen(true);
      return;
    }
    
    setSelectedIdea(idea);
    setCurrentStep(1);
    
    if (!completedSteps.includes(0)) {
      setCompletedSteps([...completedSteps, 0]);
    }
    
    // Générer un titre de projet à partir de l'idée
    setProjectTitle(idea.title);
    
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
    
    // Sauvegarder le projet après la génération du script
    if (isAuthenticated && selectedIdea) {
      saveProject('script');
    }
  };

  const handleAnalysisComplete = (analysis: VideoAnalysis) => {
    setScriptAnalysis(analysis);
    setCurrentStep(3);
    
    if (!completedSteps.includes(2)) {
      setCompletedSteps([...completedSteps, 2]);
    }
    
    toast.success('Analyse terminée! Générons les métadonnées.');
    
    // Sauvegarder le projet après l'analyse
    if (isAuthenticated && selectedIdea && generatedScript && scriptType) {
      saveProject('analysis', analysis);
    }
  };

  const handleMetadataComplete = (metadata: { title: string; description: string; hashtags: string[] }) => {
    if (!completedSteps.includes(3)) {
      setCompletedSteps([...completedSteps, 3]);
    }
    
    toast.success('Félicitations! Votre contenu TikTok est prêt à être créé!');
    
    // Sauvegarder le projet après la complétion
    if (isAuthenticated && selectedIdea && generatedScript && scriptType) {
      saveProject('complete', scriptAnalysis, metadata).then(() => {
        // Rediriger vers la page d'accueil une fois le projet terminé
        toast.success('Projet terminé! Vous avez utilisé votre projet gratuit.');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      });
    }
  };

  const handleBackClick = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetWorkflow = () => {
    if (!canCreateNewProject()) {
      setIsLicenseDialogOpen(true);
      return;
    }
    
    setCurrentStep(0);
    setCompletedSteps([]);
    setSelectedIdea(null);
    setGeneratedScript(null);
    setScriptType(null);
    setScriptAnalysis(null);
    setProjectTitle('');
    setActiveProjectId(null);
    toast.info('Workflow réinitialisé. Commençons un nouveau projet!');
  };

  const openTitleModal = () => {
    setIsTitleModalOpen(true);
  };

  const saveProject = async (
    step: 'idea' | 'script' | 'analysis' | 'complete', 
    analysis: VideoAnalysis | null = null,
    metadata: { title: string; description: string; hashtags: string[] } | null = null
  ) => {
    try {
      if (!selectedIdea) return;
      
      if (step === 'idea' && projectTitle) {
        const projectId = await saveGeneratedProject(
          projectTitle,
          selectedIdea,
          null,
          null,
          null,
          null,
          'draft'
        );
        setActiveProjectId(projectId);
        toast.success('Projet sauvegardé!');
        await loadSavedProjects();
      } else if (step === 'script' && generatedScript && scriptType) {
        if (activeProjectId) {
          // Mettre à jour un projet existant
          await saveGeneratedProject(
            projectTitle,
            selectedIdea,
            generatedScript,
            scriptType,
            null,
            null,
            'in-progress',
            activeProjectId
          );
        } else {
          // Créer un nouveau projet
          const projectId = await saveGeneratedProject(
            projectTitle,
            selectedIdea,
            generatedScript,
            scriptType,
            null,
            null,
            'in-progress'
          );
          setActiveProjectId(projectId);
        }
        toast.success('Projet sauvegardé avec script!');
        await loadSavedProjects();
      } else if (step === 'analysis' && analysis && generatedScript && scriptType) {
        if (activeProjectId) {
          // Mettre à jour un projet existant
          await saveGeneratedProject(
            projectTitle,
            selectedIdea,
            generatedScript,
            scriptType,
            analysis,
            null,
            'analyzed',
            activeProjectId
          );
        } else {
          // Créer un nouveau projet
          const projectId = await saveGeneratedProject(
            projectTitle,
            selectedIdea,
            generatedScript,
            scriptType,
            analysis,
            null,
            'analyzed'
          );
          setActiveProjectId(projectId);
        }
        toast.success('Projet sauvegardé avec analyse!');
        await loadSavedProjects();
      } else if (step === 'complete' && metadata && generatedScript && scriptType) {
        if (activeProjectId) {
          // Mettre à jour un projet existant
          await saveGeneratedProject(
            projectTitle,
            selectedIdea,
            generatedScript,
            scriptType,
            analysis,
            metadata,
            'completed',
            activeProjectId
          );
        } else {
          // Créer un nouveau projet
          const projectId = await saveGeneratedProject(
            projectTitle,
            selectedIdea,
            generatedScript,
            scriptType,
            analysis,
            metadata,
            'completed'
          );
          setActiveProjectId(projectId);
        }
        toast.success('Projet complet sauvegardé!');
        await loadSavedProjects();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du projet:', error);
      toast.error('Erreur lors de la sauvegarde du projet');
    }
  };

  const loadProject = (project: GeneratedProject) => {
    // Si c'est le projet gratuit existant ou si l'utilisateur a une licence
    if (hasLicense || project.id === savedProjects[0]?.id) {
      setActiveProjectId(project.id);
      setProjectTitle(project.title);
      setSelectedIdea(project.idea);
      setGeneratedScript(project.script);
      setScriptType(project.scriptType);
      setScriptAnalysis(project.analysis);
      
      // Déterminer à quelle étape du flux de travail le projet en est
      const newCompletedSteps: number[] = [];
      
      // Étape 0: Idée sélectionnée
      if (project.idea) {
        newCompletedSteps.push(0);
      }
      
      // Étape 1: Script généré
      if (project.script) {
        newCompletedSteps.push(1);
      }
      
      // Étape 2: Analyse terminée
      if (project.analysis) {
        newCompletedSteps.push(2);
      }
      
      // Étape 3: Métadonnées générées
      if (project.metadata) {
        newCompletedSteps.push(3);
      }
      
      setCompletedSteps(newCompletedSteps);
      
      // Définir l'étape actuelle en fonction de l'avancement du projet
      if (project.metadata) {
        setCurrentStep(3);
      } else if (project.analysis) {
        setCurrentStep(3);
      } else if (project.script) {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
      
      setActiveTab('create');
    } else {
      // Utilisateur sans licence essayant d'accéder à un projet autre que son projet gratuit
      setIsLicenseDialogOpen(true);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteGeneratedProject(projectId);
      toast.success('Projet supprimé avec succès');
      
      // Recharger les projets
      await loadSavedProjects();
      
      // Réinitialiser le workflow si le projet actif a été supprimé
      if (activeProjectId === projectId) {
        resetWorkflow();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      toast.error('Erreur lors de la suppression du projet');
    }
  };

  // Fonction pour obtenir le statut lisible
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Brouillon';
      case 'in-progress':
        return 'En cours';
      case 'analyzed':
        return 'Analysé';
      case 'completed':
        return 'Terminé';
      default:
        return status;
    }
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-200 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'analyzed':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Générateurs</h1>
          <div className="flex space-x-2">
            {isAuthenticated && completedSteps.length > 0 && (
              <button 
                onClick={() => saveProject('idea')}
                className="text-xs py-1.5 px-3 rounded-full bg-tva-primary/20 text-tva-primary border border-tva-primary/30"
              >
                Sauvegarder
              </button>
            )}
            {completedSteps.length > 0 && (
              <button 
                onClick={resetWorkflow}
                className="text-xs py-1.5 px-3 rounded-full bg-tva-surface border border-tva-border"
              >
                Nouveau projet
              </button>
            )}
          </div>
        </div>

        {!hasLicense && savedProjects.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-amber-100 border border-amber-200 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <LockKeyhole size={18} className="text-amber-600" />
              <div>
                <p className="text-amber-800 text-sm font-medium">Mode gratuit: 1 projet uniquement</p>
                <p className="text-amber-700 text-xs">Une fois terminé, vous n'aurez plus accès au générateur sans licence.</p>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-200"
              onClick={() => setIsLicenseDialogOpen(true)}
            >
              Activer une licence
            </Button>
          </div>
        )}

        {isAuthenticated && (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'create' | 'projects')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Créer un projet</TabsTrigger>
              <TabsTrigger value="projects">Mes projets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Projets sauvegardés</h2>
                <button 
                  onClick={resetWorkflow}
                  className="flex items-center gap-1 text-xs py-1.5 px-3 rounded-full bg-tva-primary text-white"
                  disabled={!canCreateNewProject()}
                >
                  <Plus size={12} />
                  Nouveau projet
                </button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-2 border-tva-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : savedProjects.length === 0 ? (
                <div className="text-center p-8 bg-tva-surface/50 rounded-xl">
                  <p className="text-tva-text/70">Aucun projet sauvegardé</p>
                  <button 
                    onClick={() => setActiveTab('create')}
                    className="mt-4 text-sm py-2 px-4 bg-tva-primary text-white rounded-lg flex items-center gap-2 mx-auto"
                  >
                    <Plus size={16} />
                    Créer votre premier projet
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedProjects.map((project, index) => (
                    <div key={project.id} className="bg-tva-surface/50 p-4 rounded-lg hover:bg-tva-surface/80 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{project.title}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(project.status)}`}>
                              {getStatusLabel(project.status)}
                            </span>
                            {!hasLicense && index === 0 && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                                Projet Gratuit
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-tva-text/70">{project.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => loadProject(project)}
                            className="text-xs py-1 px-2 rounded bg-tva-primary/10 text-tva-primary hover:bg-tva-primary/20"
                          >
                            Ouvrir
                          </button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 rounded-full hover:bg-tva-surface">
                                <MoreHorizontal size={16} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDeleteProject(project.id)}>
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-tva-text/70">
                        <Clock size={12} />
                        <span>Dernière modification: {new Date(project.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="create">
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
                  onComplete={handleMetadataComplete}
                />
              )}
            </TabsContent>
          </Tabs>
        )}

        {!isAuthenticated && (
          <>
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
                onComplete={handleMetadataComplete}
              />
            )}
          </>
        )}
      </div>

      {/* Modal pour le titre du projet */}
      <Dialog open={isTitleModalOpen} onOpenChange={setIsTitleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nommer votre projet</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Titre du projet"
              className="w-full p-2 border rounded"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTitleModalOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={() => {
                saveProject('idea');
                setIsTitleModalOpen(false);
              }}
            >
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour la limite de projet */}
      <Dialog open={isLicenseDialogOpen} onOpenChange={setIsLicenseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Limite atteinte</DialogTitle>
            <DialogDescription>
              Vous avez atteint la limite d'un projet gratuit. Activez une licence pour créer des projets illimités et accéder à toutes les fonctionnalités.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between p-4 bg-tva-surface rounded-lg">
              <div>
                <p className="font-medium">Plan gratuit</p>
                <p className="text-sm text-tva-text/70">1 projet uniquement</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Actif
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLicenseDialogOpen(false)}>
              Fermer
            </Button>
            <Button onClick={() => {
              setIsLicenseDialogOpen(false);
              window.location.href = '/telechargement';
            }}>
              Obtenir une licence
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default GenerateursPage;
