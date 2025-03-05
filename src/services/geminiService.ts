import { GoogleGenerativeAI } from "@google/generative-ai";
import { TikTokProfile } from '@/types/tiktok.types';
import { TikTokProfileAnalysis } from '@/types/tiktok.types';

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI("AIzaSyB1Vi3HkzzjNLrA1-NOlWwrXmbeoHvr1Hg");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const visionModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export interface VideoIdea {
  title: string;
  description: string;
  type: string;
  viralPotential: number;
  audience: string;
}

export interface VideoScript {
  script: string;
  durationEstimate: string;
}

export interface VideoAnalysis {
  hookSuggestion: string;
  editingTips: string;
  callToAction: string;
}

export interface VideoMetadata {
  title: string;
  description: string;
  hashtags: string[];
}

export const geminiService = {
  async generateVideoIdeas(niche: string, count: number = 5): Promise<VideoIdea[]> {
    try {
      const prompt = `Génère ${count} idées de vidéos TikTok pour la niche: "${niche}". 
      Pour chaque idée, fournis: 
      1. Un titre accrocheur
      2. Une brève description (1-2 phrases)
      3. Type de contenu (ex: Tutoriel, Histoire, Avis, Challenge)
      4. Score de potentiel viral de 1 à 100
      5. Public cible
      
      Réponds uniquement en français.
      
      Formate la réponse en JSON valide avec les propriétés: title, description, type, viralPotential, audience.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Extract the JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("Impossible de parser les idées générées");
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Erreur de génération d'idées:", error);
      throw error;
    }
  },

  async generateVideoScript(idea: VideoIdea, scriptType: "voiceover" | "scenario"): Promise<VideoScript> {
    try {
      let scriptPrompt = "";
      
      if (scriptType === "voiceover") {
        scriptPrompt = `Crée un script de voix off pour une vidéo TikTok avec les détails suivants:
        
        Titre: ${idea.title}
        Description: ${idea.description}
        Type: ${idea.type}
        Public cible: ${idea.audience}
        
        Le script doit être écrit sous forme de narration vocale qui accompagnerait bien des visuels et serait engageant pour TikTok.
        
        Inclus également une durée estimée pour la vidéo.
        Réponds uniquement en français.
        
        Formate la réponse en JSON valide avec les propriétés: script (le texte complet du script), durationEstimate (ex: "30-45 secondes").`;
      } else {
        scriptPrompt = `Crée un script de scénario pour une vidéo TikTok avec les détails suivants:
        
        Titre: ${idea.title}
        Description: ${idea.description}
        Type: ${idea.type}
        Public cible: ${idea.audience}
        
        Le script doit inclure les actions des personnages, les dialogues et les indications de scène dans un format de scénario adapté à TikTok.
        
        Inclus également une durée estimée pour la vidéo.
        Réponds uniquement en français.
        
        Formate la réponse en JSON valide avec les propriétés: script (le texte complet du script), durationEstimate (ex: "30-45 secondes").`;
      }

      const result = await model.generateContent(scriptPrompt);
      const text = result.response.text();
      
      // Extract the JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Impossible de parser le script généré");
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Erreur de génération de script:", error);
      throw error;
    }
  },

  async analyzeScript(script: string): Promise<VideoAnalysis> {
    try {
      const prompt = `Analyse ce script de vidéo TikTok et fournis des conseils stratégiques:
      
      Script: "${script}"
      
      Fournis:
      1. Une suggestion de hook puissant pour les 3 premières secondes
      2. 2-3 conseils spécifiques de montage ou suggestions de transitions
      3. Un appel à l'action efficace pour la fin
      
      Réponds uniquement en français.
      
      Formate la réponse en JSON valide avec les propriétés: hookSuggestion, editingTips, callToAction.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Extract the JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Impossible de parser l'analyse générée");
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Erreur d'analyse de script:", error);
      throw error;
    }
  },

  async generateMetadata(idea: VideoIdea, script: string): Promise<VideoMetadata> {
    try {
      const prompt = `Crée des métadonnées optimisées pour le référencement d'une vidéo TikTok avec les détails suivants:
      
      Idée de vidéo: ${idea.title}
      Description: ${idea.description}
      Script: "${script.substring(0, 500)}${script.length > 500 ? '...' : ''}"
      
      Fournis:
      1. Un titre accrocheur (max 100 caractères)
      2. Une description engageante (150-200 caractères) qui inclut des mots-clés pertinents
      3. 5-7 hashtags tendance qui aideraient ce contenu à être découvert
      
      Réponds uniquement en français.
      
      Formate la réponse en JSON valide avec les propriétés: title, description, hashtags (sous forme de tableau de chaînes).`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Extract the JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Impossible de parser les métadonnées générées");
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Erreur de génération de métadonnées:", error);
      throw error;
    }
  },
  
  async analyzeTikTokProfileWithImage(profile: TikTokProfile, imageBase64: string | null): Promise<TikTokProfileAnalysis> {
    try {
      // Prepare profile data for the prompt
      const profileData = {
        username: profile.username,
        displayName: profile.displayName,
        followers: profile.followers,
        following: profile.following || 0,
        likes: profile.likes,
        videoCount: profile.videoCount || 0,
        bio: profile.bio || "No bio",
        verified: profile.verified || false,
      };
      
      let parts: any[] = [];
      
      // Build the prompt with very specific instructions for consistent JSON formatting
      const promptText = `Analyse ce profil TikTok et fournis des recommandations détaillées:
      
      Données du profil:
      Nom d'affichage: ${profileData.displayName}
      Nom d'utilisateur: @${profileData.username}
      Abonnés: ${profileData.followers}
      Abonnements: ${profileData.following}
      Likes: ${profileData.likes}
      Nombre de vidéos: ${profileData.videoCount}
      Bio: "${profileData.bio}"
      Compte vérifié: ${profileData.verified ? "Oui" : "Non"}
      
      ${imageBase64 ? "Tu peux voir une capture d'écran du profil dans l'image jointe. Analyse tous les éléments visuels visibles dans cette image aussi." : ""}
      
      Fournis une analyse approfondie du profil avec:
      1. 3-5 points forts du profil
      2. 3-5 améliorations possibles
      3. 4-6 recommandations spécifiques (avec titre et description pour chaque recommandation)
      4. Une bio optimisée de 150 caractères maximum
      
      IMPORTANT: Ta réponse DOIT être en français et STRICTEMENT formatée en JSON valide sans commentaires supplémentaires, avec exactement les propriétés suivantes:
      {
        "strengths": ["point fort 1", "point fort 2", ...],
        "improvements": ["amélioration 1", "amélioration 2", ...],
        "recommendations": [
          {"title": "titre 1", "description": "description détaillée 1"},
          ...
        ],
        "optimizedBio": "bio optimisée"
      }
      
      Assure-toi que le JSON est parfaitement formaté et valide sans aucun texte supplémentaire avant ou après. Ne réponds rien d'autre que ce JSON.`;
      
      parts.push(promptText);
      
      console.log("Sending profile data to Gemini:", profileData);
      
      // Add the image if provided and properly formatted
      if (imageBase64 && imageBase64.startsWith('data:image/')) {
        try {
          console.log("Including image in Gemini analysis");
          parts.push({
            inlineData: {
              data: imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''),
              mimeType: imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg'
            }
          });
          
          // Use the vision model if image is provided
          console.log("Using Gemini Vision model for analysis");
          const result = await visionModel.generateContent({
            contents: [{ parts }],
            generationConfig: {
              temperature: 0.2,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 4096,
            }
          });
          
          const response = await result.response;
          const text = response.text();
          console.log("Raw Gemini response:", text);
          
          // Extract the JSON from the response
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            console.error("Could not extract JSON from Gemini response:", text);
            throw new Error("Format de réponse AI invalide");
          }
          
          try {
            const jsonResponse = JSON.parse(jsonMatch[0]);
            console.log("Parsed JSON response:", jsonResponse);
            return jsonResponse;
          } catch (jsonError) {
            console.error("JSON parse error:", jsonError);
            throw new Error("Impossible de parser la réponse AI");
          }
        } catch (imageError) {
          console.error("Error processing image with Gemini:", imageError);
          // Fall back to text-only analysis
          console.log("Falling back to text-only analysis");
          const result = await model.generateContent(promptText);
          const text = result.response.text();
          
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (!jsonMatch) throw new Error("Format de réponse AI invalide");
          
          return JSON.parse(jsonMatch[0]);
        }
      } else {
        // Use the regular model if no image
        console.log("Using regular Gemini model (no image)");
        const result = await model.generateContent({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          }
        });
        
        const response = await result.response;
        const text = response.text();
        console.log("Raw Gemini response (no image):", text);
        
        // Extract the JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Format de réponse AI invalide");
        
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error("Error in analyzeTikTokProfileWithImage:", error);
      // Return a basic analysis structure if everything fails
      return {
        strengths: [
          "Profil bien établi",
          "Présence régulière sur la plateforme",
          "Contenu original"
        ],
        improvements: [
          "Optimiser la bio pour plus de clarté",
          "Augmenter la fréquence de publication",
          "Interagir davantage avec la communauté"
        ],
        recommendations: [
          {
            title: "Amélioration de la bio",
            description: "Ajouter des mots-clés et clarifier votre niche"
          },
          {
            title: "Publication régulière",
            description: "Maintenir un calendrier de publication cohérent"
          },
          {
            title: "Engagement communautaire",
            description: "Répondre aux commentaires pour renforcer votre communauté"
          },
          {
            title: "Collaboration",
            description: "Collaborer avec d'autres créateurs pour élargir votre audience"
          }
        ],
        optimizedBio: `Créateur de contenu | ${profile.bio.substring(0, 50) || profile.displayName} | Nouveau contenu régulièrement ✨`
      };
    }
  }
};
