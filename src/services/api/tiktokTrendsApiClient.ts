
import { toast } from "sonner";
import {
  TrendingVideo,
  TrendingCreator,
  TrendingSong,
  TrendingHashtag
} from "@/types/tiktokTrends.types";

/**
 * Configuration for the TikTok Trends API client
 */
const apiConfig = {
  apiKey: "bd18f4b949msh6edd4e1d444b6a0p18d393jsnf0169527896e", // API key from RapidAPI
  apiHost: "tiktok-creative-center-api.p.rapidapi.com",
  baseUrl: "https://tiktok-creative-center-api.p.rapidapi.com"
};

/**
 * Headers configuration for the API requests
 */
const headers = {
  'x-rapidapi-key': apiConfig.apiKey,
  'x-rapidapi-host': apiConfig.apiHost,
  'Content-Type': 'application/json'
};

/**
 * Fetches trending videos from the TikTok Creative Center API
 * @param region Region code (e.g., 'US', 'FR')
 * @returns Array of trending videos
 */
export const fetchTrendingVideos = async (region: string = "US"): Promise<TrendingVideo[]> => {
  try {
    console.log(`Fetching trending videos for region: ${region}`);
    
    const response = await fetch(`${apiConfig.baseUrl}/api/trending/video?page=1&limit=20&period=30&order_by=vv&country=${region}`, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Trending videos API response:', data);
    
    if (data && data.code === 0 && data.data && Array.isArray(data.data.videos)) {
      return data.data.videos.map((video: any) => ({
        id: video.id || video.item_id || `video-${Math.random().toString(36).substr(2, 9)}`,
        title: video.title || '',
        description: video.title || '', // Using title as description since API doesn't provide separate description
        coverUrl: video.cover || '',
        playUrl: video.item_url || '',
        cover: video.cover || '',
        item_url: video.item_url || '',
        region: video.region || region,
        duration: video.duration || 0,
        likeCount: 0, // Not provided by the API
        commentCount: 0, // Not provided by the API
        shareCount: 0, // Not provided by the API
        viewCount: 0, // Not provided by the API
        createTime: new Date().toISOString(),
        author: {
          username: '', // Not provided by the API
          nickname: '', // Not provided by the API
          avatarUrl: '' // Not provided by the API
        }
      }));
    }
    
    // If API response format is unexpected, fall back to mock data
    console.warn('API response not in expected format, falling back to mock data');
    toast.error("Format de données inattendu, utilisation de données de démonstration");
    return generateMockVideos(region);
    
  } catch (error) {
    console.error('Error fetching trending videos:', error);
    toast.error("Erreur lors de la récupération des vidéos tendance, utilisation de données de démonstration");
    
    // Return mock data as fallback
    return generateMockVideos(region);
  }
};

/**
 * Fetches trending creators from the TikTok Creative Center API
 * @param region Region code (e.g., 'US', 'FR')
 * @returns Array of trending creators
 */
export const fetchTrendingCreators = async (region: string = "US"): Promise<TrendingCreator[]> => {
  try {
    console.log(`Fetching trending creators for region: ${region}`);
    
    const response = await fetch(`${apiConfig.baseUrl}/api/trending/creator?page=1&limit=20&sort_by=follower&country=${region}`, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Trending creators API response:', data);
    
    if (data && data.code === 0 && data.data && Array.isArray(data.data.creators)) {
      return data.data.creators.map((creator: any) => ({
        username: creator.nick_name || '',
        nickname: creator.nick_name || '',
        avatarUrl: creator.avatar_url || '',
        avatar_url: creator.avatar_url || '',
        nick_name: creator.nick_name || '',
        tt_link: creator.tt_link || '',
        followerCount: creator.follower_cnt || 0,
        follower_cnt: creator.follower_cnt || 0,
        followingCount: 0, // Not provided by API
        likeCount: creator.liked_cnt || 0,
        bio: '', // Not provided by API
        verified: false, // Not provided by API
        user_id: creator.user_id || creator.tcm_id || '',
        items: Array.isArray(creator.items) 
          ? creator.items.map((item: any) => ({
              item_id: item.item_id || '',
              cover_url: item.cover_url || '',
              vv: item.vv || 0
            })) 
          : []
      }));
    }
    
    // Fallback to mock data
    console.warn('API response not in expected format, falling back to mock data');
    toast.error("Format de données inattendu, utilisation de données de démonstration");
    return generateMockCreators(region);
    
  } catch (error) {
    console.error('Error fetching trending creators:', error);
    toast.error("Erreur lors de la récupération des créateurs tendance, utilisation de données de démonstration");
    
    // Return mock data as fallback
    return generateMockCreators(region);
  }
};

/**
 * Fetches trending songs (still using mock data as not available in the new API)
 * @param region Region code (e.g., 'US', 'FR')
 * @returns Array of trending songs
 */
export const fetchTrendingSongs = async (region: string = "US"): Promise<TrendingSong[]> => {
  try {
    console.log(`Fetching trending songs for region: ${region}`);
    // Since the new API doesn't provide trending songs, we'll use mock data
    console.warn('API for trending songs not available, using mock data');
    toast.info("API pour les sons tendance non disponible, utilisation de données de démonstration");
    return generateMockSongs(region);
    
  } catch (error) {
    console.error('Error fetching trending songs:', error);
    toast.error("Erreur lors de la récupération des chansons tendance, utilisation de données de démonstration");
    
    // Return mock data as fallback
    return generateMockSongs(region);
  }
};

/**
 * Fetches trending hashtags (still using mock data as not available in the new API)
 * @param region Region code (e.g., 'US', 'FR')
 * @returns Array of trending hashtags
 */
export const fetchTrendingHashtags = async (region: string = "US"): Promise<TrendingHashtag[]> => {
  try {
    console.log(`Fetching trending hashtags for region: ${region}`);
    // Since the new API doesn't provide trending hashtags, we'll use mock data
    console.warn('API for trending hashtags not available, using mock data');
    toast.info("API pour les hashtags tendance non disponible, utilisation de données de démonstration");
    return generateMockHashtags(region);
    
  } catch (error) {
    console.error('Error fetching trending hashtags:', error);
    toast.error("Erreur lors de la récupération des hashtags tendance, utilisation de données de démonstration");
    
    // Return mock data as fallback
    return generateMockHashtags(region);
  }
};

// Mock data generation functions as fallback
const generateMockVideos = (region: string): TrendingVideo[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `video${i + 1}`,
    title: `Vidéo tendance #${i + 1} - ${region}`,
    description: `Description de la vidéo tendance #${i + 1}`,
    coverUrl: `https://placehold.co/800x1400/4f46e5/ffffff?text=Trend${i + 1}`,
    playUrl: "#",
    cover: `https://placehold.co/800x1400/4f46e5/ffffff?text=Trend${i + 1}`,
    item_url: "#",
    region: region,
    duration: 15 + Math.floor(Math.random() * 45),
    likeCount: 10000 + Math.floor(Math.random() * 990000),
    commentCount: 1000 + Math.floor(Math.random() * 9000),
    shareCount: 500 + Math.floor(Math.random() * 4500),
    viewCount: 100000 + Math.floor(Math.random() * 9900000),
    createTime: new Date().toISOString(),
    author: {
      username: `user${i + 1}`,
      nickname: `Creator ${i + 1}`,
      avatarUrl: `https://placehold.co/200x200/4f46e5/ffffff?text=C${i + 1}`
    }
  }));
};

