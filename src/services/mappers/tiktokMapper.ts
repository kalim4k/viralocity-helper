
import { TikTokProfile } from '@/components/TikTokConnectModal';
import { RapidAPIResponse } from '@/types/tiktok.types';

/**
 * Maps the RapidAPI response to our TikTokProfile model
 * @param response The raw API response
 * @param username Original username requested
 * @returns A formatted TikTokProfile object
 */
export function mapToTikTokProfile(response: RapidAPIResponse, username: string): TikTokProfile {
  console.log('Mapping API response to TikTokProfile');
  
  // Validate the response structure
  if (!response.data || !response.data.user_list || response.data.user_list.length === 0) {
    console.error('No user found in API response', response);
    throw new Error('No user found with that username');
  }
  
  // Get the first user from the list (most relevant match)
  const userInfo = response.data.user_list[0].user_info;
  if (!userInfo) {
    throw new Error('User data is incomplete');
  }
  
  console.log('User info found:', userInfo);
  
  // Clean the username (remove @ if present)
  const cleanUsername = username.replace('@', '');
  
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
  
  console.log('Mapping complete:', profile);
  return profile;
}
