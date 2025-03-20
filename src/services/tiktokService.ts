
import { toast } from 'sonner';
import { TikTokProfile, RapidAPIResponse } from '@/types/tiktok.types';
import { mapTikTokProfileData } from './mappers/tiktokMapper';
import { fetchTikTokUserProfile } from './api/tiktokApiClient';

/**
 * Fetches a TikTok profile by username
 * @param username TikTok username
 * @returns Promise with the TikTok profile data
 */
export const fetchTikTokProfile = async (username: string): Promise<TikTokProfile> => {
  console.log(`Fetching TikTok profile for username: ${username}`);
  
  try {
    // Remove @ from username if present
    const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
    
    // Get profile data from API
    const profileData = await fetchTikTokUserProfile(cleanUsername);
    
    // Map the API response to our TikTokProfile structure
    return mapTikTokProfileData(profileData);
  } catch (error) {
    console.error('Error fetching TikTok profile:', error);
    toast.error(`Erreur lors de la récupération du profil: ${error.message}`);
    throw error;
  }
};
