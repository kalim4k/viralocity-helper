
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
      
      // Map the API response to our TikTokProfile structure
      return mapTikTokProfileData(data as RapidAPIResponse);
    } catch (edgeFunctionError) {
      console.error('Edge function failed, falling back to direct API call:', edgeFunctionError);
      
      // Fallback to direct API call (using the original implementation)
      const url = `https://tiktok-user.p.rapidapi.com/getuser/${cleanUsername}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'bd18f4b949msh6edd4e1d444b6a0p18d393jsnf0169527896e',
          'X-RapidAPI-Host': 'tiktok-user.p.rapidapi.com'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error (${response.status}): ${errorText}`);
        throw new Error(`Erreur API (${response.status}): ${errorText}`);
      }
      
      const data: RapidAPIResponse = await response.json();
      
      if (data.status !== 200) {
        console.error('API returned error status:', data);
        throw new Error(`Erreur: ${JSON.stringify(data)}`);
      }
      
      // Map the API response to our TikTokProfile structure
      return mapTikTokProfileData(data);
    }
  } catch (error) {
    console.error('Error fetching TikTok profile:', error);
    toast.error(`Erreur lors de la récupération du profil: ${error.message}`);
    throw error;
  }
};
