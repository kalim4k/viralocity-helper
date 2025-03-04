
import { RapidAPIResponse, TikTokApiConfig } from '@/types/tiktok.types';

// API configuration
const API_CONFIG: TikTokApiConfig = {
  apiKey: 'bd18f4b949msh6edd4e1d444b6a0p18d393jsnf0169527896e',
  apiHost: 'tiktok-api6.p.rapidapi.com'
};

/**
 * Fetches user data from RapidAPI TikTok endpoint
 * @param username TikTok username (without @)
 * @returns Promise with the raw API response
 */
export async function fetchUserData(username: string): Promise<RapidAPIResponse> {
  console.log(`API Client: Fetching data for username: ${username}`);
  
  try {
    const response = await fetch(`https://${API_CONFIG.apiHost}/user/details?username=${username}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': API_CONFIG.apiHost,
        'x-rapidapi-key': API_CONFIG.apiKey
      }
    });
    
    if (!response.ok) {
      const statusCode = response.status;
      console.error(`API responded with status: ${statusCode}`);
      
      if (statusCode === 404) {
        throw new Error("Utilisateur introuvable");
      } else if (statusCode === 429) {
        throw new Error("Limite de requêtes dépassée. Veuillez réessayer plus tard.");
      } else {
        throw new Error(`Erreur lors de la récupération du profil TikTok: ${statusCode}`);
      }
    }
    
    const result = await response.json();
    console.log('Raw API response received:', JSON.stringify(result).substring(0, 300) + '...');
    
    // Vérifier si la réponse contient une structure de profil valide
    if (!result.username) {
      throw new Error("Structure de réponse API invalide");
    }
    
    // Construire une réponse compatible avec notre format existant
    const compatibleResponse: RapidAPIResponse = {
      status: 0,
      data: {
        owner: {
          user_info: {
            uid: result.user_id,
            nickname: result.username,
            signature: result.description,
            avatar_thumb: {
              url_list: [result.profile_image]
            },
            follower_count: result.followers,
            total_favorited: result.total_heart,
            unique_id: result.username,
          }
        },
        itemList: []
      }
    };
    
    return compatibleResponse;
  } catch (error) {
    console.error('Error in fetchUserData:', error);
    throw error;
  }
}

/**
 * Fetches video data from RapidAPI TikTok endpoint
 * @param videoId TikTok video ID
 * @returns Promise with the raw API response
 */
export async function fetchVideoData(videoId: string): Promise<any> {
  console.log(`API Client: Fetching data for video ID: ${videoId}`);
  
  try {
    const response = await fetch(`https://${API_CONFIG.apiHost}/video/details?video_id=${videoId}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': API_CONFIG.apiHost,
        'x-rapidapi-key': API_CONFIG.apiKey
      }
    });
    
    if (!response.ok) {
      const statusCode = response.status;
      console.error(`API responded with status: ${statusCode}`);
      
      if (statusCode === 404) {
        throw new Error("Vidéo introuvable");
      } else if (statusCode === 429) {
        throw new Error("Limite de requêtes dépassée. Veuillez réessayer plus tard.");
      } else {
        throw new Error(`Erreur lors de la récupération de la vidéo TikTok: ${statusCode}`);
      }
    }
    
    const result = await response.json();
    console.log('Raw API response received:', JSON.stringify(result).substring(0, 300) + '...');
    
    return result;
  } catch (error) {
    console.error('Error in fetchVideoData:', error);
    throw error;
  }
}
