
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '../components/AppLayout';
import { Flame, Loader2, Music, Hash, Sparkles, Users, Eye, Heart } from 'lucide-react';
import { TrendingVideoCard } from '@/components/TrendingVideoCard';
import { TrendingCreatorCard } from '@/components/TrendingCreatorCard';
import { getTrendingVideos, getTrendingCreators, formatCount } from '@/services/trendingService';
import { TrendingVideo, TrendingCreator } from '@/types/tiktokTrends.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const countryOptions = [
  { value: 'US', label: 'États-Unis' },
  { value: 'FR', label: 'France' },
  { value: 'GB', label: 'Royaume-Uni' },
  { value: 'BR', label: 'Brésil' },
  { value: 'DE', label: 'Allemagne' },
  { value: 'ES', label: 'Espagne' },
  { value: 'IT', label: 'Italie' },
  { value: 'JP', label: 'Japon' },
  { value: 'KR', label: 'Corée du Sud' },
  { value: 'MX', label: 'Mexique' },
];

const TendancePage = () => {
  const [country, setCountry] = useState('US');
  
  // Requêtes avec React Query
  const { 
    data: trendingVideos, 
    isLoading: isLoadingVideos,
    error: videosError,
    refetch: refetchVideos
  } = useQuery({
    queryKey: ['trendingVideos', country],
    queryFn: () => getTrendingVideos(country),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const { 
    data: trendingCreators, 
    isLoading: isLoadingCreators,
    error: creatorsError,
    refetch: refetchCreators
  } = useQuery({
    queryKey: ['trendingCreators', country],
    queryFn: () => getTrendingCreators(country),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Gérer les erreurs
  useEffect(() => {
    if (videosError) {
      toast.error("Erreur lors du chargement des vidéos en tendance");
      console.error("Videos error:", videosError);
    }
    if (creatorsError) {
      toast.error("Erreur lors du chargement des créateurs en tendance");
      console.error("Creators error:", creatorsError);
    }
  }, [videosError, creatorsError]);

  // Changer de pays
  const handleCountryChange = async (value: string) => {
    setCountry(value);
    await Promise.all([refetchVideos(), refetchCreators()]);
  };

  return (
    <AppLayout>
      <div className="space-y-6 pb-20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Tendances</h1>
            <div className="flex items-center gap-1 text-xs font-medium text-tva-accent">
              <Flame size={16} className="animate-pulse-soft" />
              <span>Mis à jour aujourd'hui</span>
            </div>
          </div>
          
          <div className="w-full md:w-48">
            <Select value={country} onValueChange={handleCountryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un pays" />
              </SelectTrigger>
              <SelectContent>
                {countryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <p className="text-tva-text/70 text-sm">
          Découvrez ce qui fait vibrer TikTok en ce moment pour optimiser votre contenu.
        </p>

        {/* Vidéos en tendance */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Eye size={20} className="text-tva-primary" />
            <h2 className="font-semibold">Vidéos tendance</h2>
          </div>
          
          {isLoadingVideos ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-tva-primary" />
            </div>
          ) : !trendingVideos || trendingVideos.length === 0 ? (
            <div className="glass p-4 rounded-xl text-center py-12">
              <p>Aucune vidéo en tendance trouvée</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {trendingVideos.slice(0, 8).map((video) => (
                <TrendingVideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </div>
        
        {/* Créateurs en tendance */}
        <div className="space-y-4 mt-10">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-tva-primary" />
            <h2 className="font-semibold">Créateurs en tendance</h2>
          </div>
          
          {isLoadingCreators ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-tva-primary" />
            </div>
          ) : !trendingCreators || trendingCreators.length === 0 ? (
            <div className="glass p-4 rounded-xl text-center py-12">
              <p>Aucun créateur en tendance trouvé</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {trendingCreators.slice(0, 6).map((creator) => (
                <TrendingCreatorCard key={creator.user_id} creator={creator} />
              ))}
            </div>
          )}
        </div>
        
        {/* Statistiques et informations */}
        <div className="glass p-6 rounded-xl mt-10">
          <h3 className="text-lg font-semibold mb-4">Comment utiliser les tendances ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Eye size={16} className="text-tva-accent" />
                Pour les vidéos
              </h4>
              <ul className="list-disc list-inside text-sm space-y-2 text-tva-text/80">
                <li>Analyser les vidéos populaires pour comprendre ce qui fonctionne</li>
                <li>S'inspirer des formats et sujets qui captent l'attention</li>
                <li>Adapter les tendances à votre style et niche</li>
                <li>Utiliser des hooks d'introduction similaires</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Users size={16} className="text-tva-accent" />
                Pour les créateurs
              </h4>
              <ul className="list-disc list-inside text-sm space-y-2 text-tva-text/80">
                <li>Observer leurs techniques d'engagement avec leur audience</li>
                <li>Analyser leur fréquence et timing de publication</li>
                <li>Noter les styles de montage et transitions utilisés</li>
                <li>Étudier les descriptions et hashtags qu'ils utilisent</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TendancePage;
