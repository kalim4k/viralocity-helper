import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, User, RefreshCw, CheckCircle, Clock, List } from 'lucide-react';
import { fetchTikTokProfile } from '@/services/tiktokService';
import { analyzeTikTokProfile } from '@/services/profileAnalysisService';
import { saveProfileAnalysis, getProfileAnalysesHistory } from '@/services/profileStorageService';
import { TikTokProfile } from '@/components/TikTokConnectModal';
import { TikTokProfileAnalysis } from '@/types/tiktok.types';
import { toast } from 'sonner';
import { formatNumber } from '@/utils/formatters';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const AccountAnalyzer: React.FC = () => {
  const [step, setStep] = useState<'upload' | 'scan' | 'username' | 'analysis'>('upload');
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [username, setUsername] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [profile, setProfile] = useState<TikTokProfile | null>(null);
  const [analysis, setAnalysis] = useState<TikTokProfileAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadAnalysisHistory();
    }
  }, [isAuthenticated]);

  const loadAnalysisHistory = async () => {
    try {
      const history = await getProfileAnalysesHistory();
      setAnalysisHistory(history);
    } catch (err) {
      console.error('Erreur lors du chargement de l\'historique:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        console.log("Image uploadée et chargée avec succès");
        setImage(event.target.result as string);
        setStep('scan');
        simulateScan();
      }
    };
    reader.readAsDataURL(file);
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      console.log("Capture de photo depuis la caméra");
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const scanSize = Math.min(video.videoWidth, video.videoHeight) * 0.7;
        const scanX = (video.videoWidth - scanSize) / 2;
        const scanY = (video.videoHeight - scanSize) / 2;
        
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        
        ctx.strokeStyle = '#4f46e5';
        ctx.lineWidth = 4;
        ctx.strokeRect(scanX, scanY, scanSize, scanSize);
        
        const dataUrl = canvas.toDataURL('image/jpeg');
        console.log("Photo capturée et convertie en base64");
        setImage(dataUrl);
        
        const stream = video.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        
        setStep('scan');
        simulateScan();
      }
    }
  };

  const startCamera = async () => {
    try {
      console.log("Démarrage de la caméra");
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          console.log("Caméra démarrée avec succès");
        }
      } else {
        console.error("Le navigateur ne prend pas en charge la caméra");
        toast("Votre navigateur ne prend pas en charge la caméra");
      }
    } catch (err) {
      console.error("Erreur d'accès à la caméra:", err);
      toast("Erreur d'accès à la caméra. Veuillez autoriser l'accès ou utiliser l'option d'upload.");
    }
  };

  const simulateScan = () => {
    console.log("Début de la simulation de scan");
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            console.log("Scan terminé, passage à l'étape du nom d'utilisateur");
            setIsScanning(false);
            setStep('username');
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 120);
  };

  const analyzeProfile = async () => {
    if (!username) {
      toast("Veuillez entrer un nom d'utilisateur TikTok");
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      console.log(`Début de l'analyse du profil TikTok: ${username}`);
      
      toast("Récupération du profil TikTok...");
      const profileData = await fetchTikTokProfile(username);
      console.log("Profil récupéré:", profileData);
      setProfile(profileData);
      
      toast("Analyse du profil en cours...");
      console.log("Début de l'analyse avec Gemini", image ? "avec image" : "sans image");
      const analysisResult = await analyzeTikTokProfile(profileData, image);
      console.log("Analyse terminée:", analysisResult);
      setAnalysis(analysisResult);
      
      if (isAuthenticated) {
        await saveProfileAnalysis(username, profileData, analysisResult, image);
        toast.success("Analyse sauvegardée dans votre historique!");
        
        loadAnalysisHistory();
      }
      
      setStep('analysis');
      
      toast("L'analyse de votre profil TikTok est prête !");
    } catch (err) {
      console.error('Erreur lors de l\'analyse:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur s\'est produite lors de l\'analyse';
      setError(errorMessage);
      
      toast(errorMessage);
      
      setStep('username');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadAnalysisFromHistory = (item: any) => {
    setUsername(item.tiktok_username);
    setProfile(item.profile_data);
    setAnalysis(item.analysis_results);
    setImage(item.image_data);
    setStep('analysis');
  };

  return (
    <div className="space-y-6">
      {isAuthenticated && (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'new' | 'history')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new">Nouvelle analyse</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>
          <TabsContent value="new">
            <section className="glass p-5 rounded-xl space-y-4">
              <h2 className="text-lg font-semibold">Analysez un compte TikTok</h2>
              
              <p className="text-sm text-tva-text/70">
                Prenez une photo de votre compte TikTok ou importez une capture d'écran pour une analyse complète.
              </p>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button 
                  onClick={startCamera}
                  className="flex flex-col items-center justify-center p-4 bg-tva-surface hover:bg-tva-surface/80 rounded-xl transition-all"
                >
                  <div className="bg-tva-primary/20 p-3 rounded-full mb-3">
                    <Camera size={24} className="text-tva-primary" />
                  </div>
                  <span className="text-sm font-medium">Prendre une photo</span>
                </button>
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-4 bg-tva-surface hover:bg-tva-surface/80 rounded-xl transition-all"
                >
                  <div className="bg-tva-secondary/20 p-3 rounded-full mb-3">
                    <Upload size={24} className="text-tva-secondary" />
                  </div>
                  <span className="text-sm font-medium">Importer une image</span>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </button>
              </div>
              
              <div className="relative">
                <video 
                  ref={videoRef} 
                  className="w-full aspect-[3/4] bg-black rounded-lg mt-4 object-cover hidden" 
                  autoPlay 
                  playsInline
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      videoRef.current.classList.remove('hidden');
                      
                      const scanOverlay = document.createElement('div');
                      scanOverlay.className = 'absolute inset-0 flex items-center justify-center';
                      scanOverlay.innerHTML = `
                        <div class="border-2 border-tva-primary w-3/4 h-3/4 rounded-lg flex items-center justify-center">
                          <div class="animate-pulse text-xs text-white bg-black/50 px-2 py-1 rounded">
                            Placez votre profil dans le cadre
                          </div>
                        </div>
                      `;
                      videoRef.current.parentNode?.appendChild(scanOverlay);
                      
                      const captureButton = document.createElement('button');
                      captureButton.className = 'absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white w-14 h-14 rounded-full border-4 border-tva-primary';
                      captureButton.onclick = capturePhoto;
                      videoRef.current.parentNode?.appendChild(captureButton);
                    }
                  }}
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </section>
          </TabsContent>
          <TabsContent value="history">
            <section className="glass p-5 rounded-xl">
              <h2 className="text-lg font-semibold mb-4">Historique des analyses</h2>
              
              {analysisHistory.length === 0 ? (
                <div className="text-center p-4 bg-tva-surface/50 rounded-lg">
                  <p className="text-tva-text/70">Aucune analyse dans l'historique</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analysisHistory.map((item) => (
                    <div key={item.id} className="flex items-center p-3 bg-tva-surface/50 rounded-lg hover:bg-tva-surface/80 cursor-pointer transition-all" onClick={() => loadAnalysisFromHistory(item)}>
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                        {item.image_data ? (
                          <img src={item.image_data} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <img src={item.profile_data.avatar} alt="Profile" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.profile_data.displayName}</p>
                        <p className="text-xs text-tva-text/70">@{item.tiktok_username}</p>
                      </div>
                      <div className="text-xs text-tva-text/70 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </TabsContent>
        </Tabs>
      )}

      {activeTab === 'new' && (
        <>
          {step === 'upload' && (
            <section className="glass p-5 rounded-xl space-y-4">
              <h2 className="text-lg font-semibold">Analysez un compte TikTok</h2>
              
              <p className="text-sm text-tva-text/70">
                Prenez une photo de votre compte TikTok ou importez une capture d'écran pour une analyse complète.
              </p>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button 
                  onClick={startCamera}
                  className="flex flex-col items-center justify-center p-4 bg-tva-surface hover:bg-tva-surface/80 rounded-xl transition-all"
                >
                  <div className="bg-tva-primary/20 p-3 rounded-full mb-3">
                    <Camera size={24} className="text-tva-primary" />
                  </div>
                  <span className="text-sm font-medium">Prendre une photo</span>
                </button>
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-4 bg-tva-surface hover:bg-tva-surface/80 rounded-xl transition-all"
                >
                  <div className="bg-tva-secondary/20 p-3 rounded-full mb-3">
                    <Upload size={24} className="text-tva-secondary" />
                  </div>
                  <span className="text-sm font-medium">Importer une image</span>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </button>
              </div>
              
              <div className="relative">
                <video 
                  ref={videoRef} 
                  className="w-full aspect-[3/4] bg-black rounded-lg mt-4 object-cover hidden" 
                  autoPlay 
                  playsInline
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      videoRef.current.classList.remove('hidden');
                      
                      const scanOverlay = document.createElement('div');
                      scanOverlay.className = 'absolute inset-0 flex items-center justify-center';
                      scanOverlay.innerHTML = `
                        <div class="border-2 border-tva-primary w-3/4 h-3/4 rounded-lg flex items-center justify-center">
                          <div class="animate-pulse text-xs text-white bg-black/50 px-2 py-1 rounded">
                            Placez votre profil dans le cadre
                          </div>
                        </div>
                      `;
                      videoRef.current.parentNode?.appendChild(scanOverlay);
                      
                      const captureButton = document.createElement('button');
                      captureButton.className = 'absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white w-14 h-14 rounded-full border-4 border-tva-primary';
                      captureButton.onclick = capturePhoto;
                      videoRef.current.parentNode?.appendChild(captureButton);
                    }
                  }}
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </section>
          )}
          
          {step === 'scan' && (
            <section className="glass p-6 rounded-xl space-y-6">
              <div className="text-center">
                <h2 className="text-lg font-semibold mb-2">Analyse en cours</h2>
                <p className="text-sm text-tva-text/70">
                  Nous analysons votre image pour extraire les informations pertinentes...
                </p>
              </div>
              
              <div className="relative">
                {image && (
                  <div className="relative rounded-lg overflow-hidden">
                    <img src={image} alt="Capture" className="w-full" />
                    
                    {isScanning && (
                      <div className="absolute inset-0 bg-gradient-to-b from-tva-primary/10 to-tva-primary/30 animate-pulse">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/50 backdrop-blur-sm p-4 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <RefreshCw size={20} className="text-tva-primary animate-spin" />
                              <span className="text-white font-medium">
                                Analyse d'image
                              </span>
                            </div>
                          </div>
                          
                          <div className="absolute inset-0">
                            <div className="w-full h-0.5 bg-tva-primary/50 absolute" style={{ top: `${scanProgress}%`, boxShadow: '0 0 10px rgba(79, 70, 229, 0.8)' }} />
                            <div className="h-full w-0.5 bg-tva-primary/50 absolute left-1/4 animate-pulse" style={{ boxShadow: '0 0 10px rgba(79, 70, 229, 0.8)' }} />
                            <div className="h-full w-0.5 bg-tva-primary/50 absolute left-3/4 animate-pulse" style={{ boxShadow: '0 0 10px rgba(79, 70, 229, 0.8)' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Analyse d'image</span>
                  <span>{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} />
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center text-xs">
                  <CheckCircle size={14} className={`mr-2 ${scanProgress > 20 ? 'text-tva-primary' : 'text-tva-text/30'}`} />
                  <span className={scanProgress > 20 ? 'text-tva-text' : 'text-tva-text/50'}>Détection de l'interface TikTok</span>
                </div>
                <div className="flex items-center text-xs">
                  <CheckCircle size={14} className={`mr-2 ${scanProgress > 40 ? 'text-tva-primary' : 'text-tva-text/30'}`} />
                  <span className={scanProgress > 40 ? 'text-tva-text' : 'text-tva-text/50'}>Extraction des éléments de la page</span>
                </div>
                <div className="flex items-center text-xs">
                  <CheckCircle size={14} className={`mr-2 ${scanProgress > 60 ? 'text-tva-primary' : 'text-tva-text/30'}`} />
                  <span className={scanProgress > 60 ? 'text-tva-text' : 'text-tva-text/50'}>Identification du profil</span>
                </div>
                <div className="flex items-center text-xs">
                  <CheckCircle size={14} className={`mr-2 ${scanProgress > 80 ? 'text-tva-primary' : 'text-tva-text/30'}`} />
                  <span className={scanProgress > 80 ? 'text-tva-text' : 'text-tva-text/50'}>Traitement des données</span>
                </div>
                <div className="flex items-center text-xs">
                  <CheckCircle size={14} className={`mr-2 ${scanProgress >= 100 ? 'text-tva-primary' : 'text-tva-text/30'}`} />
                  <span className={scanProgress >= 100 ? 'text-tva-text' : 'text-tva-text/50'}>Finalisation</span>
                </div>
              </div>
            </section>
          )}
          
          {step === 'username' && (
            <section className="glass p-5 rounded-xl space-y-4">
              <h2 className="text-lg font-semibold">Entrez votre nom d'utilisateur TikTok</h2>
              
              <p className="text-sm text-tva-text/70">
                Pour compléter l'analyse, veuillez entrer votre nom d'utilisateur TikTok.
              </p>
              
              {image && (
                <div className="rounded-lg overflow-hidden mb-4">
                  <img src={image} alt="Capture d'écran" className="w-full" />
                </div>
              )}
              
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tva-text/50" />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nom d'utilisateur (ex: mrbeast)" 
                    className="w-full bg-tva-surface/60 border border-tva-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-tva-primary text-black" 
                  />
                </div>
                <button 
                  onClick={analyzeProfile}
                  disabled={isAnalyzing || !username}
                  className={`${
                    isAnalyzing ? 'bg-tva-primary/70' : 'bg-tva-primary hover:bg-tva-primary/90'
                  } text-white py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center gap-2`}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Analyse...</span>
                    </>
                  ) : 'Analyser'}
                </button>
              </div>
              
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </section>
          )}
        </>
      )}
      
      {step === 'analysis' && profile && analysis && (
        <div className="space-y-6 animate-slide-up">
          <section className="glass p-4 rounded-xl">
            <div className="flex items-start">
              <img 
                src={profile.avatar} 
                alt={profile.displayName} 
                className="w-16 h-16 rounded-full mr-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://placehold.co/100/3730a3/ffffff?text=Avatar';
                }}
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="font-semibold">{profile.displayName}</h3>
                  {profile.verified && (
                    <span className="ml-1 bg-tva-primary/20 p-0.5 rounded-full">
                      <svg className="w-3 h-3 text-tva-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </span>
                  )}
                </div>
                <p className="text-xs text-tva-text/70">{profile.username}</p>
                <p className="text-sm mt-1">{profile.bio || 'Aucune bio.'}</p>
                
                <div className="flex space-x-4 mt-2">
                  <div className="text-center">
                    <p className="text-xs text-tva-text/70">Abonnés</p>
                    <p className="font-semibold">{formatNumber(profile.followers)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-tva-text/70">Abonnements</p>
                    <p className="font-semibold">{formatNumber(profile.following || 0)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-tva-text/70">Likes</p>
                    <p className="font-semibold">{formatNumber(profile.likes)}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <section className="glass p-4 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Analyse du profil</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Points forts</h4>
                <ul className="space-y-1">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-tva-text/90 flex items-start">
                      <span className="inline-block bg-tva-primary/20 text-tva-primary p-0.5 rounded mr-2 mt-0.5">
                        <CheckCircle size={12} />
                      </span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Améliorations possibles</h4>
                <ul className="space-y-1">
                  {analysis.improvements.map((improvement, index) => (
                    <li key={index} className="text-sm text-tva-text/90 flex items-start">
                      <span className="inline-block bg-yellow-500/20 text-yellow-500 p-0.5 rounded mr-2 mt-0.5">
                        <RefreshCw size={12} />
                      </span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          
          <section className="glass p-4 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Recommandations</h3>
            
            <div className="space-y-3">
              {analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="bg-tva-surface p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">{recommendation.title}</h4>
                  <p className="text-xs text-tva-text/70">{recommendation.description}</p>
                </div>
              ))}
            </div>
          </section>
          
          <section className="glass p-4 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Bio optimisée</h3>
            <div className="bg-tva-surface p-3 rounded-lg">
              <p className="text-sm">{analysis.optimizedBio}</p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
