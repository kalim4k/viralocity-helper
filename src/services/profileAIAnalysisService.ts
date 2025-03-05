
import { analyzeProfileImage } from './imageAnalysisService';
import { fetchTikTokProfile } from './tiktokService';
import { TikTokProfile, TikTokProfileAnalysis } from '@/types/tiktok.types';

interface AIImageAnalysis {
  profileImageAnalysis: {
    strengths: string[];
    improvements: string[];
  };
  bioAnalysis: {
    strengths: string[];
    improvements: string[];
  };
  contentAnalysis: {
    strengths: string[];
    improvements: string[];
  };
  generalRecommendations: string[];
}

/**
 * Comprehensive profile analysis that combines TikTok API data with AI image analysis
 */
export async function analyzeProfileWithAI(
  username: string,
  imageData: string | null = null
): Promise<TikTokProfileAnalysis> {
  console.log(`Starting comprehensive profile analysis for: ${username}`);
  
  try {
    // Step 1: Fetch the TikTok profile data
    const profileData = await fetchTikTokProfile(username);
    console.log("TikTok profile data fetched successfully");
    
    // Step 2: If an image was provided, analyze it with Gemini
    let imageAnalysis: AIImageAnalysis | null = null;
    if (imageData) {
      try {
        console.log("Analyzing profile image with Gemini");
        imageAnalysis = await analyzeProfileImage(imageData, username);
        console.log("Image analysis complete");
      } catch (imageError) {
        console.error("Error analyzing image:", imageError);
        // Continue without image analysis
      }
    }
    
    // Step 3: Combine the data into comprehensive analysis
    const combinedAnalysis = generateCombinedAnalysis(profileData, imageAnalysis);
    
    return combinedAnalysis;
  } catch (error) {
    console.error("Error in profile AI analysis:", error);
    throw error;
  }
}

/**
 * Combines TikTok profile data with AI image analysis
 */
function generateCombinedAnalysis(
  profile: TikTokProfile, 
  imageAnalysis: AIImageAnalysis | null
): TikTokProfileAnalysis {
  const followerCount = profile.followers;
  const followingCount = profile.following || 0;
  const ratio = followingCount > 0 ? followerCount / followingCount : 0;
  
  let strengths: string[] = [
    `Votre compte compte déjà ${profile.followers.toLocaleString()} abonnés.`
  ];
  
  let improvements: string[] = [];
  
  // Add strengths and improvements based on profile metrics
  if (ratio > 1) {
    strengths.push(`Votre ratio abonnés/abonnements est bon (${ratio.toFixed(1)})`);
  } else {
    improvements.push(`Améliorez votre ratio abonnés/abonnements (actuellement ${ratio.toFixed(1)})`);
  }
  
  if (profile.verified) {
    strengths.push("Votre compte est vérifié, ce qui augmente votre crédibilité.");
  }
  
  // If we have AI analysis, incorporate it
  if (imageAnalysis) {
    // Add image analysis
    strengths = [...strengths, ...imageAnalysis.profileImageAnalysis.strengths];
    improvements = [...improvements, ...imageAnalysis.profileImageAnalysis.improvements];
    
    // Add bio analysis
    strengths = [...strengths, ...imageAnalysis.bioAnalysis.strengths];
    improvements = [...improvements, ...imageAnalysis.bioAnalysis.improvements];
    
    // Add content analysis
    strengths = [...strengths, ...imageAnalysis.contentAnalysis.strengths];
    improvements = [...improvements, ...imageAnalysis.contentAnalysis.improvements];
  } else {
    // Default recommendations if no AI analysis
    if (!profile.bio || profile.bio.length < 20) {
      improvements.push("Votre biographie est trop courte ou absente. Une bio complète aide à attirer plus d'abonnés.");
    } else {
      strengths.push("Votre biographie est bien définie.");
    }
    
    improvements.push("Utilisez plus de hashtags tendance dans vos vidéos.");
    improvements.push("Variez davantage le type de contenu que vous publiez.");
  }
  
  // Limit to top 4 for each category
  strengths = strengths.slice(0, 4);
  improvements = improvements.slice(0, 4);
  
  // Create recommendations
  const recommendations = imageAnalysis?.generalRecommendations 
    ? imageAnalysis.generalRecommendations.map(rec => {
        const [title, ...descParts] = rec.split(":");
        const description = descParts.join(":").trim();
        return { title: title.trim(), description: description || title };
      })
    : [
        {
          title: "Collaborations",
          description: "Identifiez des créateurs de contenu avec un public similaire et proposez des collaborations."
        },
        {
          title: "Identité visuelle",
          description: "Développez une identité visuelle cohérente pour être immédiatement reconnaissable."
        },
        {
          title: "Contenu éducatif",
          description: "Intégrez plus de contenu éducatif lié à votre niche pour établir votre autorité."
        },
        {
          title: "Interactions",
          description: "Répondez régulièrement aux commentaires pour renforcer l'engagement."
        }
      ];
  
  // Generate an optimized bio based on profile data
  const optimizedBio = generateOptimizedBio(profile);
  
  return {
    strengths,
    improvements,
    recommendations,
    optimizedBio
  };
}

/**
 * Generates an optimized bio based on profile data
 */
function generateOptimizedBio(profile: TikTokProfile): string {
  const displayName = profile.displayName || profile.username;
  const followersCount = profile.followers.toLocaleString();
  
  return `✨ ${displayName} | ${followersCount} abonnés
🔥 Contenu [votre thématique principale] tous les jours
📱 Collaborations: [votre email]
🔗 Découvrez mes derniers projets ⬇️`;
}
