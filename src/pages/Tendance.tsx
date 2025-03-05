
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '../components/AppLayout';
import { Flame, Loader2, Music, Hash, Sparkles, Users, Eye, Heart, Search } from 'lucide-react';
import { TrendingVideoCard } from '@/components/TrendingVideoCard';
import { TrendingCreatorCard } from '@/components/TrendingCreatorCard';
import { TrendingSongCard } from '@/components/TrendingSongCard';
import { TrendingHashtagCard } from '@/components/TrendingHashtagCard';
import { HashtagRecommendations } from '@/components/HashtagRecommendations';
import { 
  getTrendingVideos, 
  getTrendingCreators, 
  getTrendingSongs, 
  getTrendingHashtags, 
  formatCount,
  ALL_COUNTRIES
} from '@/services/trendingService';
import { 
  TrendingVideo, 
  TrendingCreator, 
  TrendingSong, 
  TrendingHashtag 
} from '@/types/tiktokTrends.types';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { toast } from 'sonner';

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

  // Extrait les top hashtags pour les recommandations
  const getTopHashtags = () => {
    if (!trendingHashtags || trendingHashtags.length === 0) return [];
    return trendingHashtags.slice(0, 10).map(hashtag => hashtag.hashtag_name);
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
              <SelectContent className="max-h-[300px]">
                {ALL_COUNTRIES.map((option) => (
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
            <div className="flex items-center gap-2 mb-2">
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
          </TabsContent>

          {/* Onglet Créateurs */}
          <TabsContent value="creators" className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
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
          </TabsContent>

          {/* Onglet Sons */}
          <TabsContent value="songs" className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Music size={20} className="text-tva-primary" />
              <h2 className="font-semibold">Sons en tendance</h2>
            </div>
            
            {isLoadingSongs ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-tva-primary" />
              </div>
            ) : !trendingSongs || trendingSongs.length === 0 ? (
              <div className="glass p-4 rounded-xl text-center py-12">
                <p>Aucun son en tendance trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {trendingSongs.slice(0, 8).map((song) => (
                  <TrendingSongCard key={song.clip_id} song={song} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Onglet Hashtags */}
          <TabsContent value="hashtags" className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Hash size={20} className="text-tva-primary" />
              <h2 className="font-semibold">Hashtags en tendance</h2>
            </div>
            
            {isLoadingHashtags ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-tva-primary" />
              </div>
            ) : !trendingHashtags || trendingHashtags.length === 0 ? (
              <div className="glass p-4 rounded-xl text-center py-12">
                <p>Aucun hashtag en tendance trouvé</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {trendingHashtags.slice(0, 6).map((hashtag) => (
                    <TrendingHashtagCard key={hashtag.hashtag_id} hashtag={hashtag} />
                  ))}
                </div>
                <HashtagRecommendations hashtags={getTopHashtags()} />
              </>
            )}
          </TabsContent>

          {/* Onglet Tout */}
          <TabsContent value="all" className="space-y-10">
            {/* Vidéos */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Eye size={20} className="text-tva-primary" />
                <h2 className="font-semibold">Vidéos tendance</h2>
              </div>
              
              {isLoadingVideos ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-tva-primary" />
                </div>
              ) : !trendingVideos || trendingVideos.length === 0 ? (
                <div className="glass p-4 rounded-xl text-center py-6">
                  <p>Aucune vidéo en tendance trouvée</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {trendingVideos.slice(0, 4).map((video) => (
                    <TrendingVideoCard key={video.id} video={video} />
                  ))}
                </div>
              )}
            </div>

            {/* Créateurs */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-tva-primary" />
                <h2 className="font-semibold">Créateurs en tendance</h2>
              </div>
              
              {isLoadingCreators ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-tva-primary" />
                </div>
              ) : !trendingCreators || trendingCreators.length === 0 ? (
                <div className="glass p-4 rounded-xl text-center py-6">
                  <p>Aucun créateur en tendance trouvé</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {trendingCreators.slice(0, 3).map((creator) => (
                    <TrendingCreatorCard key={creator.user_id} creator={creator} />
                  ))}
                </div>
              )}
            </div>

            {/* Sons */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Music size={20} className="text-tva-primary" />
                <h2 className="font-semibold">Sons en tendance</h2>
              </div>
              
              {isLoadingSongs ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-tva-primary" />
                </div>
              ) : !trendingSongs || trendingSongs.length === 0 ? (
                <div className="glass p-4 rounded-xl text-center py-6">
                  <p>Aucun son en tendance trouvé</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {trendingSongs.slice(0, 4).map((song) => (
                    <TrendingSongCard key={song.clip_id} song={song} />
                  ))}
                </div>
              )}
            </div>

            {/* Hashtags */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Hash size={20} className="text-tva-primary" />
                <h2 className="font-semibold">Hashtags en tendance</h2>
              </div>
              
              {isLoadingHashtags ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-tva-primary" />
                </div>
              ) : !trendingHashtags || trendingHashtags.length === 0 ? (
                <div className="glass p-4 rounded-xl text-center py-6">
                  <p>Aucun hashtag en tendance trouvé</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {trendingHashtags.slice(0, 3).map((hashtag) => (
                    <TrendingHashtagCard key={hashtag.hashtag_id} hashtag={hashtag} />
                  ))}
                </div>
              )}
            </div>

            {/* Recommandations de hashtags */}
            {trendingHashtags && trendingHashtags.length > 0 && (
              <HashtagRecommendations hashtags={getTopHashtags()} />
            )}
          </TabsContent>
        </Tabs>
        
        {/* Statistiques et informations */}
        <div className="glass p-6 rounded-xl mt-10">
          <h3 className="text-lg font-semibold mb-4">Comment utiliser les tendances ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Eye size={16} className="text-tva-accent" />
                Pour les vidéos et les sons
              </h4>
              <ul className="list-disc list-inside text-sm space-y-2 text-tva-text/80">
                <li>Analyser les vidéos populaires pour comprendre ce qui fonctionne</li>
                <li>S'inspirer des formats et sujets qui captent l'attention</li>
                <li>Adapter les tendances à votre style et niche</li>
                <li>Utiliser les sons tendance pour augmenter la visibilité</li>
                <li>Créer des transitions originales sur les musiques populaires</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Users size={16} className="text-tva-accent" />
                Pour les créateurs et hashtags
              </h4>
              <ul className="list-disc list-inside text-sm space-y-2 text-tva-text/80">
                <li>Observer les techniques d'engagement des créateurs populaires</li>
                <li>Analyser leur fréquence et timing de publication</li>
                <li>Utiliser les hashtags en tendance appropriés à votre contenu</li>
                <li>Combiner hashtags populaires et nichés pour maximiser la visibilité</li>
                <li>Suivre l'évolution des tendances selon les pays ciblés</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TendancePage;
