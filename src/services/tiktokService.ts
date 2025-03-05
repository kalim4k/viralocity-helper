
import { TikTokProfile } from '@/types/tiktok.types';
import { fetchUserData } from './api/tiktokApiClient';
import { mapTikTokProfileData } from './mappers/tiktokMapper';

/**
 * Fetch TikTok user profile information using RapidAPI
 * @param username TikTok username (with or without @)
 * @returns Promise with TikTok profile information
 */
export async function fetchTikTokProfile(username: string): Promise<TikTokProfile> {
  // Clean username (remove @ if present)
  const cleanUsername = username.replace('@', '');
  console.log(`Service: Fetching profile for username: ${cleanUsername}`);
  
  try {
    // Fetch raw data from the API
    const result = await fetchUserData(cleanUsername);
    console.log('Service: API response received, mapping to profile...');
    
    // Extract author stats if available
    if (result.data.itemList && Array.isArray(result.data.itemList) && result.data.itemList.length > 0) {
      const firstItem = result.data.itemList[0];
      
      // Type guard to check if firstItem is a valid object with the expected properties
      if (firstItem && typeof firstItem === 'object' && firstItem !== null) {
        const item = firstItem as Record<string, unknown>;
        
        if ('author' in item && 'authorStats' in item) {
          console.log('Found authorStats in first video:', item.authorStats);
          
          // If user_info doesn't have heart/likes info, try to get it from authorStats
          if (result.data.owner && result.data.owner.user_info && 
              !('heart' in result.data.owner.user_info) && 
              !('heartCount' in result.data.owner.user_info) && 
              !('total_favorited' in result.data.owner.user_info)) {
            
            // Add likes/hearts from authorStats if it's a valid object
            if (item.authorStats && typeof item.authorStats === 'object' && item.authorStats !== null) {
              const authorStats = item.authorStats as Record<string, unknown>;
              
              if ('heart' in authorStats && typeof authorStats.heart === 'number') {
                result.data.owner.user_info.heart = authorStats.heart;
              } else if ('heartCount' in authorStats && typeof authorStats.heartCount === 'number') {
                result.data.owner.user_info.heartCount = authorStats.heartCount;
              }
            }
            
            console.log('Added heart count to user_info from authorStats');
          }
        }
      }
    }
    
    // Map the response to our application model
    const profile = mapTikTokProfileData(result);
    console.log('Service: Profile successfully mapped:', profile);
    
    return profile as TikTokProfile;
  } catch (error) {
    console.error('Error in TikTok service:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    throw new Error(`Erreur lors de la récupération du profil TikTok: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}
