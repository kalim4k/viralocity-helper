
import { TikTokProcessedVideo, VideoAnalysisResult, VideoAnalysisMetrics, VideoAnalysisRecommendation } from '@/types/tiktokVideo.types';
import { calculateVideoMetrics } from './tiktokVideoService';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialiser l'API Google Generative AI
const genAI = new GoogleGenerativeAI("AIzaSyB1Vi3HkzzjNLrA1-NOlWwrXmbeoHvr1Hg");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Génère une analyse complète d'une vidéo TikTok
 * @param video La vidéo TikTok traitée à analyser
 * @returns Résultat de l'analyse avec métriques et recommandations
 */
export async function analyzeVideo(video: TikTokProcessedVideo): Promise<VideoAnalysisResult> {
  try {
    // Calcul des métriques de base
    const metrics = calculateVideoMetrics(video);
    
    // Génération des recommandations par Gemini AI
    const recommendations = await generateRecommendations(video, metrics);
    
    return {
      metrics,
      recommendations: recommendations.recommendations,
      hashtags: recommendations.hashtags,
      strengths: recommendations.strengths,
      weaknesses: recommendations.weaknesses
    };
  } catch (error) {
    console.error("Erreur lors de l'analyse de la vidéo:", error);
    throw error;
  }
}

/**
 * Génère des recommandations personnalisées pour améliorer la vidéo
 * @param video La vidéo TikTok à analyser
 * @param metrics Les métriques calculées de la vidéo
 * @returns Recommandations générées par l'IA
 */
async function generateRecommendations(
  video: TikTokProcessedVideo, 
  metrics: VideoAnalysisMetrics
): Promise<{
  recommendations: VideoAnalysisRecommendation[],
  hashtags: string[],
  strengths: string[],
  weaknesses: string[]
}> {
  const prompt = `
  Analyse cette vidéo TikTok et fournis des recommandations stratégiques pour l'améliorer.
  
  INFORMATIONS SUR LA VIDÉO:
  Titre/Description: ${video.description}
  Vues: ${video.stats.views}
  Likes: ${video.stats.likes}
  Commentaires: ${video.stats.comments}
  Partages: ${video.stats.shares}
  Durée: ${video.duration} secondes
  Musique: "${video.musicInfo.title}" par ${video.musicInfo.author} (${video.musicInfo.isOriginal ? 'Originale' : 'Non originale'})
  
  MÉTRIQUES CALCULÉES:
  Taux d'engagement: ${metrics.engagementRate}%
  Taux de complétion estimé: ${metrics.completionRate}%
  Score de hook: ${metrics.hookScore}/100
  Score de viralité: ${metrics.viralityScore}/100
  
  À partir de ces informations, génère:
  
  1. FORCES (3 points forts de la vidéo)
  2. FAIBLESSES (3 points faibles à améliorer)
  3. RECOMMANDATIONS DÉTAILLÉES (5-7 recommandations pour améliorer la vidéo)
  4. HASHTAGS RECOMMANDÉS (5-7 hashtags pertinents)
  
  Pour les recommandations, classe chaque suggestion dans une des catégories suivantes:
  - hook (accroche des premières secondes)
  - engagement (appels à l'action pour likes/commentaires)
  - hashtags (stratégie de hashtags)
  - audio (choix de musique)
  - editing (montage et transitions)
  - callToAction (conclusion de la vidéo)
  
  Pour chaque recommandation, indique également sa priorité (high/medium/low).
  
  Si le nombre de likes et commentaires est faible par rapport aux vues (engagement < 5%), donne plus de conseils sur les appels à l'action avec des exemples concrets.
  
  Si le taux de complétion est faible (< 50%), concentre-toi sur des conseils de storytelling et de hook.
  
  Réponds uniquement en français.
  
  Formate la réponse en JSON valide avec la structure suivante:
  {
    "strengths": ["point fort 1", "point fort 2", "point fort 3"],
    "weaknesses": ["point faible 1", "point faible 2", "point faible 3"],
    "recommendations": [
      {
        "title": "Titre de la recommandation",
        "description": "Description détaillée avec exemples",
        "category": "une des catégories mentionnées",
        "icon": "nom d'une icône lucide-react pertinente",
        "priority": "high/medium/low"
      }
    ],
    "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"]
  }
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  // Extraire le JSON de la réponse
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Impossible d'analyser les recommandations générées");
  
  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed;
  } catch (error) {
    console.error("Erreur lors du parsing JSON:", error);
    throw new Error("Format de réponse invalide de l'API Gemini");
  }
}
