
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
    
    // If analysis didn't return proper structure, create a fallback
    if (!analysis || !analysis.strengths || !analysis.improvements) {
      console.warn('Received incomplete analysis, using fallback data');
      return createFallbackAnalysis(profile);
    }
    
    return analysis;
  } catch (error: any) {
    console.error('Error analyzing TikTok profile:', error);
    toast.error(`Erreur d'analyse: ${error.message}`);
    
    // Provide a fallback analysis if Gemini fails
    return createFallbackAnalysis(profile);
  }
};

/**
 * Creates a fallback analysis when the AI fails to provide one
 */
const createFallbackAnalysis = (profile: TikTokProfile): TikTokProfileAnalysis => {
  return {
    strengths: [
      "Compte vérifié avec une base d'abonnés significative",
      `${profile.followers.toLocaleString()} abonnés qui suivent votre contenu`,
      "Profil bien configuré avec les informations de base"
    ],
    improvements: [
      "Optimiser la bio pour inclure plus de mots-clés pertinents",
      "Augmenter la fréquence de publication pour maintenir l'engagement",
      "Interagir davantage avec les commentaires pour renforcer la communauté"
    ],
    recommendations: [
      {
        title: "Optimisation de bio",
        description: "Ajoutez des mots-clés pertinents et un call-to-action clair dans votre bio"
      },
      {
        title: "Cohérence visuelle",
        description: "Maintenez un style visuel cohérent dans vos publications"
      },
      {
        title: "Tendances actuelles",
        description: "Participez aux tendances actuelles en y ajoutant votre touche personnelle"
      },
      {
        title: "Collaborations",
        description: "Collaborez avec d'autres créateurs pour élargir votre audience"
      }
    ],
    optimizedBio: `Créateur de contenu | ${profile.displayName} | ${profile.videoCount} vidéos 🎬 | Nouveau contenu chaque semaine ✨ | Rejoignez mes ${formatNumberCompact(profile.followers)} abonnés!`
  };
};

/**
 * Formats a number in a compact way (e.g. 1K, 1M)
 */
const formatNumberCompact = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
};
