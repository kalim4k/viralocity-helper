
import { TikTokProfile } from '@/components/TikTokConnectModal';

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
