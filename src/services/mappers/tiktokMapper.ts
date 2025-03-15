
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
  
  // Extract user info - handles both formats of the API response
  // First try the more common owner.user_info path
  let userInfo = response.data?.owner?.user_info;
  let userStats = response.data?.owner?.stats || {};
  let videos: TikTokVideo[] = [];
  let authorStats;
  
  // If itemList is available, the first item usually contains the author details too
  if (response.data?.itemList && response.data.itemList.length > 0) {
    const firstItem = response.data.itemList[0];
    // Use author info from the first video if the owner information is incomplete
    if (!userInfo || !userInfo.unique_id) {
      userInfo = {
        uid: firstItem.author.id,
        nickname: firstItem.author.nickname,
        signature: firstItem.author.signature,
        avatar_thumb: {
          url_list: [firstItem.author.avatarThumb]
        },
        unique_id: firstItem.author.uniqueId,
        verified: firstItem.author.verified
      };
      
      authorStats = firstItem.authorStats;
      
      // If we got authorStats from the first item, use it for user stats
      if (authorStats) {
        userStats = {
          followerCount: authorStats.followerCount,
          followingCount: authorStats.followingCount,
          heartCount: authorStats.heartCount,
          videoCount: authorStats.videoCount,
          diggCount: authorStats.diggCount
        };
      }
    }
    
    // Map videos from the itemList
    videos = response.data.itemList.map(item => {
      // Extract the correct date
      const createTimeIso = item.createTime 
        ? new Date(item.createTime * 1000).toISOString() 
        : undefined;
      
      return {
        id: item.id,
        title: item.desc || '',
        description: item.desc || '',
        thumbnail: item.video.cover || item.video.originCover || '',
        coverUrl: item.video.cover || '',
        playUrl: item.video.playAddr || '',
        views: item.stats.playCount || 0,
        likeCount: item.stats.diggCount || 0,
        commentCount: item.stats.commentCount || 0,
        shareCount: item.stats.shareCount || 0,
        viewCount: item.stats.playCount || 0,
        createTime: createTimeIso,
        duration: item.video.duration || 0,
        stats: {
          playCount: item.stats.playCount || 0,
          likeCount: item.stats.diggCount || 0,
          commentCount: item.stats.commentCount || 0,
          shareCount: item.stats.shareCount || 0
        },
        displayStats: {
          plays: formatNumber(item.stats.playCount || 0),
          likes: formatNumber(item.stats.diggCount || 0),
          comments: formatNumber(item.stats.commentCount || 0),
          shares: formatNumber(item.stats.shareCount || 0)
        }
      };
    });
  }
  
  if (!userInfo) {
    throw new Error('User data is incomplete or missing');
  }
  
  // Determine total likes from the most reliable source
  const totalLikes = authorStats?.heartCount || 
                    userStats.heartCount || 
                    userInfo.total_favorited || 
                    userInfo.hearts || 
                    userStats.diggCount || 
                    0;
  
  // Map the profile data to our standardized structure
  const profile: TikTokProfile = {
    id: userInfo.uid || '',
    uniqueId: userInfo.unique_id || '',
    username: userInfo.unique_id || '',
    nickname: userInfo.nickname || '',
    displayName: userInfo.nickname || '',
    avatar: userInfo.avatar_thumb?.url_list?.[0] || '',
    bio: userInfo.signature || '',
    verified: userInfo.verified || false,
    followers: userInfo.follower_count || userStats.followerCount || authorStats?.followerCount || 0,
    following: userInfo.following_count || userStats.followingCount || authorStats?.followingCount || 0,
    likes: totalLikes,
    videoCount: userInfo.video_count || userStats.videoCount || authorStats?.videoCount || videos.length,
    videos: videos,
    displayStats: {
      followers: formatNumber(userInfo.follower_count || userStats.followerCount || authorStats?.followerCount || 0),
      following: formatNumber(userInfo.following_count || userStats.followingCount || authorStats?.followingCount || 0),
      likes: formatNumber(totalLikes),
      posts: formatNumber(userInfo.video_count || userStats.videoCount || authorStats?.videoCount || videos.length)
    }
  };
  
  console.log('Mapped profile:', profile);
  return profile;
};
