
import { TikTokProfile, TikTokProfileAnalysis } from '@/types/tiktok.types';
import { geminiService } from './geminiService';
import { toast } from 'sonner';

/**
 * Analyzes a TikTok profile using Gemini AI
 * @param profile The TikTok profile data
 * @param imageDataUrl Optional base64 image data of the profile screenshot
 * @returns Promise with the analysis results
 */
export const analyzeTikTokProfile = async (
  profile: TikTokProfile, 
  imageDataUrl: string | null = null
): Promise<TikTokProfileAnalysis> => {
  try {
    console.log('Analyzing TikTok profile:', profile.username);
    console.log('Profile data:', profile);
    console.log('Image provided:', imageDataUrl ? 'Yes' : 'No');
    
    // Get analysis from Gemini
    const analysis = await geminiService.analyzeTikTokProfileWithImage(profile, imageDataUrl);
    
    console.log('Analysis results:', analysis);
    return analysis;
  } catch (error: any) {
    console.error('Error analyzing TikTok profile:', error);
    toast.error(`Erreur d'analyse: ${error.message}`);
    throw error;
  }
};
