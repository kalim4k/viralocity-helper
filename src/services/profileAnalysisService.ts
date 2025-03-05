
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
  console.log("Début de l'analyse du profil TikTok");
  
  try {
    // Si une image est fournie, utiliser Gemini Vision
    if (profileImageBase64) {
      console.log("Analyse avec image détectée, utilisation de Gemini Vision");
      return await analyzeWithImage(profile, profileImageBase64);
    }
    
    // Sinon, utiliser Gemini uniquement avec les données textuelles
    console.log("Analyse sans image, utilisation de Gemini Text");
    return await analyzeWithoutImage(profile);
  } catch (error) {
    console.error("Erreur lors de l'analyse du profil:", error);
    
    // Créer une analyse par défaut en cas d'erreur
    const defaultAnalysis: TikTokProfileAnalysis = {
      strengths: ["Présence sur TikTok", "Contenu original", "Potentiel de croissance"],
      improvements: ["Manque d'informations pour une analyse complète", "Ajoutez une bio détaillée", "Publiez plus de contenu"],
      recommendations: [
        {
          title: "Complétez votre profil",
          description: "Ajoutez une photo de profil, une bio complète et des liens vers vos autres réseaux sociaux."
        },
        {
          title: "Créez du contenu régulièrement",
          description: "La régularité est essentielle pour développer votre audience sur TikTok."
        },
        {
          title: "Engagez-vous avec votre communauté",
          description: "Répondez aux commentaires et créez du contenu qui encourage l'interaction."
        },
        {
          title: "Analysez vos performances",
          description: "Utilisez les outils d'analyse pour comprendre ce qui fonctionne et ce qui ne fonctionne pas."
        }
      ],
      optimizedBio: "Créateur de contenu | Partage de conseils & astuces | Nouveau contenu tous les jours #TikTok"
    };
    
    // Lancer une nouvelle erreur pour l'attraper plus haut
    throw new Error(`Erreur d'analyse du profil: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
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
    console.log("Préparation de l'analyse avec image");
    
    // Préparer l'image pour Gemini Vision
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Vérifier si l'image base64 est valide
    if (!profileImageBase64 || profileImageBase64.length < 100) {
      console.warn("Image invalide ou trop petite, passage à l'analyse sans image");
      return analyzeWithoutImage(profile);
    }
    
    // Nettoyer la chaîne base64
    let base64Image = profileImageBase64;
    if (base64Image.includes(',')) {
      base64Image = base64Image.split(',')[1];
    }
    
    // Créer la partie image pour la requête
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg"
      }
    };
    
    console.log("Image préparée pour l'analyse");
    
    // Préparer le prompt pour Gemini
    const prompt = `
    Analyse ce profil TikTok et fournis des recommandations stratégiques pour l'améliorer.
    
    INFORMATIONS SUR LE PROFIL:
    Nom d'utilisateur: ${profile.username}
    Nom: ${profile.displayName}
    Bio: ${profile.bio || "Aucune bio"}
    Abonnés: ${profile.followers}
    Abonnements: ${profile.following || "Inconnu"}
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
    
    console.log("Envoi de la requête à Gemini Vision");
    
    // Envoyer la requête à Gemini
    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();
    console.log("Réponse de Gemini reçue");
    
    // Extraire le JSON de la réponse
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Impossible de parser l'analyse générée:", text);
      throw new Error("Impossible de parser l'analyse générée");
    }
    
    try {
      const analysisResult = JSON.parse(jsonMatch[0]);
      console.log("Analyse avec image réussie:", analysisResult);
      return analysisResult;
    } catch (jsonError) {
      console.error("Erreur de parsing JSON:", jsonError, "Texte original:", text);
      throw new Error("Format de réponse non valide");
    }
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
    console.log("Préparation de l'analyse sans image");
    
    // Utiliser Gemini text-only
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Préparer le prompt pour Gemini
    const prompt = `
    Analyse ce profil TikTok et fournis des recommandations stratégiques pour l'améliorer.
    
    INFORMATIONS SUR LE PROFIL:
    Nom d'utilisateur: ${profile.username}
    Nom: ${profile.displayName}
    Bio: ${profile.bio || "Aucune bio"}
    Abonnés: ${profile.followers}
    Abonnements: ${profile.following || "Inconnu"}
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
    
    console.log("Envoi de la requête à Gemini Text");
    
    // Envoyer la requête à Gemini
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("Réponse de Gemini reçue");
    
    // Extraire le JSON de la réponse
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Impossible de parser l'analyse générée:", text);
      throw new Error("Impossible de parser l'analyse générée");
    }
    
    try {
      const analysisResult = JSON.parse(jsonMatch[0]);
      console.log("Analyse sans image réussie:", analysisResult);
      return analysisResult;
    } catch (jsonError) {
      console.error("Erreur de parsing JSON:", jsonError, "Texte original:", text);
      throw new Error("Format de réponse non valide");
    }
  } catch (error) {
    console.error("Erreur dans analyzeWithoutImage:", error);
    throw error;
  }
}
