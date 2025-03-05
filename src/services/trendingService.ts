
import { fetchTrendingVideos, fetchTrendingCreators } from './api/tiktokTrendsApiClient';
import { TrendingVideo, TrendingCreator } from '@/types/tiktokTrends.types';

/**
 * Récupère les vidéos en tendance
 * @param country Code pays (ex: US, FR)
 * @returns Promise avec les vidéos en tendance
 */
export async function getTrendingVideos(country: string = 'US'): Promise<TrendingVideo[]> {
  try {
    const response = await fetchTrendingVideos(country);
    
    if (response.code === 0 && response.data && response.data.videos) {
      return response.data.videos;
    }
    
    return [];
  } catch (error) {
    console.error('Error in trendingService.getTrendingVideos:', error);
    throw new Error(`Erreur lors de la récupération des vidéos en tendance: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

/**
 * Récupère les créateurs en tendance
 * @param country Code pays (ex: US, FR)
 * @returns Promise avec les créateurs en tendance
 */
export async function getTrendingCreators(country: string = 'US'): Promise<TrendingCreator[]> {
  try {
    const response = await fetchTrendingCreators(country);
    
    if (response.code === 0 && response.data && response.data.creators) {
      return response.data.creators;
    }
    
    return [];
  } catch (error) {
    console.error('Error in trendingService.getTrendingCreators:', error);
    throw new Error(`Erreur lors de la récupération des créateurs en tendance: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

/**
 * Formate le nombre d'abonnés
 * @param count Nombre d'abonnés
 * @returns Chaîne formatée (ex: 1.2M, 500K)
 */
export function formatCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Formate la date de création
 * @param timestamp Timestamp unix
 * @returns Date formatée (ex: il y a 2 jours)
 */
export function formatDate(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diffSeconds = now - timestamp;
  
  if (diffSeconds < 60) {
    return "à l'instant";
  } else if (diffSeconds < 3600) {
    const minutes = Math.floor(diffSeconds / 60);
    return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else if (diffSeconds < 86400) {
    const hours = Math.floor(diffSeconds / 3600);
    return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  } else if (diffSeconds < 604800) {
    const days = Math.floor(diffSeconds / 86400);
    return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  } else if (diffSeconds < 2629800) {
    const weeks = Math.floor(diffSeconds / 604800);
    return `il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
  } else if (diffSeconds < 31557600) {
    const months = Math.floor(diffSeconds / 2629800);
    return `il y a ${months} mois`;
  } else {
    const years = Math.floor(diffSeconds / 31557600);
    return `il y a ${years} an${years > 1 ? 's' : ''}`;
  }
}
