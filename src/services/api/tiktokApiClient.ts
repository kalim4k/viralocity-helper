
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
  console.log('Raw API response received');
  return result;
}
