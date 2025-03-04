
import { TikTokProfile } from '@/components/TikTokConnectModal';
import { fetchTikTokProfile } from './tiktokService';

// Constantes pour les calculs de revenus
const REVENUE_PER_1000_VIEWS = 0.7; // 0,7 € pour 1000 vues
const MIN_FOLLOWERS_FOR_REVENUE = 10000; // Minimum 10 000 abonnés

export interface RevenueEstimate {
  // Données du profil
  profile: TikTokProfile;
  
  // Revenus estimés
  isEligible: boolean;
  monthlyRevenue: {
    min: number;
    max: number;
  };
  dailyRevenue: {
    min: number;
    max: number;
  };
  brandDealRevenue: {
    min: number;
    max: number;
  };
  annualRevenue: {
    min: number;
    max: number;
  };
  
  // Statistiques et métriques
  totalViews: number;
  averageViewsPerVideo: number;
  engagementRate: number;
  growthPotential: 'low' | 'medium' | 'high';
  
  // Recommandations
  recommendations: string[];
}

/**
 * Vérifie si un compte est éligible pour générer des revenus
 * @param profile Profil TikTok
 * @returns Booléen indiquant l'éligibilité
 */
export function isRevenueEligible(profile: TikTokProfile): boolean {
  return profile.followers >= MIN_FOLLOWERS_FOR_REVENUE;
}

/**
 * Estime les revenus potentiels à partir d'un profil TikTok
 * @param profile Profil TikTok
 * @returns Estimation des revenus
 */
export function estimateRevenue(profile: TikTokProfile): RevenueEstimate {
  // Vérifier l'éligibilité
  const isEligible = isRevenueEligible(profile);
  
  // Calculer les vues totales et moyennes
  let totalViews = 0;
  profile.videos.forEach(video => {
    totalViews += video.views;
  });
  
  const averageViewsPerVideo = profile.videos.length > 0 
    ? totalViews / profile.videos.length 
    : 0;
  
  // Calculer le taux d'engagement (likes / followers)
  const engagementRate = profile.followers > 0 
    ? (profile.likes / profile.followers) * 100
    : 0;
  
  // Estimer la croissance potentielle
  let growthPotential: 'low' | 'medium' | 'high' = 'medium';
  if (engagementRate > 10) growthPotential = 'high';
  else if (engagementRate < 3) growthPotential = 'low';
  
  // Estimer les revenus mensuels (basé sur 30 jours * vues moyennes quotidiennes)
  // En supposant que le créateur publie une vidéo par jour
  const estimatedMonthlyViews = averageViewsPerVideo * 30;
  const baseMonthlyRevenue = (estimatedMonthlyViews / 1000) * REVENUE_PER_1000_VIEWS;
  
  // Appliquer une fourchette d'estimation
  const monthlyRevenueMin = isEligible ? Math.floor(baseMonthlyRevenue * 0.7) : 0;
  const monthlyRevenueMax = isEligible ? Math.ceil(baseMonthlyRevenue * 1.3) : 0;
  
  // Revenus quotidiens
  const dailyRevenueMin = isEligible ? Math.floor(monthlyRevenueMin / 30) : 0;
  const dailyRevenueMax = isEligible ? Math.ceil(monthlyRevenueMax / 30) : 0;
  
  // Revenus potentiels de partenariats avec des marques
  let brandDealRevenueMin = 0;
  let brandDealRevenueMax = 0;
  
  if (isEligible) {
    if (profile.followers < 50000) {
      brandDealRevenueMin = 50;
      brandDealRevenueMax = 200;
    } else if (profile.followers < 100000) {
      brandDealRevenueMin = 200;
      brandDealRevenueMax = 500;
    } else if (profile.followers < 500000) {
      brandDealRevenueMin = 500;
      brandDealRevenueMax = 2000;
    } else if (profile.followers < 1000000) {
      brandDealRevenueMin = 2000;
      brandDealRevenueMax = 5000;
    } else {
      brandDealRevenueMin = 5000;
      brandDealRevenueMax = 10000;
    }
  }
  
  // Revenus annuels (revenus mensuels * 12 + estimation de 4-6 partenariats)
  const annualRevenueMin = isEligible 
    ? Math.floor((monthlyRevenueMin * 12) + (brandDealRevenueMin * 4)) 
    : 0;
  
  const annualRevenueMax = isEligible 
    ? Math.ceil((monthlyRevenueMax * 12) + (brandDealRevenueMax * 6)) 
    : 0;
  
  // Générer des recommandations personnalisées
  const recommendations: string[] = [];
  
  if (!isEligible) {
    recommendations.push("Atteignez 10 000 abonnés pour débloquer le potentiel de monétisation");
  } else {
    if (engagementRate < 5) {
      recommendations.push("Améliorez votre taux d'engagement en créant du contenu plus interactif");
    }
    
    if (profile.videos.length < 3) {
      recommendations.push("Publiez plus régulièrement pour augmenter votre visibilité et vos revenus");
    }
    
    if (averageViewsPerVideo < profile.followers * 0.3) {
      recommendations.push("Optimisez vos hooks pour augmenter le ratio vues/abonnés");
    }
    
    recommendations.push("Contactez des marques dans votre niche pour des partenariats rémunérés");
  }
  
  // Si nous n'avons pas assez de recommandations, en ajouter des génériques
  if (recommendations.length < 3) {
    recommendations.push("Diversifiez vos formats de contenu pour atteindre un public plus large");
    recommendations.push("Utilisez les tendances actuelles pour augmenter votre visibilité");
  }
  
  return {
    profile,
    isEligible,
    monthlyRevenue: {
      min: monthlyRevenueMin,
      max: monthlyRevenueMax
    },
    dailyRevenue: {
      min: dailyRevenueMin,
      max: dailyRevenueMax
    },
    brandDealRevenue: {
      min: brandDealRevenueMin,
      max: brandDealRevenueMax
    },
    annualRevenue: {
      min: annualRevenueMin,
      max: annualRevenueMax
    },
    totalViews,
    averageViewsPerVideo,
    engagementRate,
    growthPotential,
    recommendations
  };
}

/**
 * Récupère un profil TikTok et génère une estimation de revenus
 * @param username Nom d'utilisateur TikTok
 * @returns Promise avec l'estimation des revenus
 */
export async function analyzeRevenueFromUsername(username: string): Promise<RevenueEstimate> {
  try {
    // Récupérer le profil TikTok
    const profile = await fetchTikTokProfile(username);
    
    // Générer l'estimation des revenus
    return estimateRevenue(profile);
  } catch (error) {
    console.error('Error in revenue analysis:', error);
    throw error;
  }
}
