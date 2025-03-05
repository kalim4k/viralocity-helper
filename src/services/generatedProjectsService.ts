
import { supabase } from '@/integrations/supabase/client';
import { VideoIdea, VideoScript, VideoAnalysis } from '@/services/geminiService';
import { Json } from '@/integrations/supabase/types';

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

// Helper function to safely convert any value to a JSON compatible type
function toJson<T>(value: T): Json {
  return value as unknown as Json;
}

// Helper function to safely convert JSON back to a specific type
function fromJson<T>(json: Json): T {
  return json as unknown as T;
}

/**
 * Sauvegarde un projet généré dans la base de données
 */
export const saveGeneratedProject = async (
  title: string,
  idea: VideoIdea,
  script: VideoScript | null,
  scriptType: "voiceover" | "scenario" | null,
  analysis?: VideoAnalysis,
  metadata?: {
    title: string;
    description: string;
    hashtags: string[];
  },
  status: string = 'draft'
) => {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    
    if (!currentUser || !currentUser.user) {
      throw new Error("Utilisateur non authentifié");
    }
    
    const { data, error } = await supabase
      .from('generated_projects')
      .insert({
        user_id: currentUser.user.id,
        title,
        description: idea.description,
        idea: toJson(idea),
        script: script ? toJson(script) : null,
        script_type: scriptType,
        analysis: analysis ? toJson(analysis) : null,
        metadata: metadata ? toJson(metadata) : null,
        status
      })
      .select('id')
      .single();
    
    if (error) throw error;
    
    return data.id;
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
        idea: updates.idea ? toJson(updates.idea) : undefined,
        script: updates.script ? toJson(updates.script) : undefined,
        script_type: updates.scriptType,
        analysis: updates.analysis ? toJson(updates.analysis) : undefined,
        metadata: updates.metadata ? toJson(updates.metadata) : undefined,
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
      idea: fromJson<VideoIdea>(project.idea),
      script: fromJson<VideoScript>(project.script),
      scriptType: project.script_type,
      analysis: fromJson<VideoAnalysis>(project.analysis),
      metadata: fromJson<{title: string; description: string; hashtags: string[]}>(project.metadata),
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
      idea: fromJson<VideoIdea>(data.idea),
      script: fromJson<VideoScript>(data.script),
      scriptType: data.script_type,
      analysis: fromJson<VideoAnalysis>(data.analysis),
      metadata: fromJson<{title: string; description: string; hashtags: string[]}>(data.metadata),
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
