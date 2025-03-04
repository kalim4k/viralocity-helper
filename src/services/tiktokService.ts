
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
