import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, User, RefreshCw, CheckCircle, Clock, List, XCircle, RotateCcw } from 'lucide-react';
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
import { Button } from '@/components/ui/button';

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
  const [isCameraFullscreen, setIsCameraFullscreen] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
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

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
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
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        
        const scanSize = Math.min(video.videoWidth, video.videoHeight) * 0.7;
        const scanX = (video.videoWidth - scanSize) / 2;
        const scanY = (video.videoHeight - scanSize) / 2;
        
        ctx.strokeStyle = '#4f46e5';
        ctx.lineWidth = 4;
        ctx.strokeRect(scanX, scanY, scanSize, scanSize);
        
        const dataUrl = canvas.toDataURL('image/jpeg');
        console.log("Photo capturée et convertie en base64");
        setImage(dataUrl);
        
        stopCameraStream();
        
        setIsCameraFullscreen(false);
        setCameraError(null);
        setStep('scan');
        simulateScan();
      }
    }
  };

  const switchCamera = async () => {
    setIsFrontCamera(!isFrontCamera);
    await startCamera(!isFrontCamera);
  };

  const startCamera = async (useFrontCamera = false) => {
    try {
      console.log("Démarrage de la caméra");
      setIsCameraLoading(true);
      setCameraError(null);
      
      stopCameraStream();
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Votre navigateur ne prend pas en charge l'accès à la caméra");
      }
      
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      
      if (permissionStatus.state === 'denied') {
        throw new Error("L'accès à la caméra a été bloqué. Veuillez modifier les paramètres de votre navigateur.");
      }
      
      const facingMode = useFrontCamera ? "user" : "environment";
      console.log(`Trying to access camera with facingMode: ${facingMode}`);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(err => {
            console.error("Erreur lors de la lecture de la vidéo:", err);
            setCameraError("Impossible de démarrer la lecture vidéo");
          });
        };
        
        setIsCameraFullscreen(true);
        setIsFrontCamera(useFrontCamera);
        console.log("Caméra démarrée avec succès");
      }
    } catch (err) {
      console.error("Erreur d'accès à la caméra:", err);
      let errorMessage = "Erreur d'accès à la caméra";
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = "L'accès à la caméra a été refusé. Veuillez autoriser l'accès dans les paramètres de votre navigateur.";
        } else if (err.name === 'NotFoundError') {
          errorMessage = "Aucune caméra n'a été détectée sur votre appareil.";
        } else if (err.name === 'NotReadableError') {
          errorMessage = "La caméra est peut-être utilisée par une autre application.";
        } else if (err.name === 'OverconstrainedError') {
          try {
            const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = fallbackStream;
            if (videoRef.current) {
              videoRef.current.srcObject = fallbackStream;
              await videoRef.current.play();
              setIsCameraFullscreen(true);
              console.log("Caméra démarrée avec les paramètres par défaut");
              setIsCameraLoading(false);
              return;
            }
          } catch (fallbackErr) {
            errorMessage = "Impossible d'accéder à la caméra avec les paramètres demandés.";
          }
        } else {
          errorMessage = err.message || errorMessage;
        }
      }
      
      setCameraError(errorMessage);
      toast.error(errorMessage);
      setIsCameraFullscreen(false);
    } finally {
      setIsCameraLoading(false);
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

  if (isCameraFullscreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="relative flex-1">
          {isCameraLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-tva-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white text-sm">Activation de la caméra...</p>
              </div>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                className="absolute inset-0 w-full h-full object-cover" 
                autoPlay 
                playsInline
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-tva-primary w-3/4 h-3/4 rounded-lg flex items-center justify-center">
                  <div className="animate-pulse text-sm bg-black/50 px-3 py-2 rounded">
                    Placez votre profil dans le cadre
                  </div>
                </div>
              </div>
              <div className="absolute bottom-24 left-0 right-0 flex justify-center">
                <button 
                  onClick={capturePhoto} 
                  className="bg-white w-16 h-16 rounded-full border-4 border-tva-primary"
                  aria-label="Prendre une photo"
                >
                </button>
              </div>
              <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-6">
                <button 
                  onClick={() => {
                    stopCameraStream();
                    setIsCameraFullscreen(false);
                  }} 
                  className="bg-black/50 text-white p-3 rounded-full"
                  aria-label="Annuler"
                >
                  <XCircle size={24} />
                </button>
                <button 
                  onClick={switchCamera} 
                  className="bg-black/50 text-white p-3 rounded-full"
                  aria-label="Changer de caméra"
                >
                  <RotateCcw size={24} />
                </button>
              </div>
            </>
          )}
          
          {cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
              <div className="text-white mb-4 text-center px-6">
                <p className="font-semibold text-lg mb-2">Erreur de caméra</p>
                <p className="text-sm text-white/70 mb-4">{cameraError}</p>
                <Button 
                  onClick={() => {
                    setIsCameraFullscreen(false);
                    setCameraError(null);
                  }}
                  variant="outline"
                >
                  Revenir à l'upload d'image
                </Button>
              </div>
            </div>
          )}
          
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isAuthenticated && (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'new' | 'history')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new">Nouvelle analyse</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>
          <TabsContent value="new">
            {step === 'upload' && (
              <section className="glass p-5 rounded-xl space-y-4">
                <h2 className="text-lg font-semibold">Analysez un compte TikTok</h2>
                
                <p className="text-sm text-tva-text/70">
                  Prenez une photo de votre compte TikTok ou importez une capture d'écran pour une analyse complète.
                </p>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button 
                    onClick={() => startCamera(false)}
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
