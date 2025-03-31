
import { RapidAPIResponse, TikTokProfile, TikTokVideo } from '@/types/tiktok.types';
import { formatNumber } from '@/utils/formatters';

/**
 * Maps the raw TikTok API response to our TikTokProfile type
 * @param response The raw API response (from either Apify or RapidAPI)
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
  
  // Handle both Apify and RapidAPI data structures
  const isApifyData = 'follower_count' in userInfo;
  
  // Get user ID based on the source
  const userId = isApifyData 
    ? userInfo.uid || userInfo.sec_uid 
    : userInfo.uid || userInfo.id || '';
  
  // Get username based on the source
  const username = isApifyData 
    ? userInfo.unique_id 
    : userInfo.unique_id || userInfo.uniqueId || '';
  
  // Get nickname (display name) based on the source
  const nickname = isApifyData 
    ? userInfo.nickname 
    : userInfo.nickname || '';
  
  // Get follower count based on the source
  const followerCount = isApifyData 
    ? userInfo.follower_count 
    : userInfo.follower_count || userStats.followerCount || 0;
  
  // Get following count based on the source
  const followingCount = isApifyData 
    ? userInfo.following_count 
    : userInfo.following_count || userStats.followingCount || 0;
  
  // Get total likes based on the source
  const totalLikes = isApifyData 
    ? userInfo.total_favorited || 0 
    : userInfo.total_favorited || userStats.heartCount || userInfo.hearts || userStats.diggCount || 0;
  
  // Get video count based on the source
  const videoCount = isApifyData 
    ? userInfo.aweme_count 
    : userInfo.video_count || userStats.videoCount || videos.length;
  
  // Get avatar URL based on the source
  const avatarUrl = isApifyData 
    ? (userInfo.avatar_thumb?.url_list?.[0] || '') 
    : (userInfo.avatar_thumb?.url_list?.[0] || userInfo.avatarThumb || userInfo.avatarMedium || '');
  
  // Get bio based on the source
  const bio = isApifyData 
    ? (userInfo.signature || '') 
    : (userInfo.signature || '');
  
  // Get verified status based on the source
  const verified = isApifyData 
    ? !!userInfo.enterprise_verify_reason 
    : userInfo.verified || false;
  
  // Map the profile data to our standardized structure
  const profile: TikTokProfile = {
    id: userId,
    uniqueId: username,
    username: username,
    nickname: nickname,
    displayName: nickname,
    avatar: avatarUrl,
    bio: bio,
    verified: verified,
    followers: followerCount,
    following: followingCount,
    likes: totalLikes,
    videoCount: videoCount,
    videos: videos,
    displayStats: {
      followers: formatNumber(followerCount),
      following: formatNumber(followingCount),
      likes: formatNumber(totalLikes),
      posts: formatNumber(videoCount)
    }
  };
  
  console.log('Mapped profile:', profile);
  return profile;
};
