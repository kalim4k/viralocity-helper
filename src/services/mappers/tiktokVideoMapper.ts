
import { TikTokVideoResponse, TikTokProcessedVideo } from '@/types/tiktokVideo.types';

/**
 * Convertit les données brutes de l'API TikTok en un format plus exploitable
 * @param response Réponse brute de l'API TikTok
 * @returns Objet vidéo TikTok traité
 */
export function mapToTikTokVideo(response: TikTokVideoResponse): TikTokProcessedVideo {
  // Si la réponse contient une chaîne au lieu d'un objet, c'est une erreur
  if (typeof response.data === 'string') {
    throw new Error(`Erreur API: ${response.data}`);
  }

  const { owner, item } = response.data;
  
  // Parse collectCount which can be string or number
  let collectCount: number;
  if (typeof item.stats.collectCount === 'string') {
    collectCount = parseInt(item.stats.collectCount, 10) || 0;
  } else {
    collectCount = item.stats.collectCount || 0;
  }
  
  // Ensure we have a valid description (can be undefined in some responses)
  const description = item.desc || 
                     (item.contents && item.contents[0] ? item.contents[0].desc : '') ||
                     '';
  
  // Ensure we have valid cover image URLs (can be undefined in some responses)
  const coverImage = item.video.cover || 
                    item.video.dynamicCover || 
                    item.video.originCover || 
                    '';
  
  const processedVideo: TikTokProcessedVideo = {
    id: item.id,
    url: `https://www.tiktok.com/@${owner.uniqueId}/video/${item.id}`,
    username: owner.uniqueId,
    nickname: owner.nickname,
    userAvatar: owner.avatarThumb,
    description: description,
    cover: coverImage,
    playUrl: item.video.playAddr,
    duration: item.video.duration,
    stats: {
      likes: item.stats.diggCount,
      shares: item.stats.shareCount,
      comments: item.stats.commentCount,
      views: item.stats.playCount,
      saves: collectCount
    },
    musicInfo: {
      title: item.music.title || 'Son original',
      author: item.music.authorName || owner.nickname,
      isOriginal: item.music.original
    },
    createdAt: item.createTime
  };
  
  return processedVideo;
}
