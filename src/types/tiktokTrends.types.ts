// Remove the import that caused problems
// export { TrendingVideo, TrendingCreator, TrendingSong, TrendingHashtag } from '../components/CountrySelector';

// Just keep the existing types without re-exporting them
export interface TrendingVideo {
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
  author: {
    username: string;
    nickname: string;
    avatarUrl: string;
  };
}

export interface TrendingCreator {
  username: string;
  nickname: string;
  avatarUrl: string;
  followerCount: number;
  followingCount: number;
  likeCount: number;
  bio: string;
  verified: boolean;
}

export interface TrendingSong {
  id: string;
  title: string;
  coverUrl: string;
  playUrl: string;
  artist: string;
  usageCount: number;
}

export interface TrendingHashtag {
  id: string;
  name: string;
  videoCount: number;
  viewCount: number;
}
