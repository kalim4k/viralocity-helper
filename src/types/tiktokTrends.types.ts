
// Import necessary types
import { CountryInfo } from '../components/CountrySelector';

/**
 * Response structure for trending videos
 */
export interface TikTokTrendingVideosResponse {
  code: number;
  msg: string;
  request_id: string;
  data: {
    pagination: {
      has_more: boolean;
      limit: number;
      page: number;
      total_count: number;
    };
    videos: TrendingVideo[];
  };
}

/**
 * Response structure for trending creators
 */
export interface TikTokTrendingCreatorsResponse {
  code: number;
  msg: string;
  request_id: string;
  data: {
    creators: TrendingCreator[];
  };
}

/**
 * Response structure for trending songs
 */
export interface TikTokTrendingSongsResponse {
  code: number;
  msg: string;
  request_id: string;
  data: {
    pagination: {
      page: number;
      size: number;
      total: number;
      has_more: boolean;
    };
    sound_list: TrendingSong[];
  };
}

/**
 * Response structure for trending hashtags
 */
export interface TikTokTrendingHashtagsResponse {
  code: number;
  msg: string;
  request_id: string;
  data: {
    list: TrendingHashtag[];
  };
}

/**
 * Trending video structure
 */
export interface TrendingVideo {
  country_code: string;
  cover: string;
  duration: number;
  id: string;
  item_id: string;
  item_url: string;
  region: string;
  title: string;
}

/**
 * Trending creator structure
 */
export interface TrendingCreator {
  tcm_id: string;
  user_id: string;
  nick_name: string;
  avatar_url: string;
  country_code: string;
  follower_cnt: number;
  liked_cnt: number;
  tt_link: string;
  tcm_link: string;
  items: Array<{
    item_id: string;
    cover_url: string;
    tt_link: string;
    vv: number;
    liked_cnt: number;
    create_time: number;
  }>;
}

/**
 * Trending song structure
 */
export interface TrendingSong {
  author: string;
  clip_id: string;
  country_code: string;
  cover: string;
  duration: number;
  if_cml: boolean;
  is_search: boolean;
  link: string;
  on_list_times: number | null;
  promoted: boolean;
  rank: number;
  rank_diff: number | null;
  rank_diff_type: number;
  related_items: Array<{
    item_id: number;
    cover_uri: string;
  }> | null;
  song_id: string;
  title: string;
  trend: Array<{
    time: number;
    value: number;
  }>;
  url_title: string;
}

/**
 * Trending hashtag structure
 */
export interface TrendingHashtag {
  hashtag_id: string;
  hashtag_name: string;
  country_info: {
    id: string;
    value: string;
    label: string;
  };
  industry_info?: {
    id: number;
    value: string;
    label: string;
  };
  is_promoted: boolean;
  trend: Array<{
    time: number;
    value: number;
  }>;
  creators: Array<{
    nick_name: string;
    avatar_url: string;
  }>;
  publish_cnt: number;
  video_views: number;
  rank: number;
  rank_diff: number;
  rank_diff_type: number;
}

/**
 * Trend data point structure
 */
export interface TrendDataPoint {
  time: number;
  value: number;
}

/**
 * TikTok trends interface for combined trends display
 */
export interface TikTokTrends {
  videos: TrendingVideo[];
  creators: TrendingCreator[];
  songs: TrendingSong[];
  hashtags: TrendingHashtag[];
  selectedCountry: CountryInfo;
  isLoading: boolean;
  error: string | null;
}

// Using export type to avoid conflicts with TS isolatedModules
export type { TrendingVideo, TrendingCreator, TrendingSong, TrendingHashtag };
