
import { supabase } from '@/integrations/supabase/client';
import { TikTokProcessedVideo, VideoAnalysisResult } from '@/types/tiktokVideo.types';
import { toast } from 'sonner';

/**
 * Sauvegarde une analyse de vidéo dans la base de données
 */
export const saveVideoAnalysis = async (
  videoData: TikTokProcessedVideo,
  analysisResults: VideoAnalysisResult
) => {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    
    if (!currentUser || !currentUser.user) {
      throw new Error("Utilisateur non authentifié");
    }
    
    // Try to store in video_analyses table
    try {
      const { data, error } = await supabase
        .from('video_analyses')
        .insert({
          user_id: currentUser.user.id,
          video_id: videoData.id,
          video_url: videoData.url || '',
          video_data: videoData as any,
          analysis_results: analysisResults as any
        })
        .select('id')
        .single();
      
      if (error) {
        // If table doesn't exist, create it
        if (error.code === '42P01') {
          console.log("Table video_analyses doesn't exist, creating it...");
          await createVideoAnalysesTable();
          return saveVideoAnalysis(videoData, analysisResults);
        }
        throw error;
      }
      
      console.log("Analysis saved successfully:", data.id);
      return data.id;
    } catch (tableError) {
      console.error("Error with video_analyses table:", tableError);
      
      // Fallback to generated_projects table
      const { data, error } = await supabase
        .from('generated_projects')
        .insert({
          user_id: currentUser.user.id,
          title: `Video Analysis: ${videoData.title || videoData.id}`,
          description: videoData.description || 'Analyse de vidéo TikTok',
          status: 'completed',
          analysis: analysisResults as any,
          metadata: { video: videoData } as any
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      console.log("Analysis saved to generated_projects as fallback:", data.id);
      return data.id;
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'analyse vidéo:', error);
    toast.error(`Erreur: ${error.message}`);
    throw error;
  }
};

/**
 * Crée la table video_analyses si elle n'existe pas
 */
const createVideoAnalysesTable = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('create_video_analyses_table');
    
    if (error) throw error;
    
    console.log('Table video_analyses created:', data);
  } catch (error) {
    console.error('Erreur lors de la création de la table video_analyses:', error);
    toast.error(`Erreur: ${error.message}`);
    throw error;
  }
};

/**
 * Récupère l'historique des analyses de vidéo
 */
export const getVideoAnalysesHistory = async () => {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    
    if (!currentUser || !currentUser.user) {
      throw new Error("Utilisateur non authentifié");
    }
    
    try {
      // Try to get from video_analyses table
      const { data, error } = await supabase
        .from('video_analyses')
        .select('*')
        .eq('user_id', currentUser.user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        // If table doesn't exist, fall back to generated_projects
        if (error.code === '42P01') {
          console.log("Table video_analyses doesn't exist, falling back to generated_projects");
          throw error;
        }
        throw error;
      }
      
      return data || [];
    } catch (tableError) {
      console.log("Falling back to generated_projects for video analyses history");
      
      // Fallback to generated_projects table
      const { data, error } = await supabase
        .from('generated_projects')
        .select('*')
        .eq('user_id', currentUser.user.id)
        .not('metadata', 'is', null)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Filter projects that contain video analysis
      const videoProjects = data.filter(
        project => project.metadata && project.metadata.video && project.analysis
      );
      
      return videoProjects.map(project => ({
        id: project.id,
        user_id: project.user_id,
        video_id: project.metadata?.video?.id || '',
        video_url: project.metadata?.video?.url || '',
        video_data: project.metadata?.video || {},
        analysis_results: project.analysis || {},
        created_at: project.created_at
      }));
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique des analyses vidéo:', error);
    toast.error(`Erreur: ${error.message}`);
    return [];
  }
};
