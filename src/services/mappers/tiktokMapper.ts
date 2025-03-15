
import { RapidAPIResponse, TikTokProfile, TikTokVideo } from '@/types/tiktok.types';
import { formatNumber } from '@/utils/formatters';

/**
 * Maps the raw TikTok API response to our TikTokProfile type
 * @param response The raw API response
 * @returns A cleaned and standardized TikTokProfile object
 */
export const mapTikTokProfileData = (response: RapidAPIResponse): TikTokProfile => {
  console.log('Mapping TikTok profile data:', response);
  
  if (!response || response.status !== 200) {
    throw new Error('Invalid API response format');
  }
  
  // Extract user info from the new API structure
  const userInfo = response.data?.owner?.user_info;
  
  if (!userInfo) {
    throw new Error('User data is incomplete or missing');
  }
  
  // Extract videos from the API response if available
  const videos: TikTokVideo[] = (response.data?.itemList || []).map(item => ({
    id: item.id,
    title: '',
    description: item.desc,
    thumbnail: item.video.cover,
    views: item.stats.playCount,
    likeCount: item.stats.diggCount,
    commentCount: item.stats.commentCount,
    shareCount: item.stats.shareCount,
    createTime: new Date(item.createTime * 1000).toISOString(),
    stats: {
      playCount: item.stats.playCount,
      likeCount: item.stats.diggCount,
      commentCount: item.stats.commentCount,
      shareCount: item.stats.shareCount
    },
    displayStats: {
      plays: formatNumber(item.stats.playCount),
      likes: formatNumber(item.stats.diggCount),
      comments: formatNumber(item.stats.commentCount),
      shares: formatNumber(item.stats.shareCount)
    }
  }));
  
  // Map the profile data to our standardized structure
  const profile: TikTokProfile = {
    id: userInfo.uid,
    uniqueId: userInfo.unique_id,
    username: userInfo.unique_id,
    nickname: userInfo.nickname,
    displayName: userInfo.nickname,
    avatar: userInfo.avatar_thumb?.url_list?.[0] || '',
    bio: userInfo.signature,
    verified: userInfo.verified || false,
    followers: userInfo.follower_count || 0,
    following: userInfo.following_count || 0,
    likes: 0, // This field might not be available in the API response
    videos: videos,
    displayStats: {
      followers: formatNumber(userInfo.follower_count || 0),
      following: formatNumber(userInfo.following_count || 0),
      likes: formatNumber(0), // Placeholder since likes might not be available
      posts: formatNumber(videos.length)
    }
  };
  
  console.log('Mapped profile:', profile);
  return profile;
};
