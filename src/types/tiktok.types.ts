
export interface TikTokProfile {
  id: string;
  uniqueId: string;
  username: string;
  nickname: string;
  displayName: string;
  avatar: string;
  bio?: string;
  verified?: boolean;
  followers: number;
  following?: number;
  likes: number;
  videoCount?: number;
  videos: TikTokVideo[];
  displayStats?: {
    followers: string;
    following: string;
    likes: string;
    posts: string;
  };
}

export interface TikTokVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  coverUrl?: string;
  playUrl?: string;
  views: number;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  viewCount?: number;
  createTime?: string;
  duration?: number;
  stats?: {
    playCount: number;
    likeCount: number;
    commentCount: number;
    shareCount: number;
  };
  displayStats?: {
    plays: string;
    likes: string;
    comments: string;
    shares: string;
  };
}

export interface RapidAPIResponse {
  status: number;
  data?: {
    owner?: {
      user_info?: {
        uid: string;
        nickname: string;
        signature?: string;
        avatar_thumb?: {
          url_list?: string[];
        };
        follower_count?: number;
        following_count?: number;
        total_favorited?: number;
        video_count?: number;
        unique_id: string;
        verified?: boolean;
        hearts?: number;
      };
      stats?: {
        followerCount?: number;
        followingCount?: number;
        heartCount?: number;
        videoCount?: number;
        diggCount?: number;
      };
    };
    cursor?: string;
    hasMore?: boolean;
    itemList?: Array<{
      id: string;
      desc: string;
      createTime?: number;
      author?: {
        id: string;
        uniqueId: string;
        nickname: string;
        avatarThumb: string;
        avatarMedium: string;
        avatarLarger: string;
        signature: string;
        verified: boolean;
        secUid: string;
      };
      authorStats?: {
        followerCount: number;
        followingCount: number;
        heartCount: number;
        videoCount: number;
        diggCount: number;
      };
      stats: {
        playCount: number;
        diggCount: number;
        commentCount: number;
        shareCount: number;
      };
      video: {
        id?: string;
        cover: string;
        originCover?: string;
        playAddr?: string;
        dynamicCover?: string;
        duration?: number;
        width?: number;
        height?: number;
      };
    }>;
  };
  userInfo?: any;
  items?: any[];
}

export interface TikTokApiConfig {
  apiKey: string;
  apiHost: string;
  baseUrl: string;
}

export interface TikTokProfileAnalysis {
  strengths: string[];
  improvements: string[];
  recommendations: {
    title: string;
    description: string;
  }[];
  optimizedBio: string;
}
