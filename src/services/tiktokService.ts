
import { TikTokProfile } from '@/components/TikTokConnectModal';

const RAPIDAPI_KEY = 'bd18f4b949msh6edd4e1d444b6a0p18d393jsnf0169527896e';
const RAPIDAPI_HOST = 'tiktok-user.p.rapidapi.com';

// Updated interface to match the actual RapidAPI response structure
interface RapidAPIResponse {
  status: number;
  data: {
    user_list: Array<{
      user_info: {
        uid: string;
        nickname: string;
        signature?: string;
        avatar_thumb: {
          url_list: string[];
        };
        follower_count: number;
        total_favorited?: number;
        unique_id: string;
      }
    }>;
  }
}

/**
 * Fetch TikTok user profile information using RapidAPI
 * @param username TikTok username (with or without @)
 * @returns Promise with TikTok profile information
 */
export async function fetchTikTokProfile(username: string): Promise<TikTokProfile> {
  // Clean username (remove @ if present)
  const cleanUsername = username.replace('@', '');
  console.log(`Fetching profile for username: ${cleanUsername}`);
  
  try {
    const response = await fetch(`https://tiktok-user.p.rapidapi.com/getuser/${cleanUsername}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY
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
    console.log('Raw API response:', JSON.stringify(result, null, 2));
    
    // Validate the response structure
    if (!result.data || !result.data.user_list || result.data.user_list.length === 0) {
      console.error('No user found in API response', result);
      throw new Error('No user found with that username');
    }
    
    // Get the first user from the list (most relevant match)
    const userInfo = result.data.user_list[0].user_info;
    if (!userInfo) {
      throw new Error('User data is incomplete');
    }
    
    console.log('User info found:', userInfo);
    
    // Create the profile with all the available information
    const profile: TikTokProfile = {
      username: `@${userInfo.unique_id || cleanUsername}`,
      displayName: userInfo.nickname || cleanUsername,
      avatar: userInfo.avatar_thumb?.url_list?.[0] || 'https://placehold.co/200x200?text=No+Avatar',
      followers: userInfo.follower_count || 0,
      likes: userInfo.total_favorited || 0,
      bio: userInfo.signature || '',
      videos: [
        // Generate 3 placeholder videos since this API doesn't return videos
        {
          id: '1',
          thumbnail: 'https://picsum.photos/200/350?random=1',
          views: Math.floor(Math.random() * 50000),
          title: 'Mon dernier tutoriel #viral'
        },
        {
          id: '2',
          thumbnail: 'https://picsum.photos/200/350?random=2',
          views: Math.floor(Math.random() * 50000),
          title: 'Comment devenir viral sur TikTok'
        },
        {
          id: '3',
          thumbnail: 'https://picsum.photos/200/350?random=3',
          views: Math.floor(Math.random() * 50000),
          title: 'Mes astuces pour gagner des followers'
        }
      ]
    };
    
    console.log('Processed profile:', profile);
    return profile;
  } catch (error) {
    console.error('Error fetching TikTok profile:', error);
    throw error;
  }
}
