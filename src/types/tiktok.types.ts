
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
    cursor?: string;
    extra?: any;
    hasMore?: boolean;
    itemList?: any[];
  }
}

/**
 * Configuration for TikTok API
 */
export interface TikTokApiConfig {
  apiKey: string;
  apiHost: string;
}