const generateMockCreators = (region: string): TrendingCreator[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    username: `creator${i + 1}`,
    nickname: `Creator ${i + 1}`,
    avatarUrl: `https://placehold.co/200x200/4f46e5/ffffff?text=C${i + 1}`,
    avatar_url: `https://placehold.co/200x200/4f46e5/ffffff?text=C${i + 1}`,
    nick_name: `Creator ${i + 1}`,
    tt_link: "#",
    followerCount: 100000 + Math.floor(Math.random() * 900000),
    follower_cnt: 100000 + Math.floor(Math.random() * 900000),
    followingCount: 500 + Math.floor(Math.random() * 500),
    likeCount: 1000000 + Math.floor(Math.random() * 9000000),
    bio: "Créateur de contenu | Lifestyle & Tech",
    verified: Math.random() > 0.7,
    user_id: `user${i + 1}`,
    items: Array.from({ length: 3 }, (_, j) => ({
      item_id: `video${i + 1}_${j + 1}`,
      cover_url: `https://placehold.co/800x1400/4f46e5/ffffff?text=V${i + 1}_${j + 1}`,
      vv: 50000 + Math.floor(Math.random() * 450000)
    }))
  }));
};

const generateMockSongs = (region: string): TrendingSong[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `song${i + 1}`,
    title: `Chanson tendance #${i + 1}`,
    coverUrl: `https://placehold.co/800x800/4f46e5/ffffff?text=Song${i + 1}`,
    playUrl: "#",
    cover: `https://placehold.co/800x800/4f46e5/ffffff?text=Song${i + 1}`,
    link: "#",
    clip_id: `clip${i + 1}`,
    artist: `Artist ${i + 1}`,
    author: `Artist ${i + 1}`,
    rank: i + 1,
    usageCount: 5000 + Math.floor(Math.random() * 45000)
  }));
};

const generateMockHashtags = (region: string): TrendingHashtag[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `hashtag${i + 1}`,
    name: `hashtag${i + 1}`,
    hashtag_name: `hashtag${i + 1}`,
    hashtag_id: `hash${i + 1}`,
    rank: i + 1,
    videoCount: 10000 + Math.floor(Math.random() * 990000),
    publish_cnt: 10000 + Math.floor(Math.random() * 990000),
    video_views: 1000000 + Math.floor(Math.random() * 99000000),
    viewCount: 1000000 + Math.floor(Math.random() * 99000000),
    creators: Array.from({ length: 5 }, (_, j) => ({
      avatar_url: `https://placehold.co/200x200/4f46e5/ffffff?text=C${j + 1}`,
      nick_name: `Creator ${j + 1}`
    }))
  }));
};
