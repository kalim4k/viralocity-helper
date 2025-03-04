
/**
 * Types pour les données de vidéo TikTok récupérées via RapidAPI
 */

export interface TikTokVideoResponse {
  status: number;
  data: {
    owner: TikTokVideoOwner;
    item: TikTokVideoItem;
  };
}

export interface TikTokVideoOwner {
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
}

export interface TikTokVideoItem {
  id: string;
  desc: string;
  createTime: string;
  video: {
    id: string;
    height: number;
    width: number;
    duration: number;
    ratio: string;
    cover: string;
    originCover: string;
    dynamicCover: string;
    playAddr: string;
    downloadAddr: string;
    shareCover: string[];
    reflowCover: string;
    bitrate: number;
  };
  author: string;
  music: {
    id: string;
    title: string;
    playUrl: string;
    coverLarge: string;
    coverMedium: string;
    coverThumb: string;
    authorName: string;
    original: boolean;
    duration: number;
  };
  stats: {
    diggCount: number;
    shareCount: number;
    commentCount: number;
    playCount: number;
    collectCount: string | number;
  };
  originalItem: boolean;
  officalItem: boolean;
  secret: boolean;
  forFriend: boolean;
  digged: boolean;
  itemCommentStatus: number;
  duetEnabled: boolean;
  stitchEnabled: boolean;
  shareEnabled: boolean;
  contents?: {
    desc: string;
    textExtra?: any[];
  }[];
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
  duration: number;
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
