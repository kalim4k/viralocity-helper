
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Mappe les données brutes de TikTok en structure plus propre
 */

import { TikTokProfile, TikTokVideo } from "@/types/tiktok.types";

/**
 * Extrait l'avatar URL d'un objet complexe
 * @param avatar Objet avatar TikTok
 * @returns URL de l'avatar ou URL par défaut
 */
function extractAvatarUrl(avatar: any): string {
  if (!avatar) return '/placeholder.svg';
  
  // Si l'objet avatar contient url_list, on prend la première URL
  if (avatar.url_list && Array.isArray(avatar.url_list) && avatar.url_list.length > 0) {
    return avatar.url_list[0];
  }
  
  // Si l'objet contient directement une propriété url
  if (avatar.url) return avatar.url;
  
  // Fallback sur une image par défaut
  return '/placeholder.svg';
}

/**
 * Mappe les données brutes de l'API TikTok vers un format structuré
 * @param rawData Données brutes de l'API
 * @returns Profil TikTok formaté
 */
export function mapTikTokProfileData(rawData: any): TikTokProfile | null {
  if (!rawData) return null;
  
  try {
    // Déterminer où se trouve la donnée user selon que c'est TikTok Browser API ou le site TikTok
    let userData = rawData.user || rawData;
    
    // Si les données viennent de la structure webapp.user
    if (rawData.webapp && rawData.webapp.user) {
      userData = rawData.webapp.user;
    }
    
    // Si les données sont imbriquées dans une sous-propriété user
    if (userData.user) {
      userData = userData.user;
    }
    
    // Déterminer si le profil est vérifié
    // Note: La propriété verified peut être à des niveaux différents selon la source
    const isVerified = 
      userData.verified || 
      (userData.is_verified && userData.is_verified !== "0") || 
      false;
    
    // Extraire les stats
    const statsData = userData.stats || {};
    
    // Calculer le taux d'engagement si possible
    let engagementRate = 0;
    const followerCount = Number(statsData.followerCount || statsData.follower_count || 0);
    const videoCount = Number(statsData.videoCount || statsData.video_count || 0);
    const heartCount = Number(statsData.heartCount || statsData.heart_count || statsData.digg_count || 0);
    
    if (followerCount > 0 && videoCount > 0) {
      engagementRate = (heartCount / videoCount) / followerCount * 100;
    }
    
    // Construire l'objet de profile
    return {
      id: userData.id || userData.uid || '',
      uniqueId: userData.uniqueId || userData.unique_id || '',
      nickname: userData.nickname || '',
      bio: userData.signature || '',
      avatarUrl: extractAvatarUrl(userData.avatarThumb || userData.avatar_thumb),
      avatar: extractAvatarUrl(userData.avatarThumb || userData.avatar_thumb),
      verified: isVerified,
      following: Number(statsData.followingCount || statsData.following_count || 0),
      followers: followerCount,
      likes: heartCount,
      videos: [],
      videoCount: videoCount,
      engagementRate: parseFloat(engagementRate.toFixed(2)),
      displayStats: {
        followers: formatNumber(followerCount),
        following: formatNumber(Number(statsData.followingCount || statsData.following_count || 0)),
        likes: formatNumber(heartCount),
        posts: formatNumber(videoCount),
      },
    };
  } catch (error) {
    console.error('Error mapping TikTok profile data:', error);
    return null;
  }
}

/**
 * Mappe les données brutes de vidéos TikTok vers un format structuré
 * @param rawVideos Données brutes des vidéos
 * @returns Liste de vidéos TikTok formatées
 */
export function mapTikTokVideosData(rawVideos: any[]): TikTokVideo[] {
  if (!rawVideos || !Array.isArray(rawVideos)) return [];
  
  try {
    return rawVideos
      .filter(video => video && (video.id || video.video_id))
      .map(video => {
        // Extraire le cover
        let coverUrl = '/placeholder.svg';
        if (video.cover && video.cover.url_list && video.cover.url_list.length > 0) {
          coverUrl = video.cover.url_list[0];
        } else if (video.cover) {
          coverUrl = video.cover;
        } else if (video.thumbnail_url) {
          coverUrl = video.thumbnail_url;
        }
        
        return {
          id: video.id || video.video_id || '',
          description: video.desc || video.description || '',
          title: video.desc || video.description || '',
          createTime: video.create_time || Date.now() / 1000,
          coverUrl: coverUrl,
          thumbnail: coverUrl,
          videoUrl: video.play || video.video_url || '',
          shareUrl: video.share_url || '',
          views: Number(video.play_count || video.stats?.playCount || 0),
          stats: {
            commentCount: Number(video.comment_count || video.stats?.commentCount || 0),
            playCount: Number(video.play_count || video.stats?.playCount || 0),
            shareCount: Number(video.share_count || video.stats?.shareCount || 0),
            likeCount: Number(video.like_count || video.digg_count || video.stats?.diggCount || 0),
          },
          displayStats: {
            comments: formatNumber(Number(video.comment_count || video.stats?.commentCount || 0)),
            plays: formatNumber(Number(video.play_count || video.stats?.playCount || 0)),
            shares: formatNumber(Number(video.share_count || video.stats?.shareCount || 0)),
            likes: formatNumber(Number(video.like_count || video.digg_count || video.stats?.diggCount || 0)),
          }
        };
      });
  } catch (error) {
    console.error('Error mapping TikTok videos data:', error);
    return [];
  }
}

/**
 * Formate un nombre en chaîne plus lisible (K, M)
 * @param num Nombre à formater
 * @returns Chaîne formatée
 */
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}
