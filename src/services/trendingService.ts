
import { 
  fetchTrendingVideos, 
  fetchTrendingCreators, 
  fetchTrendingSongs, 
  fetchTrendingHashtags 
} from './api/tiktokTrendsApiClient';
import { 
  TrendingVideo, 
  TrendingCreator, 
  TrendingSong, 
  TrendingHashtag 
} from '@/types/tiktokTrends.types';

/**
 * Récupère les vidéos en tendance
 * @param country Code pays (ex: US, FR)
 * @returns Promise avec les vidéos en tendance
 */
export async function getTrendingVideos(country: string = 'US'): Promise<TrendingVideo[]> {
  try {
    const response = await fetchTrendingVideos(country);
    
    if (response.code === 0 && response.data && response.data.videos) {
      return response.data.videos;
    }
    
    return [];
  } catch (error) {
    console.error('Error in trendingService.getTrendingVideos:', error);
    throw new Error(`Erreur lors de la récupération des vidéos en tendance: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

/**
 * Récupère les créateurs en tendance
 * @param country Code pays (ex: US, FR)
 * @returns Promise avec les créateurs en tendance
 */
export async function getTrendingCreators(country: string = 'US'): Promise<TrendingCreator[]> {
  try {
    const response = await fetchTrendingCreators(country);
    
    if (response.code === 0 && response.data && response.data.creators) {
      return response.data.creators;
    }
    
    return [];
  } catch (error) {
    console.error('Error in trendingService.getTrendingCreators:', error);
    throw new Error(`Erreur lors de la récupération des créateurs en tendance: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

/**
 * Récupère les chansons en tendance
 * @param country Code pays (ex: US, FR)
 * @returns Promise avec les chansons en tendance
 */
export async function getTrendingSongs(country: string = 'US'): Promise<TrendingSong[]> {
  try {
    const response = await fetchTrendingSongs(country);
    
    if (response.code === 0 && response.data && response.data.sound_list) {
      return response.data.sound_list;
    }
    
    return [];
  } catch (error) {
    console.error('Error in trendingService.getTrendingSongs:', error);
    throw new Error(`Erreur lors de la récupération des chansons en tendance: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

/**
 * Récupère les hashtags en tendance
 * @param country Code pays (ex: US, FR)
 * @returns Promise avec les hashtags en tendance
 */
export async function getTrendingHashtags(country: string = 'US'): Promise<TrendingHashtag[]> {
  try {
    const response = await fetchTrendingHashtags(country);
    
    if (response.code === 0 && response.data && response.data.list) {
      return response.data.list;
    }
    
    return [];
  } catch (error) {
    console.error('Error in trendingService.getTrendingHashtags:', error);
    throw new Error(`Erreur lors de la récupération des hashtags en tendance: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

/**
 * Formate le nombre d'abonnés
 * @param count Nombre d'abonnés
 * @returns Chaîne formatée (ex: 1.2M, 500K)
 */
export function formatCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Formate la date de création
 * @param timestamp Timestamp unix
 * @returns Date formatée (ex: il y a 2 jours)
 */
export function formatDate(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diffSeconds = now - timestamp;
  
  if (diffSeconds < 60) {
    return "à l'instant";
  } else if (diffSeconds < 3600) {
    const minutes = Math.floor(diffSeconds / 60);
    return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else if (diffSeconds < 86400) {
    const hours = Math.floor(diffSeconds / 3600);
    return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  } else if (diffSeconds < 604800) {
    const days = Math.floor(diffSeconds / 86400);
    return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  } else if (diffSeconds < 2629800) {
    const weeks = Math.floor(diffSeconds / 604800);
    return `il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
  } else if (diffSeconds < 31557600) {
    const months = Math.floor(diffSeconds / 2629800);
    return `il y a ${months} mois`;
  } else {
    const years = Math.floor(diffSeconds / 31557600);
    return `il y a ${years} an${years > 1 ? 's' : ''}`;
  }
}

/**
 * Liste complète des pays disponibles sur TikTok
 */
export const ALL_COUNTRIES = [
  { value: 'AF', label: 'Afghanistan' },
  { value: 'AL', label: 'Albanie' },
  { value: 'DZ', label: 'Algérie' },
  { value: 'AR', label: 'Argentine' },
  { value: 'AM', label: 'Arménie' },
  { value: 'AU', label: 'Australie' },
  { value: 'AT', label: 'Autriche' },
  { value: 'AZ', label: 'Azerbaïdjan' },
  { value: 'BH', label: 'Bahreïn' },
  { value: 'BD', label: 'Bangladesh' },
  { value: 'BY', label: 'Biélorussie' },
  { value: 'BE', label: 'Belgique' },
  { value: 'BZ', label: 'Belize' },
  { value: 'BJ', label: 'Bénin' },
  { value: 'BO', label: 'Bolivie' },
  { value: 'BA', label: 'Bosnie-Herzégovine' },
  { value: 'BR', label: 'Brésil' },
  { value: 'BG', label: 'Bulgarie' },
  { value: 'KH', label: 'Cambodge' },
  { value: 'CM', label: 'Cameroun' },
  { value: 'CA', label: 'Canada' },
  { value: 'CL', label: 'Chili' },
  { value: 'CN', label: 'Chine' },
  { value: 'CO', label: 'Colombie' },
  { value: 'CR', label: 'Costa Rica' },
  { value: 'HR', label: 'Croatie' },
  { value: 'CY', label: 'Chypre' },
  { value: 'CZ', label: 'République tchèque' },
  { value: 'DK', label: 'Danemark' },
  { value: 'DO', label: 'République dominicaine' },
  { value: 'EC', label: 'Équateur' },
  { value: 'EG', label: 'Égypte' },
  { value: 'SV', label: 'Salvador' },
  { value: 'EE', label: 'Estonie' },
  { value: 'ET', label: 'Éthiopie' },
  { value: 'FI', label: 'Finlande' },
  { value: 'FR', label: 'France' },
  { value: 'GE', label: 'Géorgie' },
  { value: 'DE', label: 'Allemagne' },
  { value: 'GH', label: 'Ghana' },
  { value: 'GR', label: 'Grèce' },
  { value: 'GT', label: 'Guatemala' },
  { value: 'HT', label: 'Haïti' },
  { value: 'HN', label: 'Honduras' },
  { value: 'HK', label: 'Hong Kong' },
  { value: 'HU', label: 'Hongrie' },
  { value: 'IS', label: 'Islande' },
  { value: 'IN', label: 'Inde' },
  { value: 'ID', label: 'Indonésie' },
  { value: 'IQ', label: 'Irak' },
  { value: 'IE', label: 'Irlande' },
  { value: 'IL', label: 'Israël' },
  { value: 'IT', label: 'Italie' },
  { value: 'JM', label: 'Jamaïque' },
  { value: 'JP', label: 'Japon' },
  { value: 'JO', label: 'Jordanie' },
  { value: 'KZ', label: 'Kazakhstan' },
  { value: 'KE', label: 'Kenya' },
  { value: 'KW', label: 'Koweït' },
  { value: 'KG', label: 'Kirghizistan' },
  { value: 'LA', label: 'Laos' },
  { value: 'LV', label: 'Lettonie' },
  { value: 'LB', label: 'Liban' },
  { value: 'LY', label: 'Libye' },
  { value: 'LT', label: 'Lituanie' },
  { value: 'LU', label: 'Luxembourg' },
  { value: 'MO', label: 'Macao' },
  { value: 'MK', label: 'Macédoine du Nord' },
  { value: 'MY', label: 'Malaisie' },
  { value: 'MV', label: 'Maldives' },
  { value: 'MT', label: 'Malte' },
  { value: 'MX', label: 'Mexique' },
  { value: 'MD', label: 'Moldavie' },
  { value: 'MN', label: 'Mongolie' },
  { value: 'ME', label: 'Monténégro' },
  { value: 'MA', label: 'Maroc' },
  { value: 'MM', label: 'Myanmar' },
  { value: 'NP', label: 'Népal' },
  { value: 'NL', label: 'Pays-Bas' },
  { value: 'NZ', label: 'Nouvelle-Zélande' },
  { value: 'NI', label: 'Nicaragua' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'NO', label: 'Norvège' },
  { value: 'OM', label: 'Oman' },
  { value: 'PK', label: 'Pakistan' },
  { value: 'PS', label: 'Palestine' },
  { value: 'PA', label: 'Panama' },
  { value: 'PY', label: 'Paraguay' },
  { value: 'PE', label: 'Pérou' },
  { value: 'PH', label: 'Philippines' },
  { value: 'PL', label: 'Pologne' },
  { value: 'PT', label: 'Portugal' },
  { value: 'PR', label: 'Porto Rico' },
  { value: 'QA', label: 'Qatar' },
  { value: 'RO', label: 'Roumanie' },
  { value: 'RU', label: 'Russie' },
  { value: 'SA', label: 'Arabie Saoudite' },
  { value: 'SN', label: 'Sénégal' },
  { value: 'RS', label: 'Serbie' },
  { value: 'SG', label: 'Singapour' },
  { value: 'SK', label: 'Slovaquie' },
  { value: 'SI', label: 'Slovénie' },
  { value: 'ZA', label: 'Afrique du Sud' },
  { value: 'KR', label: 'Corée du Sud' },
  { value: 'ES', label: 'Espagne' },
  { value: 'LK', label: 'Sri Lanka' },
  { value: 'SD', label: 'Soudan' },
  { value: 'SE', label: 'Suède' },
  { value: 'CH', label: 'Suisse' },
  { value: 'SY', label: 'Syrie' },
  { value: 'TW', label: 'Taiwan' },
  { value: 'TJ', label: 'Tadjikistan' },
  { value: 'TZ', label: 'Tanzanie' },
  { value: 'TH', label: 'Thaïlande' },
  { value: 'TN', label: 'Tunisie' },
  { value: 'TR', label: 'Turquie' },
  { value: 'TM', label: 'Turkménistan' },
  { value: 'UG', label: 'Ouganda' },
  { value: 'UA', label: 'Ukraine' },
  { value: 'AE', label: 'Émirats arabes unis' },
  { value: 'GB', label: 'Royaume-Uni' },
  { value: 'US', label: 'États-Unis' },
  { value: 'UY', label: 'Uruguay' },
  { value: 'UZ', label: 'Ouzbékistan' },
  { value: 'VE', label: 'Venezuela' },
  { value: 'VN', label: 'Vietnam' },
  { value: 'YE', label: 'Yémen' },
  { value: 'ZW', label: 'Zimbabwe' }
];
