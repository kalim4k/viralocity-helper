
import { TikTokProfile } from '@/components/TikTokConnectModal';
import { TikTokProfileAnalysis } from '@/types/tiktok.types';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI("AIzaSyB1Vi3HkzzjNLrA1-NOlWwrXmbeoHvr1Hg");

/**
 * Analyse un profil TikTok en utilisant Google Gemini
 * @param profile Profil TikTok à analyser
 * @param profileImageBase64 Image du profil en base64 (optionnelle)
 * @returns Résultat de l'analyse avec forces, faiblesses et recommandations
 */
export async function analyzeTikTokProfile(
  profile: TikTokProfile,
  profileImageBase64: string | null = null
): Promise<TikTokProfileAnalysis> {
  try {
    // Si une image est fournie, utiliser Gemini Vision
    if (profileImageBase64) {
      return await analyzeWithImage(profile, profileImageBase64);
    }
    
    // Sinon, utiliser Gemini uniquement avec les données textuelles
    return await analyzeWithoutImage(profile);
  } catch (error) {
    console.error("Erreur lors de l'analyse du profil:", error);
    throw error;
  }
}

/**
 * Analyse le profil TikTok avec image en utilisant Gemini Vision
 */
async function analyzeWithImage(
  profile: TikTokProfile,
  profileImageBase64: string
): Promise<TikTokProfileAnalysis> {
  try {
    // Préparer l'image pour Gemini Vision
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Nettoyer la chaîne base64
    const base64Image = profileImageBase64.split(',')[1] || profileImageBase64;
    
    // Créer la partie image pour la requête
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg"
      }
    };
    
    // Préparer le prompt pour Gemini
    const prompt = `
    Analyse ce profil TikTok et fournis des recommandations stratégiques pour l'améliorer.
    
    INFORMATIONS SUR LE PROFIL:
    Nom d'utilisateur: ${profile.username}
    Nom: ${profile.nickname}
    Bio: ${profile.bio || "Aucune bio"}
    Abonnés: ${profile.followers}
    Abonnements: ${profile.following}
    Likes: ${profile.likes}
    Vidéos: ${profile.videoCount || "Inconnu"}
    Vérifié: ${profile.verified ? "Oui" : "Non"}
    
    Sur la base de ces informations et de l'image du profil que tu peux voir, génère:
    
    1. FORCES (3-5 points forts du profil)
    2. AMÉLIORATIONS (3-5 suggestions pour améliorer le profil)
    3. RECOMMANDATIONS (4-6 recommandations détaillées pour maximiser l'impact du profil)
    4. BIO OPTIMISÉE (Proposition d'une bio optimisée de maximum 80 caractères qui augmenterait l'engagement)
    
    Pour les recommandations, sois précis et actionnable. Inclus des conseils sur:
    - L'optimisation de la photo de profil
    - La fréquence de publication
    - Les heures idéales pour publier
    - L'engagement avec la communauté
    - L'utilisation des tendances
    
    Réponds uniquement en français.
    
    Formate la réponse en JSON valide avec la structure suivante:
    {
      "strengths": ["force 1", "force 2", "force 3"],
      "improvements": ["amélioration 1", "amélioration 2", "amélioration 3"],
      "recommendations": [
        {
          "title": "Titre de la recommandation",
          "description": "Description détaillée avec exemples"
        }
      ],
      "optimizedBio": "Proposition de bio optimisée"
    }
    `;
    
    // Envoyer la requête à Gemini
    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();
    
    // Extraire le JSON de la réponse
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Impossible de parser l'analyse générée");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Erreur dans analyzeWithImage:", error);
    throw error;
  }
}

/**
 * Analyse le profil TikTok sans image en utilisant Gemini
 */
async function analyzeWithoutImage(profile: TikTokProfile): Promise<TikTokProfileAnalysis> {
  try {
    // Utiliser Gemini text-only
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Préparer le prompt pour Gemini
    const prompt = `
    Analyse ce profil TikTok et fournis des recommandations stratégiques pour l'améliorer.
    
    INFORMATIONS SUR LE PROFIL:
    Nom d'utilisateur: ${profile.username}
    Nom: ${profile.nickname}
    Bio: ${profile.bio || "Aucune bio"}
    Abonnés: ${profile.followers}
    Abonnements: ${profile.following}
    Likes: ${profile.likes}
    Vidéos: ${profile.videoCount || "Inconnu"}
    Vérifié: ${profile.verified ? "Oui" : "Non"}
    
    Sur la base de ces informations, génère:
    
    1. FORCES (3-5 points forts du profil)
    2. AMÉLIORATIONS (3-5 suggestions pour améliorer le profil)
    3. RECOMMANDATIONS (4-6 recommandations détaillées pour maximiser l'impact du profil)
    4. BIO OPTIMISÉE (Proposition d'une bio optimisée de maximum 80 caractères qui augmenterait l'engagement)
    
    Pour les recommandations, sois précis et actionnable. Inclus des conseils sur:
    - La fréquence de publication
    - Les heures idéales pour publier
    - L'engagement avec la communauté
    - L'utilisation des tendances
    
    Réponds uniquement en français.
    
    Formate la réponse en JSON valide avec la structure suivante:
    {
      "strengths": ["force 1", "force 2", "force 3"],
      "improvements": ["amélioration 1", "amélioration 2", "amélioration 3"],
      "recommendations": [
        {
          "title": "Titre de la recommandation",
          "description": "Description détaillée avec exemples"
        }
      ],
      "optimizedBio": "Proposition de bio optimisée"
    }
    `;
    
    // Envoyer la requête à Gemini
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Extraire le JSON de la réponse
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Impossible de parser l'analyse générée");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Erreur dans analyzeWithoutImage:", error);
    throw error;
  }
}
