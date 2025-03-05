
import {
  TikTokTrendingVideosResponse,
  TikTokTrendingCreatorsResponse,
  TikTokTrendingSongsResponse,
  TikTokTrendingHashtagsResponse
} from '@/types/tiktokTrends.types';

const API_KEY = 'bd18f4b949msh6edd4e1d444b6a0p18d393jsnf0169527896e';
const API_HOST = 'tiktok-creative-center-api.p.rapidapi.com';

/**
 * Options de base pour les requêtes API
 */
const baseOptions = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': API_HOST,
  }
};

/**
 * Récupère les vidéos en tendance
 * @param country Code du pays (ex: US, FR)
 * @returns Promise avec les données de vidéos en tendance
 */
export async function fetchTrendingVideos(country: string = 'US'): Promise<TikTokTrendingVideosResponse> {
  const url = `https://${API_HOST}/api/trending/video?page=1&limit=20&period=30&order_by=vv&country=${country}`;
  
  const response = await fetch(url, baseOptions);
  
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des vidéos en tendance: ${response.status}`);
  }
  
  return await response.json();
}

/**
 * Récupère les créateurs en tendance
 * @param country Code du pays (ex: US, FR)
 * @returns Promise avec les données de créateurs en tendance
 */
export async function fetchTrendingCreators(country: string = 'US'): Promise<TikTokTrendingCreatorsResponse> {
  const url = `https://${API_HOST}/api/trending/creator?page=1&limit=20&sort_by=follower&country=${country}`;
  
  const response = await fetch(url, baseOptions);
  
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des créateurs en tendance: ${response.status}`);
  }
  
  return await response.json();
}

/**
 * Récupère les sons en tendance
 * @param country Code du pays (ex: US, FR)
 * @returns Promise avec les données de sons en tendance
 */
export async function fetchTrendingSongs(country: string = 'US'): Promise<TikTokTrendingSongsResponse> {
  const url = `https://${API_HOST}/api/trending/song?page=1&limit=20&period=7&rank_type=popular&country=${country}`;
  
  const response = await fetch(url, baseOptions);
  
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des sons en tendance: ${response.status}`);
  }
  
  return await response.json();
}

/**
 * Récupère les hashtags en tendance
 * @param country Code du pays (ex: US, FR)
 * @returns Promise avec les données de hashtags en tendance
 */
export async function fetchTrendingHashtags(country: string = 'US'): Promise<TikTokTrendingHashtagsResponse> {
  const url = `https://${API_HOST}/api/trending/hashtag?page=1&limit=20&period=120&country=${country}&sort_by=popular`;
  
  const response = await fetch(url, baseOptions);
  
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des hashtags en tendance: ${response.status}`);
  }
  
  return await response.json();
}
