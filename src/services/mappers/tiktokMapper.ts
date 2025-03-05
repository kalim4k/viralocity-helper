
import { RapidAPIResponse, TikTokProfile, TikTokVideo } from '@/types/tiktok.types';

/**
 * Maps the RapidAPI response to the TikTokProfile structure
 * @param data The RapidAPI response data
 * @returns TikTokProfile object
 */
export const mapTikTokProfileData = (data: RapidAPIResponse): TikTokProfile => {
  if (!data.data || !data.data.owner || !data.data.owner.user_info) {
    throw new Error('Invalid API response format');
  }
  
  const userInfo = data.data.owner.user_info;
  const itemList = data.data.itemList || [];
  
  // Map videos from the API response
  const videos: TikTokVideo[] = itemList.map(item => ({
    id: item.id,
    title: item.desc || 'Sans titre', // Ensure title is always provided
    description: item.desc,
    thumbnail: item.video.cover,
    views: item.stats.playCount,
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

  // Build the TikTokProfile object
  const profile: TikTokProfile = {
    id: userInfo.uid,
    uniqueId: userInfo.unique_id,
    username: userInfo.unique_id, // Ensure username is always provided
    nickname: userInfo.nickname,
    displayName: userInfo.nickname, // Ensure displayName is always provided
    avatar: userInfo.avatar_thumb.url_list[0] || '',
    followers: userInfo.follower_count,
    likes: userInfo.total_favorited || userInfo.heart || userInfo.heartCount || 0,
    videos: videos,
    displayStats: {
      followers: formatNumber(userInfo.follower_count),
      following: formatNumber(userInfo.following_count || 0),
      likes: formatNumber(userInfo.total_favorited || userInfo.heart || userInfo.heartCount || 0),
      posts: formatNumber(videos.length)
    }
  };

  // If bio/signature is provided, add it to the profile
  if (userInfo.signature) {
    profile.bio = userInfo.signature;
  }

  return profile;
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
