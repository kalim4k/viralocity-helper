
import { supabase } from '@/integrations/supabase/client';

/**
 * Analyzes a profile image using the Gemini Vision AI
 * @param imageData Base64-encoded image data
 * @param username TikTok username (optional)
 * @returns Analysis results
 */
export async function analyzeProfileImage(imageData: string, username?: string) {
  try {
    console.log('Sending image for analysis...');
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('analyze-profile-image', {
      body: { imageData, username },
    });
    
    if (error) {
      console.error('Error calling analyze-profile-image function:', error);
      throw new Error(`Failed to analyze image: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in imageAnalysisService:', error);
    throw error;
  }
}
