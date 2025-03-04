
import { RapidAPIResponse, TikTokApiConfig } from '@/types/tiktok.types';

// API configuration
const API_CONFIG: TikTokApiConfig = {
  apiKey: 'bd18f4b949msh6edd4e1d444b6a0p18d393jsnf0169527896e',
  apiHost: 'tiktok-user.p.rapidapi.com'
};

/**
 * Fetches user data from RapidAPI TikTok endpoint
 * @param username TikTok username (without @)
 * @returns Promise with the raw API response
 */
export async function fetchUserData(username: string): Promise<RapidAPIResponse> {
  console.log(`API Client: Fetching data for username: ${username}`);
  
  try {
    const response = await fetch(`https://tiktok-user.p.rapidapi.com/getuser/${username}`, {
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
        throw new Error("No user found");
      } else if (statusCode === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      } else {
        throw new Error(`Error fetching TikTok profile: ${statusCode}`);
      }
    }
    
    const result = await response.json() as RapidAPIResponse;
    console.log('Raw API response received:', JSON.stringify(result).substring(0, 300) + '...');
    
    // Look for author stats in the response
    if (result.data && result.data.itemList && result.data.itemList.length > 0) {
      const firstItem = result.data.itemList[0];
      console.log('First video item found with stats:', firstItem.stats);
      
      // If the response has authorStats attribute which contains likes data
      if ('authorStats' in firstItem && firstItem.authorStats?.heartCount) {
        // Add the heart count to user_info if it's missing
        if (result.data.owner.user_info && !result.data.owner.user_info.heartCount) {
          console.log('Adding heartCount from authorStats to user_info');
          result.data.owner.user_info.heartCount = firstItem.authorStats.heartCount;
        }
      }
    }
    
    // Validate the API response structure
    if (!result.data || !result.data.owner || !result.data.owner.user_info) {
      console.error('Invalid API response structure:', result);
      throw new Error('API returned invalid data structure');
    }
    
    return result;
  } catch (error) {
    console.error('Error in fetchUserData:', error);
    throw error;
  }
}
