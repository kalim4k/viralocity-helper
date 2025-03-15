
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
  
  // Extract user info and stats from the API structure - handling different possible structures
  const userInfo = response.data?.owner?.user_info || {};
  const userStats = response.data?.owner?.stats || 
                    response.data?.authorStats || 
                    response.data?.stats || 
                    {};
  
  if (!userInfo && !response.data?.user) {
    throw new Error('User data is incomplete or missing');
  }
  
  // Support for different API response formats
  const user = {
    id: userInfo.uid || userInfo.id || response.data?.user?.id || '',
    uniqueId: userInfo.unique_id || userInfo.uniqueId || response.data?.user?.uniqueId || '',
    nickname: userInfo.nickname || response.data?.user?.nickname || '',
    avatar: userInfo.avatar_thumb?.url_list?.[0] || 
            userInfo.avatarThumb || 
            userInfo.avatarMedium || 
            response.data?.user?.avatarThumb || 
            response.data?.user?.avatarMedium || '',
    signature: userInfo.signature || response.data?.user?.signature || '',
    verified: userInfo.verified || response.data?.user?.verified || false,
    // Support multiple possible field names for statistics
    followerCount: userInfo.follower_count || 
                  userStats.followerCount || 
                  response.data?.stats?.followerCount || 
                  0,
    followingCount: userInfo.following_count || 
                   userStats.followingCount || 
                   response.data?.stats?.followingCount || 
                   0,
    heartCount: userStats.heartCount || 
               userStats.heart || 
               userInfo.total_favorited || 
               userInfo.hearts || 
               userStats.diggCount || 
               0,
    videoCount: userInfo.video_count || 
               userStats.videoCount || 
               response.data?.stats?.videoCount || 
               0
  };
  
  // Extract videos from the API response with improved support for different field structures
  const videos: TikTokVideo[] = [];
  
  // Handle different possible locations of video items
  const itemList = response.data?.itemList || 
                   response.data?.videos || 
                   response.data?.items || 
                   [];
                   
  if (Array.isArray(itemList) && itemList.length > 0) {
    itemList.forEach(item => {
      if (!item) return;
      
      const video: TikTokVideo = {
        id: item.id || item.video_id || '',
        title: item.desc || item.title || '',
        description: item.desc || item.description || '',
        // Support different image field structures
        thumbnail: item.video?.cover || 
                  item.video?.originCover || 
                  item.cover || 
                  item.coverUrl || 
                  '',
        // Support different stats field structures
        views: item.stats?.playCount || 
              item.playCount || 
              item.play_count || 
              0,
        likeCount: item.stats?.diggCount || 
                  item.diggCount || 
                  item.like_count || 
                  0,
        commentCount: item.stats?.commentCount || 
                     item.commentCount || 
                     item.comment_count || 
                     0,
        shareCount: item.stats?.shareCount || 
                   item.shareCount || 
                   item.share_count || 
                   0,
        createTime: item.createTime ? 
                   new Date(typeof item.createTime === 'number' ? item.createTime * 1000 : item.createTime).toISOString() : 
                   undefined,
        stats: {
          playCount: item.stats?.playCount || 
                    item.playCount || 
                    item.play_count || 
                    0,
          likeCount: item.stats?.diggCount || 
                    item.diggCount || 
                    item.like_count || 
                    0,
          commentCount: item.stats?.commentCount || 
                       item.commentCount || 
                       item.comment_count || 
                       0,
          shareCount: item.stats?.shareCount || 
                     item.shareCount || 
                     item.share_count || 
                     0
        },
        displayStats: {
          plays: formatNumber(item.stats?.playCount || 
                            item.playCount || 
                            item.play_count || 
                            0),
          likes: formatNumber(item.stats?.diggCount || 
                            item.diggCount || 
                            item.like_count || 
                            0),
          comments: formatNumber(item.stats?.commentCount || 
                               item.commentCount || 
                               item.comment_count || 
                               0),
          shares: formatNumber(item.stats?.shareCount || 
                             item.shareCount || 
                             item.share_count || 
                             0)
        }
      };
      
      videos.push(video);
    });
  }
  
  // Map the profile data to our standardized structure
  const profile: TikTokProfile = {
    id: user.id,
    uniqueId: user.uniqueId,
    username: user.uniqueId,
    nickname: user.nickname,
    displayName: user.nickname,
    avatar: user.avatar,
    bio: user.signature,
    verified: user.verified,
    followers: user.followerCount,
    following: user.followingCount,
    likes: user.heartCount,
    videoCount: user.videoCount || videos.length,
    videos: videos,
    displayStats: {
      followers: formatNumber(user.followerCount),
      following: formatNumber(user.followingCount),
      likes: formatNumber(user.heartCount),
      posts: formatNumber(user.videoCount || videos.length)
    }
  };
  
  console.log('Mapped profile:', profile);
  return profile;
};
