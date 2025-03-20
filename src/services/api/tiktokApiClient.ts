
import { toast } from "sonner";
import { TikTokApiConfig, RapidAPIResponse } from "@/types/tiktok.types";

/**
 * Configuration for the TikTok API client
 */
const apiConfig: TikTokApiConfig = {
  apiKey: "7a0b675b39mshd26944ac6b0aa53p1af42bjsna1c8d9c8a89b", // Demo API key - replace with your own in production
  apiHost: "tiktok-video-no-watermark2.p.rapidapi.com",
  baseUrl: "https://tiktok-video-no-watermark2.p.rapidapi.com"
};

/**
 * Fetches a user profile from the TikTok API
 * @param username TikTok username
 * @returns API response with user profile data
 */
export const fetchTikTokUserProfile = async (username: string): Promise<RapidAPIResponse> => {
  try {
    console.log(`Fetching TikTok profile for username: ${username}`);
    
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiConfig.apiKey,
        'X-RapidAPI-Host': apiConfig.apiHost
      }
    };

    // For demo purposes, we'll use a mock response
    // In a real application, this would make an actual API call like:
    // const response = await fetch(`${apiConfig.baseUrl}/user/info?unique_id=${username}`, options);
    // const data = await response.json();
    
    // Mock response
    const mockResponse: RapidAPIResponse = {
      status: 200,
      data: {
        owner: {
          user_info: {
            uid: "12345678",
            unique_id: username,
            nickname: username.charAt(0).toUpperCase() + username.slice(1),
            avatar_thumb: {
              url_list: ["https://placehold.co/200x200/4f46e5/ffffff?text=" + username.charAt(0).toUpperCase()]
            },
            follower_count: 100000 + Math.floor(Math.random() * 900000),
            following_count: 500 + Math.floor(Math.random() * 500),
            total_favorited: 1000000 + Math.floor(Math.random() * 9000000),
            signature: "Créateur de contenu | Lifestyle & Tech | Pour collaborations: email@example.com"
          }
        },
        itemList: Array.from({ length: 9 }, (_, i) => ({
          id: `video${i + 1}`,
          desc: `Vidéo TikTok #${i + 1} - Découvrez mes astuces pour gagner en visibilité!`,
          stats: {
            playCount: 10000 + Math.floor(Math.random() * 90000),
            diggCount: 1000 + Math.floor(Math.random() * 9000),
            commentCount: 100 + Math.floor(Math.random() * 900),
            shareCount: 50 + Math.floor(Math.random() * 450)
          },
          video: {
            cover: `https://placehold.co/800x1400/4f46e5/ffffff?text=Video${i + 1}`
          }
        }))
      }
    };
    
    console.log('Mock TikTok profile data:', mockResponse);
    return mockResponse;
  } catch (error) {
    console.error('Error fetching TikTok profile:', error);
    toast.error("Erreur lors de la récupération du profil TikTok");
    throw new Error('Failed to fetch TikTok profile');
  }
};
