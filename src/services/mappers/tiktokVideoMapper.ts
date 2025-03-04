
import { TikTokVideoResponse, TikTokProcessedVideo } from '@/types/tiktokVideo.types';

/**
 * Convertit les données brutes de l'API TikTok en un format plus exploitable
 * @param response Réponse brute de l'API TikTok
 * @returns Objet vidéo TikTok traité
 */
export function mapToTikTokVideo(response: TikTokVideoResponse): TikTokProcessedVideo {
  try {
    const { details } = response;
    
    if (!details || !details.author) {
      throw new Error("Structure de données incomplète reçue de l'API");
    }
    
    // Conversion de la date de création (timestamp) en format lisible
    const createdAt = new Date(parseInt(details.create_time) * 1000).toISOString();
    
    // Création de l'URL complète de la vidéo
    const videoUrl = `https://www.tiktok.com/@${details.author.uniqueId}/video/${details.video_id}`;
    
    const processedVideo: TikTokProcessedVideo = {
      id: details.video_id,
      url: videoUrl,
      username: details.author.uniqueId,
      nickname: details.author.nickname,
      userAvatar: details.author.avatarThumb,
      isVerified: details.author.verified,
      description: details.description || '',
      cover: details.cover || details.avatar_thumb || '',
      playUrl: details.download_url || '',
      downloadUrl: details.download_url || '',
      unwatermarkedUrl: details.unwatermarked_download_url,
      duration: details.duration || 0,
      stats: {
        likes: details.statistics.number_of_hearts || 0,
        shares: details.statistics.number_of_reposts || 0,
        comments: details.statistics.number_of_comments || 0,
        views: details.statistics.number_of_plays || 0,
        saves: Math.round((details.statistics.number_of_hearts || 0) * 0.07) // Estimation des sauvegardes (environ 7% des likes)
      },
      musicInfo: {
        title: 'Son original', // Info musicale non disponible dans cette API
        author: details.author.nickname,
        isOriginal: true
      },
      createdAt: createdAt
    };
    
    return processedVideo;
  } catch (error) {
    console.error('Erreur lors du mapping des données TikTok:', error);
    throw new Error("Impossible de traiter les données vidéo reçues. Format de réponse API inattendu.");
  }
}
