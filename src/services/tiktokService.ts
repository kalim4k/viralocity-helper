
import { toast } from 'sonner';
import { RapidAPIResponse, TikTokProfile } from '@/types/tiktok.types';
import { mapTikTokProfileData } from './mappers/tiktokMapper';
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches a TikTok profile by username
 * @param username TikTok username
 * @returns Promise with the TikTok profile data
 */
export const fetchTikTokProfile = async (username: string) => {
  console.log(`Fetching TikTok profile for username: ${username}`);
  
  try {
    // Remove @ from username if present
    const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
    
    // First try using the Edge Function
    try {
      const { data, error } = await supabase.functions.invoke('tiktok-profile', {
        body: { username: cleanUsername }
      });
      
      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('No data returned from edge function');
      }
      
      console.log('Data received from edge function:', data);
      
      // Map the API response to our TikTokProfile structure
      return mapTikTokProfileData(data as RapidAPIResponse);
    } catch (edgeFunctionError) {
      console.error('Edge function failed, falling back to direct API call:', edgeFunctionError);
      
      // Fallback to direct API calls (separate calls for profile and videos)
      const profileUrl = `https://tiktok-user.p.rapidapi.com/getuser/${cleanUsername}`;
      const videosUrl = `https://tiktok-user.p.rapidapi.com/user/videos/${cleanUsername}`;
      
      const profileResponse = await fetch(profileUrl, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'bd18f4b949msh6edd4e1d444b6a0p18d393jsnf0169527896e',
          'X-RapidAPI-Host': 'tiktok-user.p.rapidapi.com'
        }
      });
      
      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        console.error(`API error (${profileResponse.status}): ${errorText}`);
        throw new Error(`Erreur API (${profileResponse.status}): ${errorText}`);
      }
      
      const profileData: RapidAPIResponse = await profileResponse.json();
      
      if (profileData.status !== 200) {
        console.error('API returned error status:', profileData);
        throw new Error(`Erreur: ${JSON.stringify(profileData)}`);
      }
      
      // Try to get videos separately
      try {
        const videosResponse = await fetch(videosUrl, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': 'bd18f4b949msh6edd4e1d444b6a0p18d393jsnf0169527896e',
            'X-RapidAPI-Host': 'tiktok-user.p.rapidapi.com'
          }
        });
        
        if (videosResponse.ok) {
          const videosData = await videosResponse.json();
          
          if (videosData.status === 200 && videosData.data?.items) {
            // Merge the videos into the profile data
            profileData.data = {
              ...profileData.data,
              itemList: videosData.data.items
            };
          }
        }
      } catch (videosError) {
        console.warn('Failed to fetch videos:', videosError);
        // We still continue with just the profile data
      }
      
      // Map the API response to our TikTokProfile structure
      return mapTikTokProfileData(profileData);
    }
  } catch (error) {
    console.error('Error fetching TikTok profile:', error);
    toast.error(`Erreur lors de la récupération du profil: ${error.message}`);
    throw error;
  }
};
