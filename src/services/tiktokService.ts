
import { toast } from 'sonner';
import { RapidAPIResponse, TikTokProfile } from '@/types/tiktok.types';
import { mapTikTokProfileData } from './mappers/tiktokMapper';

// API configuration
const API_KEY = 'bd18f4b949msh6edd4e1d444b6a0p18d393jsnf0169527896e';
const API_HOST = 'tiktok-user.p.rapidapi.com';

/**
 * Fetches a TikTok profile by username
 * @param username TikTok username
 * @returns Promise with the TikTok profile data
 */
export const fetchTikTokProfile = async (username: string) => {
  console.log(`Fetching TikTok profile for username: ${username}`);
  
  try {
    // Remove @ from username if present
    const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
    const url = `https://${API_HOST}/getuser/${cleanUsername}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}): ${errorText}`);
      throw new Error(`Erreur API (${response.status}): ${errorText}`);
    }
    
    const data: RapidAPIResponse = await response.json();
    
    if (data.status !== 200) {
      console.error('API returned error status:', data);
      throw new Error(`Erreur: ${JSON.stringify(data)}`);
    }
    
    // Vérification que les données essentielles sont présentes
    if (!data.data || !data.data.itemList || data.data.itemList.length === 0) {
      console.error('No video data found for the user', data);
      throw new Error('Aucune donnée de vidéo trouvée pour cet utilisateur.');
    }
    
    // Map the API response to our TikTokProfile structure
    return mapTikTokProfileData(data);
  } catch (error) {
    console.error('Error fetching TikTok profile:', error);
    toast.error(`Erreur lors de la récupération du profil: ${error.message}`);
    throw error;
  }
};
