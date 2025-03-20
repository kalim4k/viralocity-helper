
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
  
  // Extract user info from the API structure
  const userInfo = response.data?.owner?.user_info;
  const userStats = response.data?.owner?.stats || {};
  
  if (!userInfo) {
    throw new Error('User data is incomplete or missing');
  }
  
  // Extract videos from the API response if available
  const videos: TikTokVideo[] = (response.data?.itemList || []).map(item => ({
    id: item.id,
    title: item.desc || '',
    description: item.desc || '',
    thumbnail: item.video?.cover || item.video?.originCover || '',
    views: item.stats?.playCount || 0,
    likeCount: item.stats?.diggCount || 0,
    commentCount: item.stats?.commentCount || 0,
    shareCount: item.stats?.shareCount || 0,
    createTime: item.createTime ? new Date(item.createTime * 1000).toISOString() : undefined,
    stats: {
      playCount: item.stats?.playCount || 0,
      likeCount: item.stats?.diggCount || 0,
      commentCount: item.stats?.commentCount || 0,
      shareCount: item.stats?.shareCount || 0
    },
    displayStats: {
      plays: formatNumber(item.stats?.playCount || 0),
      likes: formatNumber(item.stats?.diggCount || 0),
      comments: formatNumber(item.stats?.commentCount || 0),
      shares: formatNumber(item.stats?.shareCount || 0)
    }
  }));
  
  // Get total likes either from the user stats or sum from videos if available
  const totalLikes = userInfo.total_favorited || userStats.heartCount || userInfo.hearts || userStats.diggCount || 0;
  
  // Map the profile data to our standardized structure
  const profile: TikTokProfile = {
    id: userInfo.uid || userInfo.id || '',
    uniqueId: userInfo.unique_id || userInfo.uniqueId || '',
    username: userInfo.unique_id || userInfo.uniqueId || '',
    nickname: userInfo.nickname || '',
    displayName: userInfo.nickname || '',
    avatar: userInfo.avatar_thumb?.url_list?.[0] || userInfo.avatarThumb || userInfo.avatarMedium || '',
    bio: userInfo.signature || '',
    verified: userInfo.verified || false,
    followers: userInfo.follower_count || userStats.followerCount || 0,
    following: userInfo.following_count || userStats.followingCount || 0,
    likes: totalLikes,
    videoCount: userInfo.video_count || userStats.videoCount || videos.length,
    videos: videos,
    displayStats: {
      followers: formatNumber(userInfo.follower_count || userStats.followerCount || 0),
      following: formatNumber(userInfo.following_count || userStats.followingCount || 0),
      likes: formatNumber(totalLikes),
      posts: formatNumber(userInfo.video_count || userStats.videoCount || videos.length)
    }
  };
  
  console.log('Mapped profile:', profile);
  return profile;
};
