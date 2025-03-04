
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
    
    // Map the response to our application model
    const profile = mapToTikTokProfile(result, cleanUsername);
    
    return profile;
  } catch (error) {
    console.error('Error in TikTok service:', error);
    throw error;
  }
}
