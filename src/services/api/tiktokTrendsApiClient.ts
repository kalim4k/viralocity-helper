
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
 * Fetches trending videos from the TikTok API
 * @param region Region code (e.g., 'US', 'FR')
 * @returns API response with trending videos data
 */
export const fetchTrendingVideos = async (region: string = "FR"): Promise<TrendingVideo[]> => {
  try {
    console.log(`Fetching trending videos for region: ${region}`);
    
    // For demo purposes, we'll use a mock response
    // In a real application, this would make an actual API call
    
    // Mock response
    const mockVideos: TrendingVideo[] = Array.from({ length: 12 }, (_, i) => ({
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
    
    console.log('Mock trending videos data:', mockVideos);
    return mockVideos;
  } catch (error) {
    console.error('Error fetching trending videos:', error);
    toast.error("Erreur lors de la récupération des vidéos tendance");
    throw new Error('Failed to fetch trending videos');
  }
};

/**
 * Fetches trending creators from the TikTok API
 * @param region Region code (e.g., 'US', 'FR')
 * @returns API response with trending creators data
 */
export const fetchTrendingCreators = async (region: string = "FR"): Promise<TrendingCreator[]> => {
  try {
    console.log(`Fetching trending creators for region: ${region}`);
    
    // Mock response
    const mockCreators: TrendingCreator[] = Array.from({ length: 12 }, (_, i) => ({
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
    
    console.log('Mock trending creators data:', mockCreators);
    return mockCreators;
  } catch (error) {
    console.error('Error fetching trending creators:', error);
    toast.error("Erreur lors de la récupération des créateurs tendance");
    throw new Error('Failed to fetch trending creators');
  }
};

/**
 * Fetches trending songs from the TikTok API
 * @param region Region code (e.g., 'US', 'FR')
 * @returns API response with trending songs data
 */
export const fetchTrendingSongs = async (region: string = "FR"): Promise<TrendingSong[]> => {
  try {
    console.log(`Fetching trending songs for region: ${region}`);
    
    // Mock response
    const mockSongs: TrendingSong[] = Array.from({ length: 12 }, (_, i) => ({
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
    
    console.log('Mock trending songs data:', mockSongs);
    return mockSongs;
  } catch (error) {
    console.error('Error fetching trending songs:', error);
    toast.error("Erreur lors de la récupération des chansons tendance");
    throw new Error('Failed to fetch trending songs');
  }
};

/**
 * Fetches trending hashtags from the TikTok API
 * @param region Region code (e.g., 'US', 'FR')
 * @returns API response with trending hashtags data
 */
export const fetchTrendingHashtags = async (region: string = "FR"): Promise<TrendingHashtag[]> => {
  try {
    console.log(`Fetching trending hashtags for region: ${region}`);
    
    // Mock response
    const mockHashtags: TrendingHashtag[] = Array.from({ length: 12 }, (_, i) => ({
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
    
    console.log('Mock trending hashtags data:', mockHashtags);
    return mockHashtags;
  } catch (error) {
    console.error('Error fetching trending hashtags:', error);
    toast.error("Erreur lors de la récupération des hashtags tendance");
    throw new Error('Failed to fetch trending hashtags');
  }
};
