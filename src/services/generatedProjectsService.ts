
import { supabase } from '@/integrations/supabase/client';
import { VideoIdea, VideoScript, VideoAnalysis } from '@/services/geminiService';

export interface GeneratedProject {
  id: string;
  title: string;
  description: string;
  idea: VideoIdea;
  script: VideoScript;
  scriptType: "voiceover" | "scenario";
  analysis: VideoAnalysis;
  metadata: {
    title: string;
    description: string;
    hashtags: string[];
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Sauvegarde un projet généré dans la base de données
 */
export const saveGeneratedProject = async (
  title: string,
  idea: VideoIdea,
  script: VideoScript,
  scriptType: "voiceover" | "scenario",
  analysis?: VideoAnalysis,
  metadata?: {
    title: string;
    description: string;
    hashtags: string[];
  },
  status: string = 'draft',
  existingProjectId?: string
) => {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    
    if (!currentUser || !currentUser.user) {
      throw new Error("Utilisateur non authentifié");
    }
    
    // Si un ID de projet existant est fourni, mettre à jour ce projet
    if (existingProjectId) {
      const { data, error } = await supabase
        .from('generated_projects')
        .update({
          title,
          description: idea.description,
          idea,
          script,
          script_type: scriptType,
          analysis: analysis || null,
          metadata: metadata || null,
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProjectId)
        .eq('user_id', currentUser.user.id)
        .select('id')
        .single();
      
      if (error) throw error;
      
      return data.id;
    } 
    // Sinon, créer un nouveau projet
    else {
      const { data, error } = await supabase
        .from('generated_projects')
        .insert({
          user_id: currentUser.user.id,
          title,
          description: idea.description,
          idea,
          script,
          script_type: scriptType,
          analysis: analysis || null,
          metadata: metadata || null,
          status
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      return data.id;
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du projet:', error);
    throw error;
  }
};

/**
 * Met à jour un projet généré dans la base de données
 */
export const updateGeneratedProject = async (
  projectId: string,
  updates: {
    title?: string;
    description?: string;
    idea?: VideoIdea;
    script?: VideoScript;
    scriptType?: "voiceover" | "scenario";
    analysis?: VideoAnalysis;
    metadata?: {
      title: string;
      description: string;
      hashtags: string[];
    };
    status?: string;
  }
) => {
  try {
    const { data, error } = await supabase
      .from('generated_projects')
      .update({
        title: updates.title,
        description: updates.description,
        idea: updates.idea,
        script: updates.script,
        script_type: updates.scriptType,
        analysis: updates.analysis,
        metadata: updates.metadata,
        status: updates.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select('id')
      .single();
    
    if (error) throw error;
    
    return data.id;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    throw error;
  }
};

/**
 * Récupère tous les projets générés de l'utilisateur
 */
export const getGeneratedProjects = async () => {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    
    if (!currentUser || !currentUser.user) {
      throw new Error("Utilisateur non authentifié");
    }
    
    const { data, error } = await supabase
      .from('generated_projects')
      .select('*')
      .eq('user_id', currentUser.user.id)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      idea: project.idea,
      script: project.script,
      scriptType: project.script_type,
      analysis: project.analysis,
      metadata: project.metadata,
      status: project.status,
      createdAt: project.created_at,
      updatedAt: project.updated_at
    })) as GeneratedProject[];
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    throw error;
  }
};

/**
 * Récupère un projet généré spécifique
 */
export const getGeneratedProject = async (projectId: string) => {
  try {
    const { data, error } = await supabase
      .from('generated_projects')
      .select('*')
      .eq('id', projectId)
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      idea: data.idea,
      script: data.script,
      scriptType: data.script_type,
      analysis: data.analysis,
      metadata: data.metadata,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    } as GeneratedProject;
  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error);
    throw error;
  }
};

/**
 * Supprime un projet généré
 */
export const deleteGeneratedProject = async (projectId: string) => {
  try {
    const { error } = await supabase
      .from('generated_projects')
      .delete()
      .eq('id', projectId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    throw error;
  }
};
