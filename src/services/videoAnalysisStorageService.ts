
import { supabase } from '@/integrations/supabase/client';
import { TikTokProcessedVideo, VideoAnalysisResult } from '@/types/tiktokVideo.types';

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
    
    const { data, error } = await supabase
      .from('video_analyses')
      .insert({
        user_id: currentUser.user.id,
        video_id: videoData.id,
        video_url: videoData.url,
        video_data: videoData,
        analysis_results: analysisResults,
        created_at: new Date().toISOString()
      })
      .select('id')
      .single();
    
    if (error) {
      // Vérifier si la table existe, sinon la créer
      if (error.code === '42P01') {
        await createVideoAnalysesTable();
        return saveVideoAnalysis(videoData, analysisResults);
      }
      throw error;
    }
    
    return data.id;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'analyse vidéo:', error);
    throw error;
  }
};

/**
 * Crée la table video_analyses si elle n'existe pas
 */
const createVideoAnalysesTable = async () => {
  try {
    const { error } = await supabase.rpc('create_video_analyses_table');
    
    if (error) throw error;
    
    console.log('Table video_analyses créée avec succès');
  } catch (error) {
    console.error('Erreur lors de la création de la table video_analyses:', error);
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
    
    const { data, error } = await supabase
      .from('video_analyses')
      .select('*')
      .eq('user_id', currentUser.user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      // Vérifier si la table existe
      if (error.code === '42P01') {
        return [];
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique des analyses vidéo:', error);
    throw error;
  }
};
