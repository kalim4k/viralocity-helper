
/**
 * Types pour l'API de tendances TikTok
 */

// Vidéo en tendance
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

// Réponse API pour les vidéos en tendance
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
  }
}

// Vidéo d'un créateur
export interface CreatorVideo {
  item_id: string;
  cover_url: string;
  tt_link: string;
  vv: number; // views
  liked_cnt: number;
  create_time: number;
}

// Créateur en tendance
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
  items: CreatorVideo[];
}

// Réponse API pour les créateurs en tendance
export interface TikTokTrendingCreatorsResponse {
  code: number;
  msg: string;
  request_id: string;
  data: {
    creators: TrendingCreator[];
  }
}

// Point de données pour un graphique de tendance
export interface TrendPoint {
  time: number;
  value: number;
}

// Élément associé pour les sons et hashtags
export interface RelatedItem {
  item_id: number | string;
  cover_uri: string;
}

// Son en tendance
export interface TrendingSong {
  author: string;
  clip_id: string;
  country_code: string;
  cover: string;
  duration: number;
  link: string;
  rank: number;
  song_id: string;
  title: string;
  trend: TrendPoint[];
  url_title: string;
  related_items: RelatedItem[] | null;
}

// Réponse API pour les sons en tendance
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
  }
}

// Créateur associé à un hashtag
export interface HashtagCreator {
  nick_name: string;
  avatar_url: string;
}

// Hashtag en tendance
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
  trend: TrendPoint[];
  creators: HashtagCreator[];
  publish_cnt: number;
  video_views: number;
  rank: number;
  rank_diff: number;
  rank_diff_type: number;
}

// Réponse API pour les hashtags en tendance
export interface TikTokTrendingHashtagsResponse {
  code: number;
  msg: string;
  request_id: string;
  data: {
    list: TrendingHashtag[];
  }
}

// Types exportés pour l'usage dans les composants
export { TrendingVideo, TrendingCreator, TrendingSong, TrendingHashtag };
