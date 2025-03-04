/**
 * Types pour les données de vidéo TikTok récupérées via RapidAPI
 */

export interface TikTokVideoResponse {
  video_id: string;
  details: {
    video_id: string;
    description: string;
    create_time: string;
    author: {
      id: string;
      shortId: string;
      uniqueId: string;
      nickname: string;
      avatarLarger: string;
      avatarMedium: string;
      avatarThumb: string;
      signature: string;
      createTime: number;
      verified: boolean;
      secUid: string;
      ftc: boolean;
      relation: number;
      openFavorite: boolean;
      commentSetting: number;
      duetSetting: number;
      stitchSetting: number;
      privateAccount: boolean;
      secret: boolean;
      isADVirtual: boolean;
      roomId: string;
      downloadSetting: number;
      isEmbedBanned: boolean;
    };
    author_id: string;
    author_name: string;
    statistics: {
      number_of_comments: number;
      number_of_hearts: number;
      number_of_plays: number;
      number_of_reposts: number;
    };
    cover: string;
    download_url: string;
    unwatermarked_download_url?: string;
    video_definition: string;
    duration: number;
    avatar_thumb: string;
  };
  type: string;
}

export interface TikTokProcessedVideo {
  id: string;
  url: string;
  username: string;
  nickname: string;
  userAvatar: string;
  description: string;
  cover: string;
  playUrl: string;
  downloadUrl: string;
  unwatermarkedUrl?: string;
  duration: number;
  isVerified: boolean;
  stats: {
    likes: number;
    shares: number;
    comments: number;
    views: number;
    saves: number;
  };
  musicInfo: {
    title: string;
    author: string;
    isOriginal: boolean;
  };
  createdAt: string;
}

export interface VideoAnalysisMetrics {
  engagementRate: number;
  completionRate: number;
  hookScore: number;
  viralityScore: number;
}

export interface VideoAnalysisRecommendation {
  title: string;
  description: string;
  category: 'hook' | 'engagement' | 'hashtags' | 'audio' | 'editing' | 'callToAction';
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

export interface VideoAnalysisResult {
  metrics: VideoAnalysisMetrics;
  recommendations: VideoAnalysisRecommendation[];
  hashtags: string[];
  strengths: string[];
  weaknesses: string[];
}
