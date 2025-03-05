
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

// Types exportés pour l'usage dans les composants
export type { TrendingVideo, TrendingCreator };
