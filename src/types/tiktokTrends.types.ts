
export interface TrendingVideo {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  playUrl: string;
  cover: string;
  item_url: string;
  region: string;
  duration: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  createTime: string;
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
  avatar_url: string;
  nick_name: string;
  tt_link: string;
  followerCount: number;
  follower_cnt: number;
  followingCount: number;
  likeCount: number;
  bio: string;
  verified: boolean;
  user_id: string;
  items: {
    item_id: string;
    cover_url: string;
    vv: number;
  }[];
}

export interface TrendingSong {
  id: string;
  title: string;
  coverUrl: string;
  playUrl: string;
  cover: string;
  link: string;
  clip_id: string;
  artist: string;
  author: string;
  rank: number;
  usageCount: number;
}

export interface TrendingHashtag {
  id: string;
  name: string;
  hashtag_name: string;
  hashtag_id: string;
  rank: number;
  videoCount: number;
  publish_cnt: number;
  video_views: number;
  viewCount: number;
  creators: {
    avatar_url: string;
    nick_name: string;
  }[];
}

export interface TikTokTrendingVideosResponse {
  data: TrendingVideo[];
}

export interface TikTokTrendingCreatorsResponse {
  data: TrendingCreator[];
}

export interface TikTokTrendingSongsResponse {
  data: TrendingSong[];
}

export interface TikTokTrendingHashtagsResponse {
  data: TrendingHashtag[];
}
