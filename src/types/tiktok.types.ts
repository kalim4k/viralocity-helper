
/**
 * RapidAPI Response structure for TikTok user data
 */
export interface RapidAPIResponse {
  status: number;
  data: {
    owner: {
      user_info: {
        uid: string;
        nickname: string;
        signature?: string;
        avatar_thumb: {
          uri?: string;
          url_list: string[];
          width?: number;
          height?: number;
        };
        follower_count: number;
        total_favorited?: number;
        heart?: number;
        heartCount?: number;
        unique_id: string;
      }
    };
    itemList?: Array<{
      id: string;
      desc: string;
      stats: {
        playCount: number;
        diggCount: number;
        commentCount: number;
        shareCount: number;
      };
      video: {
        cover: string;
        dynamicCover: string;
        originCover: string;
        duration: number;
      };
    }>;
    cursor?: string;
    extra?: any;
    hasMore?: boolean;
  }
}

/**
 * Configuration for TikTok API
 */
export interface TikTokApiConfig {
  apiKey: string;
  apiHost: string;
}

/**
 * Recommendation for a TikTok profile
 */
export interface ProfileRecommendation {
  title: string;
  description: string;
}

/**
 * Analysis result for a TikTok profile
 */
export interface TikTokProfileAnalysis {
  strengths: string[];
  improvements: string[];
  recommendations: ProfileRecommendation[];
  optimizedBio: string;
}

/**
 * TikTok user profile structure
 */
export interface TikTokProfile {
  id: string;
  uniqueId: string;
  username?: string;
  displayName?: string;
  nickname?: string;
  avatar: string;
  avatarUrl?: string;
  bio?: string;
  verified?: boolean;
  followers: number;
  following?: number;
  likes: number;
  videoCount?: number;
  engagementRate?: number;
  displayStats?: {
    followers: string;
    following: string;
    likes: string;
    posts: string;
  };
  videos: TikTokVideo[];
}

/**
 * TikTok video structure
 */
export interface TikTokVideo {
  id: string;
  description?: string;
  title?: string;
  createTime?: number;
  coverUrl?: string;
  thumbnail?: string;
  videoUrl?: string;
  shareUrl?: string;
  views: number;
  stats?: {
    playCount?: number;
    commentCount?: number;
    shareCount?: number;
    likeCount?: number;
  };
  displayStats?: {
    comments?: string;
    plays?: string;
    shares?: string;
    likes?: string;
  };
}
