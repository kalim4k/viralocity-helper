
import { toast } from "sonner";
import {
  TikTokTrendingVideosResponse,
  TikTokTrendingCreatorsResponse,
  TikTokTrendingSongsResponse,
  TikTokTrendingHashtagsResponse,
  TrendingVideo,
  TrendingCreator,
  TrendingSong,
  TrendingHashtag
} from "@/types/tiktokTrends.types";

/**
 * Configuration for the TikTok Trends API client
 */
const apiConfig = {
  apiKey: "7a0b675b39mshd26944ac6b0aa53p1af42bjsna1c8d9c8a89b", // Demo API key - replace with your own in production
  apiHost: "tiktok-trending.p.rapidapi.com",
  baseUrl: "https://tiktok-trending.p.rapidapi.com"
};

/**
 * Headers configuration for the API requests
 */
const headers = {
  'X-RapidAPI-Key': apiConfig.apiKey,
  'X-RapidAPI-Host': apiConfig.apiHost,
  'Content-Type': 'application/json'
};

/**
 * Fetches trending videos from the TikTok API
 * @param region Region code (e.g., 'US', 'FR')
 * @returns API response with trending videos data
 */
export const fetchTrendingVideos = async (region: string = "FR"): Promise<TrendingVideo[]> => {
  try {
    console.log(`Fetching real trending videos for region: ${region}`);
    
    const response = await fetch(`${apiConfig.baseUrl}/feed/trending?region=${region}`, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Real trending videos API response:', data);
    
    // In case the real API returns data in a different format than expected
    // Transform the data to match our TrendingVideo type
    if (data && Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item.id || item.item_id || `video-${Math.random().toString(36).substr(2, 9)}`,
        title: item.title || item.description || item.desc || '',
        description: item.description || item.desc || '',
        coverUrl: item.cover_url || item.cover || item.coverUrl || '',
        playUrl: item.play_url || item.playUrl || item.video_url || '',
        cover: item.cover || item.cover_url || item.coverUrl || '',
        item_url: item.item_url || item.itemUrl || item.share_url || '',
        region: region,
        duration: item.duration || 15,
        likeCount: item.like_count || item.digg_count || item.stats?.diggCount || 0,
        commentCount: item.comment_count || item.stats?.commentCount || 0,
        shareCount: item.share_count || item.stats?.shareCount || 0,
        viewCount: item.view_count || item.play_count || item.stats?.playCount || 0,
        createTime: item.create_time || new Date().toISOString(),
        author: {
          username: item.author?.uniqueId || item.author?.username || '',
          nickname: item.author?.nickname || '',
          avatarUrl: item.author?.avatarThumb || item.author?.avatarUrl || ''
        }
      }));
    }
    
    // If real API call fails, fallback to mock data with an error toast
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
 * Fetches trending creators from the TikTok API
 * @param region Region code (e.g., 'US', 'FR')
 * @returns API response with trending creators data
 */
export const fetchTrendingCreators = async (region: string = "FR"): Promise<TrendingCreator[]> => {
  try {
    console.log(`Fetching real trending creators for region: ${region}`);
    
    const response = await fetch(`${apiConfig.baseUrl}/user/trending?region=${region}`, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Real trending creators API response:', data);
    
    // Transform the data to match our TrendingCreator type
    if (data && Array.isArray(data)) {
      return data.map((creator: any) => ({
        username: creator.unique_id || creator.uniqueId || creator.username || '',
        nickname: creator.nickname || creator.nick_name || '',
        avatarUrl: creator.avatar_thumb || creator.avatar_url || creator.avatarUrl || '',
        avatar_url: creator.avatar_thumb || creator.avatar_url || creator.avatarUrl || '',
        nick_name: creator.nickname || creator.nick_name || '',
        tt_link: creator.tt_link || creator.share_url || `https://www.tiktok.com/@${creator.unique_id || creator.uniqueId || creator.username}`,
        followerCount: creator.follower_count || creator.followers || creator.followerCount || 0,
        follower_cnt: creator.follower_count || creator.followers || creator.followerCount || 0,
        followingCount: creator.following_count || creator.following || creator.followingCount || 0,
        likeCount: creator.like_count || creator.likes || creator.heart_count || 0,
        bio: creator.signature || creator.bio || '',
        verified: creator.verified || false,
        user_id: creator.user_id || creator.id || '',
        items: creator.items || creator.videos || []
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
 * Fetches trending songs from the TikTok API
 * @param region Region code (e.g., 'US', 'FR')
 * @returns API response with trending songs data
 */
export const fetchTrendingSongs = async (region: string = "FR"): Promise<TrendingSong[]> => {
  try {
    console.log(`Fetching real trending songs for region: ${region}`);
    
    const response = await fetch(`${apiConfig.baseUrl}/music/trending?region=${region}`, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Real trending songs API response:', data);
    
    // Transform data to match our TrendingSong type
    if (data && Array.isArray(data)) {
      return data.map((song: any, index: number) => ({
        id: song.id || song.music_id || `song-${Math.random().toString(36).substr(2, 9)}`,
        title: song.title || song.music_title || '',
        coverUrl: song.cover_url || song.cover_large || song.coverUrl || '',
        playUrl: song.play_url || song.music_url || song.playUrl || '',
        cover: song.cover || song.cover_url || song.coverUrl || '',
        link: song.link || song.share_url || '',
        clip_id: song.clip_id || song.id || '',
        artist: song.artist || song.author || '',
        author: song.author || song.artist || '',
        rank: index + 1,
        usageCount: song.usage_count || song.video_count || 0
      }));
    }
    
    // Fallback to mock data
    console.warn('API response not in expected format, falling back to mock data');
    toast.error("Format de données inattendu, utilisation de données de démonstration");
    return generateMockSongs(region);
    
  } catch (error) {
    console.error('Error fetching trending songs:', error);
    toast.error("Erreur lors de la récupération des chansons tendance, utilisation de données de démonstration");
    
    // Return mock data as fallback
    return generateMockSongs(region);
  }
};

/**
 * Fetches trending hashtags from the TikTok API
 * @param region Region code (e.g., 'US', 'FR')
 * @returns API response with trending hashtags data
 */
export const fetchTrendingHashtags = async (region: string = "FR"): Promise<TrendingHashtag[]> => {
  try {
    console.log(`Fetching real trending hashtags for region: ${region}`);
    
    const response = await fetch(`${apiConfig.baseUrl}/hashtag/trending?region=${region}`, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Real trending hashtags API response:', data);
    
    // Transform data to match our TrendingHashtag type
    if (data && Array.isArray(data)) {
      return data.map((hashtag: any, index: number) => ({
        id: hashtag.id || hashtag.cid || `hashtag-${Math.random().toString(36).substr(2, 9)}`,
        name: hashtag.name || hashtag.title || hashtag.hashtag_name || '',
        hashtag_name: hashtag.hashtag_name || hashtag.name || hashtag.title || '',
        hashtag_id: hashtag.hashtag_id || hashtag.id || hashtag.cid || '',
        rank: index + 1,
        videoCount: hashtag.video_count || hashtag.publish_cnt || 0,
        publish_cnt: hashtag.publish_cnt || hashtag.video_count || 0,
        video_views: hashtag.video_views || hashtag.view_count || 0,
        viewCount: hashtag.view_count || hashtag.video_views || 0,
        creators: hashtag.creators || []
      }));
    }
    
    // Fallback to mock data
    console.warn('API response not in expected format, falling back to mock data');
    toast.error("Format de données inattendu, utilisation de données de démonstration");
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
