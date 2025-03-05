
import { TikTokTrendingVideosResponse, TikTokTrendingCreatorsResponse } from '@/types/tiktokTrends.types';

// Configuration de l'API
const API_CONFIG = {
  apiKey: 'bd18f4b949msh6edd4e1d444b6a0p18d393jsnf0169527896e',
  apiHost: 'tiktok-creative-center-api.p.rapidapi.com'
};

/**
 * Récupère les vidéos en tendance depuis l'API RapidAPI
 * @param country Code pays (ex: US, FR)
 * @param limit Nombre de résultats
 * @param page Numéro de page
 * @returns Promise avec les données de vidéos en tendance
 */
export async function fetchTrendingVideos(
  country: string = 'US', 
  limit: number = 20, 
  page: number = 1
): Promise<TikTokTrendingVideosResponse> {
  console.log(`API Trends: Fetching trending videos for country: ${country}`);
  
  try {
    const response = await fetch(
      `https://${API_CONFIG.apiHost}/api/trending/video?page=${page}&limit=${limit}&period=30&order_by=vv&country=${country}`, 
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': API_CONFIG.apiHost,
          'x-rapidapi-key': API_CONFIG.apiKey
        }
      }
    );
    
    if (!response.ok) {
      const statusCode = response.status;
      console.error(`API responded with status: ${statusCode}`);
      throw new Error(`Erreur lors de la récupération des tendances: ${statusCode}`);
    }
    
    const result = await response.json();
    console.log('Trending videos data received:', result);
    
    return result;
  } catch (error) {
    console.error('Error fetching trending videos:', error);
    throw error;
  }
}

/**
 * Récupère les créateurs en tendance depuis l'API RapidAPI
 * @param country Code pays (ex: US, FR)
 * @param limit Nombre de résultats
 * @param page Numéro de page
 * @returns Promise avec les données de créateurs en tendance
 */
export async function fetchTrendingCreators(
  country: string = 'US', 
  limit: number = 20, 
  page: number = 1
): Promise<TikTokTrendingCreatorsResponse> {
  console.log(`API Trends: Fetching trending creators for country: ${country}`);
  
  try {
    const response = await fetch(
      `https://${API_CONFIG.apiHost}/api/trending/creator?page=${page}&limit=${limit}&sort_by=follower&country=${country}`, 
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': API_CONFIG.apiHost,
          'x-rapidapi-key': API_CONFIG.apiKey
        }
      }
    );
    
    if (!response.ok) {
      const statusCode = response.status;
      console.error(`API responded with status: ${statusCode}`);
      throw new Error(`Erreur lors de la récupération des créateurs tendance: ${statusCode}`);
    }
    
    const result = await response.json();
    console.log('Trending creators data received:', result);
    
    return result;
  } catch (error) {
    console.error('Error fetching trending creators:', error);
    throw error;
  }
}
