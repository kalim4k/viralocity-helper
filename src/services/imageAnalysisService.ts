
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Analyzes a profile image using the Gemini Vision AI
 * @param imageData Base64-encoded image data
 * @param username TikTok username (optional)
 * @returns Analysis results
 */
export async function analyzeProfileImage(imageData: string, username?: string) {
  try {
    console.log('Sending image for analysis...');
    
    // Show loading toast
    toast({
      title: "Analyse d'image",
      description: "Analyse de votre image de profil en cours..."
    });
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('analyze-profile-image', {
      body: { imageData, username },
    });
    
    if (error) {
      console.error('Error calling analyze-profile-image function:', error);
      
      toast({
        variant: "destructive",
        title: "Erreur d'analyse",
        description: `Échec de l'analyse de l'image: ${error.message}`
      });
      
      throw new Error(`Failed to analyze image: ${error.message}`);
    }
    
    // Success toast
    toast({
      title: "Analyse complétée",
      description: "L'analyse de votre image a été effectuée avec succès"
    });
    
    return data;
  } catch (error) {
    console.error('Error in imageAnalysisService:', error);
    throw error;
  }
}
