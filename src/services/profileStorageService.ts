
import { supabase } from '@/integrations/supabase/client';
import { TikTokProfile, TikTokProfileAnalysis } from '@/types/tiktok.types';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Sauvegarde une analyse de profil TikTok dans la base de données
 */
export const saveProfileAnalysis = async (
  username: string,
  profileData: TikTokProfile,
  analysisResults: TikTokProfileAnalysis,
  imageData: string | null = null
) => {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    
    if (!currentUser || !currentUser.user) {
      throw new Error("Utilisateur non authentifié");
    }
    
    const { data, error } = await supabase
      .from('profile_analyses')
      .insert({
        user_id: currentUser.user.id,
        tiktok_username: username,
        profile_data: profileData,
        analysis_results: analysisResults,
        image_data: imageData
      })
      .select('id')
      .single();
    
    if (error) throw error;
    
    console.log('Analyse sauvegardée avec succès:', data.id);
    return data.id;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'analyse:', error);
    throw error;
  }
};

/**
 * Récupère l'historique des analyses de profil d'un utilisateur
 */
export const getProfileAnalysesHistory = async () => {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    
    if (!currentUser || !currentUser.user) {
      throw new Error("Utilisateur non authentifié");
    }
    
    const { data, error } = await supabase
      .from('profile_analyses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique des analyses:', error);
    throw error;
  }
};

/**
 * Récupère une analyse de profil spécifique
 */
export const getProfileAnalysis = async (analysisId: string) => {
  try {
    const { data, error } = await supabase
      .from('profile_analyses')
      .select('*')
      .eq('id', analysisId)
      .single();
    
    if (error) throw error;
    
    return {
      username: data.tiktok_username,
      profile: data.profile_data as TikTokProfile,
      analysis: data.analysis_results as TikTokProfileAnalysis,
      imageData: data.image_data,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'analyse:', error);
    throw error;
  }
};
