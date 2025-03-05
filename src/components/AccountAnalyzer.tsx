import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, User, RefreshCw, CheckCircle, Clock, XCircle, RotateCcw, Camera as CameraIcon } from 'lucide-react';
import { fetchTikTokProfile } from '@/services/tiktokService';
import { analyzeProfileWithAI } from '@/services/profileAIAnalysisService';
import { saveProfileAnalysis, getProfileAnalysesHistory } from '@/services/profileStorageService';
import { TikTokProfile } from '@/types/tiktok.types';
import { TikTokProfileAnalysis } from '@/types/tiktok.types';
import { toast } from '@/components/ui/use-toast';
import { formatNumber } from '@/utils/formatters';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FuturisticScan } from './FuturisticScan';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [showNewScan, setShowNewScan] = useState(false);
  const [isCameraPermissionDenied, setIsCameraPermissionDenied] = useState(false);
  const [imageAnalysisInProgress, setImageAnalysisInProgress] = useState(false);
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

  const checkCameraPermission = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      
      if (permissionStatus.state === 'denied') {
        setIsCameraPermissionDenied(true);
        throw new Error("L'accès à la caméra a été bloqué. Veuillez modifier les paramètres de votre navigateur.");
      }
      
      return true;
    } catch (err) {
      console.error("Erreur lors de la vérification des permissions:", err);
      if (err instanceof Error && err.name === 'TypeError') {
        return true;
      }
      return false;
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
        setShowNewScan(true);
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
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg');
        console.log("Photo capturée et convertie en base64");
        setImage(dataUrl);
        
        stopCameraStream();
        
        setIsCameraFullscreen(false);
        setCameraError(null);
        setStep('scan');
        setShowNewScan(true);
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
      
      const permissionGranted = await checkCameraPermission();
      if (!permissionGranted) {
        throw new Error("Impossible d'obtenir la permission d'accéder à la caméra");
      }
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Votre navigateur ne prend pas en charge l'accès à la caméra");
      }
      
      const facingMode = useFrontCamera ? "user" : "environment";
      console.log(`Trying to access camera with facingMode: ${facingMode}`);
      
      try {
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
          setIsCameraFullscreen(true);
          setIsFrontCamera(useFrontCamera);
        }
      } catch (constraintError) {
        console.error("Failed with ideal constraints, trying with basic constraints:", constraintError);
        
        const basicStream = await navigator.mediaDevices.getUserMedia({ 
          video: true
        });
        
        streamRef.current = basicStream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = basicStream;
          setIsCameraFullscreen(true);
        }
      }
    } catch (err) {
      console.error("Erreur d'accès à la caméra:", err);
      let errorMessage = "Erreur d'accès à la caméra";
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorMessage = "L'accès à la caméra a été refusé. Veuillez autoriser l'accès dans les paramètres de votre navigateur.";
          setIsCameraPermissionDenied(true);
        } else if (err.name === 'NotFoundError') {
          errorMessage = "Aucune caméra n'a été détectée sur votre appareil.";
        } else if (err.name === 'NotReadableError') {
          errorMessage = "La caméra est peut-être utilisée par une autre application.";
        } else {
          errorMessage = err.message || errorMessage;
        }
      }
      
      setCameraError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur de caméra",
        description: errorMessage,
      });
      setIsCameraFullscreen(false);
    } finally {
      setIsCameraLoading(false);
    }
  };

  const simulateScan = () => {
    console.log("Début de l'analyse de l'image");
    setImageAnalysisInProgress(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setImageAnalysisInProgress(false);
            setShowNewScan(false);
            setStep('username');
          }, 1000);
          return 100;
        }
        return newProgress;
      });
    }, 80);
  };

  const analyzeProfile = async () => {
    if (!username) {
      toast({
        title: "Nom d'utilisateur requis",
        description: "Veuillez entrer un nom d'utilisateur TikTok",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      console.log(`Début de l'analyse du profil TikTok: ${username}`);
      
      toast({
        title: "Récupération du profil",
        description: "Récupération des données TikTok en cours..."
      });
      
      const analysisResult = await analyzeProfileWithAI(username, image);
      
      const profileData = await fetchTikTokProfile(username);
      
      setProfile(profileData);
      setAnalysis(analysisResult);
      
      if (isAuthenticated) {
        await saveProfileAnalysis(username, profileData, analysisResult, image);
        toast({
          title: "Analyse sauvegardée",
          description: "L'analyse a été sauvegardée dans votre historique!",
          variant: "success"
        });
        
        loadAnalysisHistory();
      }
      
      setStep('analysis');
      
      toast({
        title: "Analyse terminée",
        description: "L'analyse de votre profil TikTok est prête !",
        variant: "success"
      });
    } catch (err) {
      console.error('Erreur lors de l\'analyse:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur s\'est produite lors de l\'analyse';
      setError(errorMessage);
      
      toast({
        title: "Erreur d'analyse",
        description: errorMessage,
        variant: "destructive"
      });
      
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
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    videoRef.current.play().catch(err => {
                      console.error("Erreur lecture vidéo:", err);
                      setCameraError("Impossible de démarrer la lecture vidéo");
                    });
                  }
                }}
              />
              
              <div className="absolute inset-0 z-10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div 
                      className="w-64 h-64 border-2 border-dashed border-tva-primary/70 rounded-lg"
                    >
                      <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-tva-primary"></div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-tva-primary"></div>
                      <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-tva-primary"></div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-tva-primary"></div>
                      
                      <motion.div 
                        className="absolute left-0 right-0 h-0.5 bg-tva-primary/70"
                        initial={{ top: 0 }}
                        animate={{ top: ["0%", "100%"] }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 1.5,
                          ease: "linear"
                        }}
                        style={{ boxShadow: "0 0 8px rgba(79, 70, 229, 0.8)" }}
                      />
                    </div>
                    
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white">
                      Placez le profil TikTok dans le cadre
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-8 inset-x-0 flex justify-center space-x-6">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    stopCameraStream();
                    setIsCameraFullscreen(false);
                  }} 
                  className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full"
                  aria-label="Annuler"
                >
                  <XCircle size={24} />
                </motion.button>
                
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={capturePhoto} 
                  className="bg-white w-16 h-16 rounded-full flex items-center justify-center"
                  aria-label="Prendre une photo"
                >
                  <div className="w-14 h-14 rounded-full border-4 border-tva-primary flex items-center justify-center">
                    <CameraIcon size={24} className="text-tva-primary" />
                  </div>
                </motion.button>
                
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={switchCamera} 
                  className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full"
                  aria-label="Changer de caméra"
                >
                  <RotateCcw size={24} />
                </motion.button>
              </div>
            </>
          )}
          
          {cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-30">
              <div className="text-white mb-4 text-center px-6 max-w-xs">
                <p className="font-semibold text-lg mb-2">Erreur de caméra</p>
                <p className="text-sm text-white/70 mb-4">{cameraError}</p>
                
                {isCameraPermissionDenied && (
                  <div className="mb-4 p-3 bg-white/10 rounded-lg text-xs">
                    <p>Pour utiliser la caméra, vous devez autoriser l'accès dans les paramètres de votre navigateur:</p>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Cliquez sur l'icône de cadenas/site dans la barre d'adresse</li>
                      <li>Trouvez les permissions de caméra</li>
                      <li>Modifiez-les pour "Autoriser"</li>
                      <li>Rafraîchissez la page</li>
                    </ol>
                  </div>
                )}
                
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
      <AnimatePresence>
        {showNewScan && (
          <FuturisticScan 
            isVisible={showNewScan}
            progress={scanProgress}
            onComplete={() => {
              setShowNewScan(false);
              setStep('username');
            }}
          />
        )}
      </AnimatePresence>
      
      {isAuthenticated && (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'new' | 'history')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new">Nouvelle analyse</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>
          <TabsContent value="new">
            {step === 'upload' && (
              <motion.section 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-5 rounded-xl space-y-4"
              >
                <h2 className="text-lg font-semibold">Analysez un compte TikTok</h2>
                
                <p className="text-sm text-tva-text/70">
                  Prenez une photo de votre compte TikTok ou importez une capture d'écran pour une analyse complète.
                </p>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startCamera(false)}
                    className="flex flex-col items-center justify-center p-4 bg-tva-surface hover:bg-tva-surface/80 rounded-xl transition-all"
                  >
                    <div className="bg-tva-primary/20 p-3 rounded-full mb-3">
                      <Camera size={24} className="text-tva-primary" />
                    </div>
                    <span className="text-sm font-medium">Prendre une photo</span>
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
                  </motion.button>
                </div>
              </motion.section>
            )}
            
            {step === 'username' && (
              <motion.section 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-5 rounded-xl space-y-4"
              >
                <h2 className="text-lg font-semibold">Entrez votre nom d'utilisateur TikTok</h2>
                
                <p className="text-sm text-tva-text/70">
                  Pour compléter l'analyse, veuillez entrer votre nom d'utilisateur TikTok.
                </p>
                
                {image && (
                  <div className="rounded-lg overflow-hidden mb-4 relative">
                    <img src={image} alt="Capture d'écran" className="w-full" />
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="w-full h-full bg-gradient-to-b from-transparent to-black/50"></div>
                      <div className="absolute bottom-2 left-2 text-white text-xs font-medium px-2 py-1 bg-black/30 backdrop-blur-sm rounded-full">
                        Image capturée
                      </div>
                    </div>
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
                      className="w-full bg-tva-surface/60 border border-tva-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-tva-primary" 
                    />
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
                  </motion.button>
                </div>
                
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}
              </motion.section>
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
                    <motion.div 
                      key={item.id} 
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                      whileTap={{ scale: 0.99 }}
                      className="flex items-center p-3 bg-tva-surface/50 rounded-lg hover:bg-tva-surface/80 cursor-pointer transition-all" 
                      onClick={() => loadAnalysisFromHistory(item)}
                    >
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
                    </motion.div>
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
                <motion.div 
                  key={index} 
                  className="bg-tva-surface p-3 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h4 className="font-medium text-sm mb-1">{recommendation.title}</h4>
                  <p className="text-xs text-tva-text/70">{recommendation.description}</p>
                </motion.div>
              ))}
            </div>
          </section>
          
          <section className="glass p-4 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Bio optimisée</h3>
            <div className="bg-tva-surface p-3 rounded-lg">
              <p className="text-sm whitespace-pre-line">{analysis.optimizedBio}</p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
