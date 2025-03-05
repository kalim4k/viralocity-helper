
import { RapidAPIResponse, TikTokProfile, TikTokVideo } from '@/types/tiktok.types';

/**
 * Maps the RapidAPI response to the TikTokProfile structure
 * @param data The RapidAPI response data
 * @returns TikTokProfile object
 */
export const mapTikTokProfileData = (data: RapidAPIResponse): TikTokProfile => {
  if (!data.data || !data.data.itemList || !data.data.itemList[0] || !data.data.itemList[0].author) {
    throw new Error('Invalid API response format');
  }
  
  // Get author data from the first video
  const authorData = data.data.itemList[0].author;
  const authorStats = data.data.itemList[0].authorStats;
  const itemList = data.data.itemList || [];
  
  // Map videos from the API response
  const videos: TikTokVideo[] = itemList.map(item => ({
    id: item.id,
    title: item.desc || 'Sans titre', // Ensure title is always provided
    description: item.desc,
    thumbnail: item.video.cover,
    coverUrl: item.video.dynamicCover,
    playUrl: item.video.playAddr,
    views: item.stats.playCount,
    likeCount: item.stats.diggCount,
    commentCount: item.stats.commentCount,
    shareCount: item.stats.shareCount,
    createTime: new Date(item.createTime * 1000).toISOString(),
    duration: item.video.duration,
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
    id: authorData.id,
    uniqueId: authorData.uniqueId,
    username: authorData.uniqueId, // Ensure username is always provided
    nickname: authorData.nickname,
    displayName: authorData.nickname, // Ensure displayName is always provided
    avatar: authorData.avatarMedium,
    bio: authorData.signature,
    verified: authorData.verified,
    followers: authorStats.followerCount,
    following: authorStats.followingCount,
    likes: authorStats.heartCount,
    videoCount: authorStats.videoCount,
    videos: videos,
    displayStats: {
      followers: formatNumber(authorStats.followerCount),
      following: formatNumber(authorStats.followingCount),
      likes: formatNumber(authorStats.heartCount),
      posts: formatNumber(authorStats.videoCount)
    }
  };

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
