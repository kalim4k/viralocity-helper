
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
  if (!response.data || !response.data.owner || !response.data.owner.user_info) {
    console.error('Invalid API response structure:', response);
    throw new Error('No user found with that username');
  }
  
  // Get user info from the correct path
  const userInfo = response.data.owner.user_info;
  console.log('User info found:', userInfo);
  
  // Clean the username (remove @ if present)
  const cleanUsername = username.replace('@', '');
  
  // Extract real videos from itemList if available
  const videos = [];
  
  if (response.data.itemList && response.data.itemList.length > 0) {
    console.log(`Found ${response.data.itemList.length} videos`);
    
    // Take up to 3 videos from the response
    const videoItems = response.data.itemList.slice(0, 3);
    
    for (const item of videoItems) {
      videos.push({
        id: item.id || String(Math.random()),
        thumbnail: item.video?.cover || 'https://picsum.photos/200/350?random=' + videos.length,
        views: item.stats?.playCount || Math.floor(Math.random() * 50000),
        title: item.desc || 'Vidéo TikTok'
      });
    }
  } else {
    console.log('No videos found in API response, using placeholders');
    // Generate 3 placeholder videos if no videos in the response
    videos.push(
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
    );
  }
  
  // Find the likes/hearts count from different possible locations
  // The API may provide heart count in several different fields or formats
  let likesCount = 0;
  
  // Attempt to find likes from various possible fields
  if (userInfo.heartCount) {
    likesCount = userInfo.heartCount;
  } else if (userInfo.heart) {
    likesCount = userInfo.heart;
  } else if (userInfo.total_favorited) {
    likesCount = userInfo.total_favorited;
  } else {
    // If we can't find likes in the user info, use a default
    likesCount = 0;
    console.log('No likes count found in API response');
  }
  
  // Create the profile with all the available information
  const profile: TikTokProfile = {
    username: `@${userInfo.unique_id || cleanUsername}`,
    displayName: userInfo.nickname || cleanUsername,
    nickname: userInfo.nickname || cleanUsername,
    avatar: userInfo.avatar_thumb?.url_list?.[0] || 'https://placehold.co/200x200?text=No+Avatar',
    avatarUrl: userInfo.avatar_thumb?.url_list?.[0] || 'https://placehold.co/200x200?text=No+Avatar',
    followers: userInfo.follower_count || 0,
    following: 0, // This will be updated if available in the API
    likes: likesCount,
    bio: userInfo.signature || '',
    verified: false, // This will be updated if available in the API
    videos: videos
  };
  
  console.log('Mapping complete:', profile);
  return profile;
}
