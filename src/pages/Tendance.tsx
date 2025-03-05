
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '../components/AppLayout';
import { Flame, Eye, Users, Music, Hash, Sparkles } from 'lucide-react';
import { 
  getTrendingVideos, 
  getTrendingCreators, 
  getTrendingSongs, 
  getTrendingHashtags, 
  ALL_COUNTRIES
} from '@/services/trendingService';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { toast } from 'sonner';

// Import the refactored components
import { CountrySelector } from '@/components/tendance/CountrySelector';
import { TrendingVideosTab } from '@/components/tendance/TrendingVideosTab';
import { TrendingCreatorsTab } from '@/components/tendance/TrendingCreatorsTab';
import { TrendingSongsTab } from '@/components/tendance/TrendingSongsTab';
import { TrendingHashtagsTab } from '@/components/tendance/TrendingHashtagsTab';
import { TrendingAllTab } from '@/components/tendance/TrendingAllTab';
import { TrendingUsageGuide } from '@/components/tendance/TrendingUsageGuide';

const TendancePage = () => {
  const [country, setCountry] = useState('US');
  const [activeTab, setActiveTab] = useState('videos');
  
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
    enabled: activeTab === 'videos' || activeTab === 'all'
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
    enabled: activeTab === 'creators' || activeTab === 'all'
  });

  const { 
    data: trendingSongs, 
    isLoading: isLoadingSongs,
    error: songsError,
    refetch: refetchSongs
  } = useQuery({
    queryKey: ['trendingSongs', country],
    queryFn: () => getTrendingSongs(country),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: activeTab === 'songs' || activeTab === 'all'
  });

  const { 
    data: trendingHashtags, 
    isLoading: isLoadingHashtags,
    error: hashtagsError,
    refetch: refetchHashtags
  } = useQuery({
    queryKey: ['trendingHashtags', country],
    queryFn: () => getTrendingHashtags(country),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: activeTab === 'hashtags' || activeTab === 'all'
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
    if (songsError) {
      toast.error("Erreur lors du chargement des sons en tendance");
      console.error("Songs error:", songsError);
    }
    if (hashtagsError) {
      toast.error("Erreur lors du chargement des hashtags en tendance");
      console.error("Hashtags error:", hashtagsError);
    }
  }, [videosError, creatorsError, songsError, hashtagsError]);

  // Changer de pays
  const handleCountryChange = async (value: string) => {
    setCountry(value);
    if (activeTab === 'videos' || activeTab === 'all') await refetchVideos();
    if (activeTab === 'creators' || activeTab === 'all') await refetchCreators();
    if (activeTab === 'songs' || activeTab === 'all') await refetchSongs();
    if (activeTab === 'hashtags' || activeTab === 'all') await refetchHashtags();
  };

  // Changement d'onglet
  const handleTabChange = async (value: string) => {
    setActiveTab(value);
    if (value === 'videos' && !trendingVideos) await refetchVideos();
    if (value === 'creators' && !trendingCreators) await refetchCreators();
    if (value === 'songs' && !trendingSongs) await refetchSongs();
    if (value === 'hashtags' && !trendingHashtags) await refetchHashtags();
    if (value === 'all') {
      if (!trendingVideos) await refetchVideos();
      if (!trendingCreators) await refetchCreators();
      if (!trendingSongs) await refetchSongs();
      if (!trendingHashtags) await refetchHashtags();
    }
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
          
          <CountrySelector 
            country={country} 
            countries={ALL_COUNTRIES} 
            onChange={handleCountryChange} 
          />
        </div>
        
        <p className="text-tva-text/70 text-sm">
          Découvrez ce qui fait vibrer TikTok en ce moment pour optimiser votre contenu.
        </p>

        <Tabs defaultValue="videos" value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="videos" className="flex items-center gap-1.5">
              <Eye size={16} />
              <span className="hidden md:inline-block">Vidéos</span>
            </TabsTrigger>
            <TabsTrigger value="creators" className="flex items-center gap-1.5">
              <Users size={16} />
              <span className="hidden md:inline-block">Créateurs</span>
            </TabsTrigger>
            <TabsTrigger value="songs" className="flex items-center gap-1.5">
              <Music size={16} />
              <span className="hidden md:inline-block">Sons</span>
            </TabsTrigger>
            <TabsTrigger value="hashtags" className="flex items-center gap-1.5">
              <Hash size={16} />
              <span className="hidden md:inline-block">Hashtags</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-1.5">
              <Sparkles size={16} />
              <span className="hidden md:inline-block">Tout</span>
            </TabsTrigger>
          </TabsList>

          {/* Onglet Vidéos */}
          <TabsContent value="videos" className="space-y-6">
            <TrendingVideosTab 
              isLoading={isLoadingVideos} 
              trendingVideos={trendingVideos} 
            />
          </TabsContent>

          {/* Onglet Créateurs */}
          <TabsContent value="creators" className="space-y-6">
            <TrendingCreatorsTab 
              isLoading={isLoadingCreators} 
              trendingCreators={trendingCreators} 
            />
          </TabsContent>

          {/* Onglet Sons */}
          <TabsContent value="songs" className="space-y-6">
            <TrendingSongsTab 
              isLoading={isLoadingSongs} 
              trendingSongs={trendingSongs} 
            />
          </TabsContent>

          {/* Onglet Hashtags */}
          <TabsContent value="hashtags" className="space-y-6">
            <TrendingHashtagsTab 
              isLoading={isLoadingHashtags} 
              trendingHashtags={trendingHashtags} 
            />
          </TabsContent>

          {/* Onglet Tout */}
          <TabsContent value="all" className="space-y-10">
            <TrendingAllTab 
              trendingVideos={trendingVideos}
              trendingCreators={trendingCreators}
              trendingSongs={trendingSongs}
              trendingHashtags={trendingHashtags}
              isLoadingVideos={isLoadingVideos}
              isLoadingCreators={isLoadingCreators}
              isLoadingSongs={isLoadingSongs}
              isLoadingHashtags={isLoadingHashtags}
            />
          </TabsContent>
        </Tabs>
        
        {/* Statistiques et informations */}
        <TrendingUsageGuide />
      </div>
    </AppLayout>
  );
};

export default TendancePage;
