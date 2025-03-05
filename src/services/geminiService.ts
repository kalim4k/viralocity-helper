
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI("AIzaSyB1Vi3HkzzjNLrA1-NOlWwrXmbeoHvr1Hg");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
  }
};
