import React, { useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import { Search, ExternalLink, UploadCloud, HelpCircle, Download, Camera } from 'lucide-react';
import { VideoMetricsDisplay } from '@/components/VideoMetricsDisplay';
import { VideoRecommendations } from '@/components/VideoRecommendations';
import { HashtagRecommendations } from '@/components/HashtagRecommendations';
import { StrengthsWeaknesses } from '@/components/StrengthsWeaknesses';
import { TikTokProcessedVideo, VideoAnalysisResult } from '@/types/tiktokVideo.types';
import { fetchTikTokVideo } from '@/services/tiktokVideoService';
import { analyzeVideo } from '@/services/videoAnalysisService';
import { formatNumber } from '@/utils/formatters';
import { toast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { AccountAnalyzer } from '@/components/AccountAnalyzer';
const AnalysePage = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [video, setVideo] = useState<TikTokProcessedVideo | null>(null);
  const [analysis, setAnalysis] = useState<VideoAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'video' | 'account'>('video');
  const handleAnalyze = async () => {
    if (!videoUrl) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      // Récupération des données de la vidéo
      const videoData = await fetchTikTokVideo(videoUrl);
      setVideo(videoData);

      // Analyse de la vidéo avec Gemini
      const analysisResult = await analyzeVideo(videoData);
      setAnalysis(analysisResult);
      toast({
        title: "Analyse terminée",
        description: "L'analyse de votre vidéo TikTok est prête !"
      });
    } catch (err) {
      console.error('Erreur lors de l\'analyse:', err);
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite lors de l\'analyse');
      toast({
        variant: "destructive",
        title: "Erreur d'analyse",
        description: err instanceof Error ? err.message : 'Une erreur s\'est produite lors de l\'analyse'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  return <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Analyser</h1>
          
        </div>

        <div className="flex space-x-2">
          <button className={`flex-1 py-2 rounded-lg text-sm font-medium ${activeTab === 'video' ? 'bg-tva-primary text-white' : 'bg-tva-surface text-tva-text'}`} onClick={() => setActiveTab('video')}>
            Analyser une vidéo
          </button>
          <button className={`flex-1 py-2 rounded-lg text-sm font-medium ${activeTab === 'account' ? 'bg-tva-primary text-white' : 'bg-tva-surface text-tva-text'}`} onClick={() => setActiveTab('account')}>
            Analyser un compte
          </button>
        </div>

        {activeTab === 'video' ? <>
            <section className="glass p-4 rounded-xl space-y-4">
              <h2 className="text-lg font-semibold">Analysez une vidéo TikTok</h2>
              
              <div className="flex items-center gap-1">
                <p className="text-sm text-tva-text/70">
                  Entrez l'ID ou l'URL d'une vidéo TikTok pour l'analyser.
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="inline-flex text-tva-text/50 hover:text-tva-primary">
                        <HelpCircle size={16} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Formats acceptés :</p>
                      <ul className="text-xs mt-1 pl-4 list-disc">
                        <li>ID numérique (ex: 7149284958899785006)</li>
                        <li>URL TikTok complète</li>
                        <li>URL partagée (ex: vm.tiktok.com/...)</li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex space-x-2">
                <input type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="7149284958899785006 ou URL TikTok" className="flex-1 bg-tva-surface/60 border border-tva-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-tva-primary text-black" />
                <button onClick={handleAnalyze} disabled={isAnalyzing || !videoUrl} className={`${isAnalyzing ? 'bg-tva-primary/70' : 'bg-tva-primary hover:bg-tva-primary/90'} text-white py-2 px-4 rounded-lg text-sm font-medium transition-all`}>
                  {isAnalyzing ? 'Analyse...' : 'Analyser'}
                </button>
              </div>
            </section>

            {isAnalyzing && <div className="glass p-8 rounded-xl flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-tva-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-tva-text/70">Analyse en cours...</p>
              </div>}

            {error && <div className="glass p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-red-400 text-sm">{error}</p>
              </div>}

            {video && analysis && <div className="space-y-6 animate-slide-up">
                <section className="glass p-4 rounded-xl">
                  <div className="relative rounded-lg overflow-hidden mb-4">
                    <div className="aspect-[9/16] bg-tva-surface flex items-center justify-center">
                      {video.cover ? <img src={video.cover} alt={video.description || "Couverture de la vidéo TikTok"} className="h-full w-full object-cover" onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://placehold.co/480x852/3730a3/ffffff?text=Aperçu+non+disponible';
                }} /> : <div className="flex flex-col items-center justify-center text-tva-text/40">
                          <UploadCloud size={32} />
                          <p className="text-xs mt-2">Aperçu non disponible</p>
                        </div>}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <h3 className="text-white font-medium text-sm">{video.description || "Sans description"}</h3>
                    </div>
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <a href={video.url} target="_blank" rel="noopener noreferrer" className="bg-black/50 hover:bg-black/70 p-1.5 rounded-full transition-all" title="Voir sur TikTok">
                        <ExternalLink size={14} className="text-white" />
                      </a>
                      {video.downloadUrl && <a href={video.unwatermarkedUrl || video.downloadUrl} target="_blank" rel="noopener noreferrer" className="bg-tva-primary/80 hover:bg-tva-primary p-1.5 rounded-full transition-all" title="Télécharger la vidéo" download>
                          <Download size={14} className="text-white" />
                        </a>}
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="text-xs bg-black/50 text-white">
                        {formatDuration(video.duration)}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="bg-tva-surface rounded-lg p-2 text-center">
                      <p className="text-xs text-tva-text/70 mb-1">Vues</p>
                      <p className="font-semibold">{formatNumber(video.stats.views)}</p>
                    </div>
                    <div className="bg-tva-surface rounded-lg p-2 text-center">
                      <p className="text-xs text-tva-text/70 mb-1">Likes</p>
                      <p className="font-semibold">{formatNumber(video.stats.likes)}</p>
                    </div>
                    <div className="bg-tva-surface rounded-lg p-2 text-center">
                      <p className="text-xs text-tva-text/70 mb-1">Commentaires</p>
                      <p className="font-semibold">{formatNumber(video.stats.comments)}</p>
                    </div>
                    <div className="bg-tva-surface rounded-lg p-2 text-center">
                      <p className="text-xs text-tva-text/70 mb-1">Partages</p>
                      <p className="font-semibold">{formatNumber(video.stats.shares)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <img src={video.userAvatar} alt={video.nickname} className="w-8 h-8 rounded-full" onError={e => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/100/3730a3/ffffff?text=Avatar';
              }} />
                    <div className="flex items-center">
                      <p className="font-medium text-sm">{video.nickname}</p>
                      {video.isVerified && <span className="ml-1 bg-tva-primary/20 p-0.5 rounded-full">
                          <svg className="w-3 h-3 text-tva-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                        </span>}
                      <p className="text-xs text-tva-text/70 ml-1">@{video.username}</p>
                    </div>
                  </div>
                </section>
                
                <section className="glass p-4 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">Performance de la vidéo</h3>
                  <VideoMetricsDisplay metrics={analysis.metrics} />
                </section>

                <StrengthsWeaknesses strengths={analysis.strengths} weaknesses={analysis.weaknesses} />
                
                <section className="glass p-4 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">Recommandations</h3>
                  <VideoRecommendations recommendations={analysis.recommendations} />
                </section>

                <HashtagRecommendations hashtags={analysis.hashtags} />
              </div>}
          </> : <AccountAnalyzer />}
      </div>
    </AppLayout>;
};
export default AnalysePage;