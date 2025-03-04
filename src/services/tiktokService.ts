
import { TikTokProfile } from '@/components/TikTokConnectModal';
import { fetchUserData } from './api/tiktokApiClient';
import { mapToTikTokProfile } from './mappers/tiktokMapper';

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
    if (result.data.itemList && result.data.itemList.length > 0) {
      const firstItem = result.data.itemList[0];
      if ('author' in firstItem && 'authorStats' in firstItem) {
        console.log('Found authorStats in first video:', firstItem.authorStats);
        
        // If user_info doesn't have heart/likes info, try to get it from authorStats
        if (result.data.owner.user_info && 
            !('heart' in result.data.owner.user_info) && 
            !('heartCount' in result.data.owner.user_info) && 
            !('total_favorited' in result.data.owner.user_info)) {
          
          // Add likes/hearts from authorStats
          if (firstItem.authorStats && 'heart' in firstItem.authorStats) {
            result.data.owner.user_info.heart = firstItem.authorStats.heart as number;
          } else if (firstItem.authorStats && 'heartCount' in firstItem.authorStats) {
            result.data.owner.user_info.heartCount = firstItem.authorStats.heartCount as number;
          }
          
          console.log('Added heart count to user_info from authorStats');
        }
      }
    }
    
    // Map the response to our application model
    const profile = mapToTikTokProfile(result, cleanUsername);
    console.log('Service: Profile successfully mapped');
    
    return profile;
  } catch (error) {
    console.error('Error in TikTok service:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    throw error;
  }
}
