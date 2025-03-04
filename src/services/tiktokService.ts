
import { TikTokProfile } from '@/components/TikTokConnectModal';

const RAPIDAPI_KEY = 'bd18f4b949msh6edd4e1d444b6a0p18d393jsnf0169527896e';
const RAPIDAPI_HOST = 'tiktok-user.p.rapidapi.com';

/**
 * Fetch TikTok user profile information using RapidAPI
 * @param username TikTok username (with or without @)
 * @returns Promise with TikTok profile information
 */
export async function fetchTikTokProfile(username: string): Promise<TikTokProfile> {
  // Clean username (remove @ if present)
  const cleanUsername = username.replace('@', '');
  
  try {
    const response = await fetch(`https://tiktok-user.p.rapidapi.com/getuser/${cleanUsername}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching TikTok profile: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Check if we have user results
    if (!result.data || !result.data.user_list || result.data.user_list.length === 0) {
      throw new Error('No user found with that username');
    }
    
    // Get the first user from the list (most relevant match)
    const user = result.data.user_list[0].user_info;
    
    // Format the response to match our TikTokProfile interface
    return {
      username: `@${user.unique_id}`,
      displayName: user.nickname,
      avatar: user.avatar_thumb.url_list[0],
      followers: user.follower_count,
      likes: 0, // This API doesn't provide total likes, we could try to calculate from videos
      videos: [
        // Generate 3 placeholder videos since this API doesn't return videos
        // In a real app, you would make another API call to get videos
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
  } catch (error) {
    console.error('Error fetching TikTok profile:', error);
    throw error;
  }
}
