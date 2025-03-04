
import { TikTokVideoResponse } from '@/types/tiktokVideo.types';

// API configuration
const API_CONFIG = {
  apiKey: 'bd18f4b949msh6edd4e1d444b6a0p18d393jsnf0169527896e',
  apiHost: 'tiktok-user.p.rapidapi.com'
};

/**
 * Extrait l'ID de la vidéo à partir de l'URL TikTok
 * @param url URL de la vidéo TikTok
 * @returns ID de la vidéo
 */
export function extractVideoId(url: string): string {
  // Pattern pour extraire l'ID de la vidéo
  const patterns = [
    /video\/(\d+)/,                     // tiktok.com/@user/video/7259090610592697646
    /\/@[\w.-]+\/video\/(\d+)/,         // @user/video/7259090610592697646
    /\/v\/(\d+)/,                       // vm.tiktok.com/v/7259090610592697646
    /\/t\/(\w+)/,                       // t/abcdefg
    /tiktok\.com\/@[^\/]+\/(\d+)/,      // tiktok.com/@user/7259090610592697646 (sans "video/")
    /tiktok\.com\/video\/(\d+)/         // tiktok.com/video/7259090610592697646 (sans nom d'utilisateur)
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      // Vérifiez que l'ID est numérique sauf pour le pattern /t/ qui utilise des ID alphanumériques
      if (pattern.toString().includes('/t/') || /^\d+$/.test(match[1])) {
        return match[1];
      }
    }
  }

  // Si l'URL semble être directement un ID (numérique uniquement)
  if (/^\d+$/.test(url)) {
    return url;
  }

  throw new Error('Format d\'URL TikTok non reconnu. Veuillez utiliser un ID numérique ou une URL complète (ex: https://www.tiktok.com/@username/video/1234567890)');
}

/**
 * Récupère les données d'une vidéo TikTok via RapidAPI
 * @param videoIdOrUrl ID ou URL de la vidéo TikTok
 * @returns Promesse avec les données brutes de l'API
 */
export async function fetchVideoData(videoIdOrUrl: string): Promise<TikTokVideoResponse> {
  try {
    let videoId;
    
    // Si c'est déjà un ID numérique, on l'utilise directement
    if (/^\d+$/.test(videoIdOrUrl)) {
      videoId = videoIdOrUrl;
      console.log(`API Client: Utilisation directe de l'ID: ${videoId}`);
    } 
    // Sinon on tente d'extraire l'ID depuis l'URL
    else if (videoIdOrUrl.includes('tiktok.com') || videoIdOrUrl.includes('/')) {
      videoId = extractVideoId(videoIdOrUrl);
      console.log(`API Client: ID extrait de l'URL: ${videoId}`);
    }
    // Si ce n'est ni un ID ni une URL reconnue
    else {
      throw new Error("Format d'URL ou d'ID non reconnu. Veuillez fournir un ID numérique ou une URL TikTok complète.");
    }
      
    console.log(`API Client: Récupération des données pour la vidéo ID: ${videoId}`);
    
    const response = await fetch(`https://tiktok-user.p.rapidapi.com/getvideo/${videoId}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': API_CONFIG.apiHost,
        'x-rapidapi-key': API_CONFIG.apiKey
      }
    });
    
    if (!response.ok) {
      const statusCode = response.status;
      console.error(`API a répondu avec le statut: ${statusCode}`);
      
      if (statusCode === 404) {
        throw new Error("Aucune vidéo trouvée avec cet identifiant");
      } else if (statusCode === 429) {
        throw new Error("Limite de requêtes dépassée. Veuillez réessayer plus tard.");
      } else {
        throw new Error(`Erreur lors de la récupération de la vidéo TikTok: ${statusCode}`);
      }
    }
    
    const result = await response.json();
    console.log('Réponse API brute reçue:', JSON.stringify(result).substring(0, 300) + '...');
    
    // Vérifie si la réponse contient "No match found"
    if (result.data === "No match found." || 
        (typeof result.data === 'string' && result.data.includes('No match found'))) {
      throw new Error("Aucune vidéo trouvée avec cet identifiant. Essayez plutôt avec l'ID numérique de la vidéo.");
    }
    
    // Validation de la structure de la réponse API
    if (!result.data || !result.data.owner || !result.data.item) {
      console.error('Structure de réponse API invalide:', result);
      throw new Error('L\'API a retourné une structure de données invalide');
    }
    
    return result as TikTokVideoResponse;
  } catch (error) {
    console.error('Erreur dans fetchVideoData:', error);
    throw error;
  }
}
