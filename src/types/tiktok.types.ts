
export interface TikTokProfile {
  username: string;
  nickname: string;
  avatarUrl: string;
  followerCount: number;
  followingCount: number;
  likeCount: number;
  bio: string;
  verified: boolean;
  videos: TikTokVideo[];
}

export interface TikTokVideo {
  id: string;
  description: string;
  coverUrl: string;
  playUrl: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  createTime: string;
  duration: number;
}

export interface RapidAPIResponse {
  status: number;
  statusText?: string;
  userInfo?: any;
  items?: any[];
}
