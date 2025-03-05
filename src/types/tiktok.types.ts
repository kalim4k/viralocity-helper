
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
  statusText?: string;
  userInfo?: any;
  items?: any[];
  data?: {
    owner?: {
      user_info?: any;
    };
    itemList?: any[];
  };
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
