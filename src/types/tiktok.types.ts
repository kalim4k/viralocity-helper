
import { TikTokProfile } from '@/components/TikTokConnectModal';

/**
 * RapidAPI Response structure for TikTok user data
 */
export interface RapidAPIResponse {
  status: number;
  data: {
    user_list: Array<{
      user_info: {
        uid: string;
        nickname: string;
        signature?: string;
        avatar_thumb: {
          url_list: string[];
        };
        follower_count: number;
        total_favorited?: number;
        unique_id: string;
      }
    }>;
  }
}

/**
 * Configuration for TikTok API
 */
export interface TikTokApiConfig {
  apiKey: string;
  apiHost: string;
}
