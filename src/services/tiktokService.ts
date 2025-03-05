
import { toast } from 'sonner';
import { TikTokProfile } from '@/types/tiktok.types';

// API configuration
const API_KEY = 'bd18f4b949msh6edd4e1d444b6a0p18d393jsnf0169527896e';
const API_HOST = 'tiktok-api6.p.rapidapi.com';

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
    const url = `https://${API_HOST}/user/details?username=${cleanUsername}`;
    
    console.log(`Making API request to: ${url}`);
    
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
      throw new Error(`Erreur API (${response.status}): ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("API response:", data);
    
    // Verify the response structure
    if (!data || !data.username) {
      console.error('Invalid API response format:', data);
      throw new Error('Format de réponse API invalide');
    }
    
    // Create a simplified profile structure
    const profileData: TikTokProfile = {
      id: data.user_id,
      uniqueId: data.username,
      username: data.username,
      nickname: data.username,
      displayName: data.username,
      avatar: data.profile_image,
      bio: data.description || '',
      verified: data.verified || false,
      followers: data.followers || 0,
      following: data.following || 0,
      likes: data.total_heart || 0,
      videoCount: data.total_videos || 0,
      videos: [],
      displayStats: {
        followers: formatNumber(data.followers || 0),
        following: formatNumber(data.following || 0),
        likes: formatNumber(data.total_heart || 0),
        posts: formatNumber(data.total_videos || 0)
      }
    };
    
    return profileData;
  } catch (error: any) {
    console.error('Error fetching TikTok profile:', error);
    toast.error(`Erreur lors de la récupération du profil: ${error.message}`);
    
    // Create a mock profile if the API fails
    const mockProfile: TikTokProfile = createMockProfile(username);
    return mockProfile;
  }
};

/**
 * Creates a mock profile when the API fails
 */
const createMockProfile = (username: string): TikTokProfile => {
  // Generate random stats for demo purposes
  const followers = Math.floor(10000 + Math.random() * 990000);
  const following = Math.floor(100 + Math.random() * 900);
  const likes = followers * (Math.floor(5 + Math.random() * 95) / 10);
  const videoCount = Math.floor(20 + Math.random() * 180);
  
  return {
    id: 'mock-id',
    uniqueId: username,
    username: username,
    nickname: username,
    displayName: username,
    avatar: 'https://placehold.co/100/3730a3/ffffff?text=Avatar',
    bio: 'Profil de démonstration - Les données réelles n\'ont pas pu être récupérées',
    verified: Math.random() > 0.7,
    followers: followers,
    following: following,
    likes: likes,
    videoCount: videoCount,
    videos: [],
    displayStats: {
      followers: formatNumber(followers),
      following: formatNumber(following),
      likes: formatNumber(likes),
      posts: formatNumber(videoCount)
    }
  };
};

/**
 * Formats a number for display (e.g., 1000 -> 1K)
 * @param num The number to format
 * @returns Formatted number string
 */
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
};
