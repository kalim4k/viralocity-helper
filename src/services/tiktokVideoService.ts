
import { TikTokProcessedVideo } from '@/types/tiktokVideo.types';
import { fetchVideoData } from './api/tiktokVideoApiClient';
import { mapToTikTokVideo } from './mappers/tiktokVideoMapper';

/**
 * Récupère les informations d'une vidéo TikTok à partir de son URL ou ID
 * @param videoIdOrUrl URL ou ID de la vidéo TikTok
 * @returns Promesse avec les informations de la vidéo TikTok
 */
export async function fetchTikTokVideo(videoIdOrUrl: string): Promise<TikTokProcessedVideo> {
  try {
    if (!videoIdOrUrl) {
      throw new Error("Veuillez fournir une URL ou un ID de vidéo TikTok valide");
    }
    
    // Récupération des données brutes depuis l'API
    const result = await fetchVideoData(videoIdOrUrl);
    console.log('Service: Réponse API reçue, conversion en cours...');
    
    // Si la réponse contient une chaîne au lieu d'un objet data, c'est une erreur
    if (typeof result.data === 'string') {
      throw new Error(`L'API a retourné une erreur: ${result.data}`);
    }
    
    // Conversion des données en notre modèle d'application
    const video = mapToTikTokVideo(result);
    console.log('Service: Vidéo traitée avec succès');
    
    return video;
  } catch (error) {
    console.error('Erreur dans le service TikTok vidéo:', error);
    if (error instanceof Error) {
      console.error('Message d\'erreur:', error.message);
    }
    throw error;
  }
}

/**
 * Calcule et retourne des métriques de performance basées sur les statistiques de la vidéo
 * @param video Vidéo TikTok traitée
 * @returns Scores de performance (taux d'engagement, taux de complétion estimé, etc.)
 */
export function calculateVideoMetrics(video: TikTokProcessedVideo) {
  // Calcul du taux d'engagement (likes + commentaires + partages) / vues
  const engagementRate = (video.stats.likes + video.stats.comments + video.stats.shares) / video.stats.views * 100;
  
  // Estimation très grossière du taux de complétion basée sur le ratio likes/vues
  const completionRate = Math.min(85, 30 + (video.stats.likes / video.stats.views * 200));
  
  // Score de hook basé sur l'engagement et la durée (les vidéos courtes avec bon engagement ont probablement un bon hook)
  const durationFactor = video.duration < 30 ? 1.2 : video.duration < 60 ? 1 : 0.8;
  const hookScore = Math.min(100, engagementRate * durationFactor * 15);
  
  // Score de viralité basé sur les vues, partages et enregistrements
  const viralityFactor = (video.stats.shares / video.stats.views * 100) + (video.stats.saves / video.stats.views * 100);
  const viralityScore = Math.min(100, viralityFactor * 15 + (video.stats.views > 100000 ? 30 : video.stats.views > 10000 ? 15 : 0));
  
  return {
    engagementRate: parseFloat(engagementRate.toFixed(2)),
    completionRate: parseFloat(completionRate.toFixed(2)),
    hookScore: parseFloat(hookScore.toFixed(2)),
    viralityScore: parseFloat(viralityScore.toFixed(2))
  };
}
