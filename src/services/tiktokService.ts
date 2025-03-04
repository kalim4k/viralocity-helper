
import { TikTokProfile } from '@/components/TikTokConnectModal';

const RAPIDAPI_KEY = 'bd18f4b949msh6edd4e1d444b6a0p18d393jsnf0169527896e';
const RAPIDAPI_HOST = 'tiktok-user.p.rapidapi.com';

// Interface mise à jour pour correspondre à la structure réelle de l'API
interface RapidAPITikTokResponse {
  status?: number;
  message?: string;
  data?: {
    user?: {
      user_info?: {
        uid?: string;
        nickname?: string;
        unique_id?: string;
        signature?: string;
        avatar_thumb?: {
          url_list?: string[];
        };
        follower_count?: number;
        total_favorited?: number;
        sec_uid?: string;
      };
    };
    user_list?: Array<{
      user_info?: {
        uid?: string;
        nickname?: string;
        unique_id?: string;
        signature?: string;
        avatar_thumb?: {
          url_list?: string[];
        };
        follower_count?: number;
        total_favorited?: number;
        sec_uid?: string;
      };
    }>;
  };
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
    const response = await fetch(`https://tiktok-user.p.rapidapi.com/user/info/${cleanUsername}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    });
    
    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      throw new Error(`Error fetching TikTok profile: ${response.status}`);
    }
    
    const rawResult = await response.json();
    console.log('Raw API response:', JSON.stringify(rawResult, null, 2));
    
    // Cast to our expected response type
    const result = rawResult as RapidAPITikTokResponse;
    
    // Check if we have valid data structure - handle both formats
    let userInfo = null;
    
    if (result.data?.user?.user_info) {
      // Format 1: user info in data.user.user_info
      userInfo = result.data.user.user_info;
      console.log('Found user info in data.user.user_info format');
    } else if (result.data?.user_list && result.data.user_list.length > 0) {
      // Format 2: user info in data.user_list[0].user_info
      userInfo = result.data.user_list[0].user_info;
      console.log('Found user info in data.user_list format');
    }
    
    // If no user info was found, handle the error
    if (!userInfo) {
      console.error('No user found in API response', result);
      if (result.message) {
        throw new Error(result.message);
      } else {
        throw new Error('No user found with that username');
      }
    }
    
    console.log('User info found:', userInfo);
    
    // Set default values for missing data to prevent null/undefined errors
    const avatarUrl = userInfo.avatar_thumb?.url_list?.[0] || 'https://placehold.co/200x200?text=No+Avatar';
    
    // Format the response to match our TikTokProfile interface
    const profile: TikTokProfile = {
      username: `@${userInfo.unique_id || cleanUsername}`,
      displayName: userInfo.nickname || cleanUsername,
      avatar: avatarUrl,
      followers: userInfo.follower_count || 0,
      likes: userInfo.total_favorited || 0,
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

// Alternative function that uses a different endpoint
export async function fetchTikTokProfileAlternative(username: string): Promise<TikTokProfile> {
  // Clean username (remove @ if present)
  const cleanUsername = username.replace('@', '');
  console.log(`Fetching profile (alternative) for username: ${cleanUsername}`);
  
  try {
    const response = await fetch(`https://tiktok-user.p.rapidapi.com/getuser/${cleanUsername}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    });
    
    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      throw new Error(`Error fetching TikTok profile: ${response.status}`);
    }
    
    const rawResult = await response.json();
    console.log('Raw API response (alternative):', JSON.stringify(rawResult, null, 2));
    
    // Cast to our expected response type
    const result = rawResult as RapidAPITikTokResponse;
    
    // Check if we have valid data structure
    if (!result.data || !result.data.user_list || result.data.user_list.length === 0) {
      console.error('No user found in API response', result);
      throw new Error('No user found with that username');
    }
    
    // Get the first user from the list (most relevant match)
    const user = result.data.user_list[0].user_info;
    
    if (!user) {
      throw new Error('User data is incomplete');
    }
    
    console.log('User info found (alternative):', user);
    
    // Format the response to match our TikTokProfile interface
    const profile: TikTokProfile = {
      username: `@${user.unique_id || cleanUsername}`,
      displayName: user.nickname || cleanUsername,
      avatar: user.avatar_thumb?.url_list?.[0] || 'https://placehold.co/200x200?text=No+Avatar',
      followers: user.follower_count || 0,
      likes: user.total_favorited || 0,
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
    
    console.log('Processed profile (alternative):', profile);
    return profile;
  } catch (error) {
    console.error('Error fetching TikTok profile (alternative):', error);
    throw error;
  }
}
