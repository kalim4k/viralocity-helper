import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, User, RefreshCw, CheckCircle, Hexagon, Zap, Sparkles } from 'lucide-react';
import { fetchTikTokProfile } from '@/services/tiktokService';
import { analyzeTikTokProfile } from '@/services/profileAnalysisService';
import { TikTokProfile } from '@/types/tiktok.types';
import { TikTokProfileAnalysis } from '@/types/tiktok.types';
import { toast } from 'sonner';
import { formatNumber } from '@/utils/formatters';
import { Progress } from '@/components/ui/progress';

export const AccountAnalyzer: React.FC = () => {
  const [step, setStep] = useState<'upload' | 'capture-preview' | 'scan' | 'username' | 'analysis'>('upload');
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [username, setUsername] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [profile, setProfile] = useState<TikTokProfile | null>(null);
  const [analysis, setAnalysis] = useState<TikTokProfileAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [captureInProgress, setCaptureInProgress] = useState(false);
  const [detectionPoints, setDetectionPoints] = useState<{ x: number, y: number, label: string }[]>([]);
  const [transitionOverlay, setTransitionOverlay] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanTimerRef = useRef<number | null>(null);
  const detectionTimerRef = useRef<number | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      cleanupResources();
    };
  }, []);

  const cleanupResources = () => {
    if (scanTimerRef.current) window.clearInterval(scanTimerRef.current);
    if (detectionTimerRef.current) window.clearInterval(detectionTimerRef.current);
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => track.stop());
      cameraStreamRef.current = null;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
        startTransitionToScan();
      }
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      setShowCamera(true);
      setIsCameraReady(false);
      
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        
        cameraStreamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play().then(() => {
                setIsCameraReady(true);
                
                setTimeout(() => {
                  const newPoints = [
                    { x: 25, y: 30, label: 'Profil' },
                    { x: 70, y: 40, label: 'Stats' },
                    { x: 50, y: 60, label: 'Bio' },
                    { x: 30, y: 80, label: 'Vidéos' }
                  ];
                  
                  setDetectionPoints(newPoints);
                }, 800);
              });
            }
          };
        }
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Impossible d'accéder à la caméra. Vérifiez les permissions.");
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !cameraStreamRef.current || captureInProgress) {
      return;
    }
    
    setCaptureInProgress(true);
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setImage(dataUrl);
      
      setTransitionOverlay(true);
      
      setStep('capture-preview');
      
      setTimeout(() => {
        startTransitionToScan();
      }, 600);
    } else {
      setCaptureInProgress(false);
      toast.error("Erreur lors de la capture. Veuillez réessayer.");
    }
  };

  const startTransitionToScan = () => {
    setScanProgress(0);
    
    setTimeout(() => {
      setTransitionOverlay(false);
      setStep('scan');
      setIsScanning(true);
      simulateScan();
      
      setTimeout(() => {
        if (cameraStreamRef.current) {
          cameraStreamRef.current.getTracks().forEach(track => track.stop());
          cameraStreamRef.current = null;
        }
        setShowCamera(false);
        setCaptureInProgress(false);
      }, 300);
    }, 400);
  };

  const simulateScan = () => {
    setIsScanning(true);
    
    const baseDetectionPoints = detectionPoints.length ? detectionPoints : [];
    
    if (scanTimerRef.current) window.clearInterval(scanTimerRef.current);
    
    scanTimerRef.current = window.setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + 1.5;
        if (newProgress >= 100) {
          if (scanTimerRef.current) window.clearInterval(scanTimerRef.current);
          setTimeout(() => {
            setIsScanning(false);
            setStep('username');
          }, 800);
          return 100;
        }
        return newProgress;
      });
    }, 80);
    
    if (detectionTimerRef.current) window.clearInterval(detectionTimerRef.current);
    
    const additionalDetectionPoints = [
      { x: 25, y: 30, label: 'Avatar' },
      { x: 70, y: 25, label: 'Username' },
      { x: 40, y: 50, label: 'Followers' },
      { x: 60, y: 45, label: 'Bio' },
      { x: 30, y: 70, label: 'Content' },
      { x: 75, y: 60, label: 'Likes' },
      { x: 55, y: 80, label: 'Engagement' }
    ].filter(point => 
      !baseDetectionPoints.some(existing => 
        Math.abs(existing.x - point.x) < 10 && Math.abs(existing.y - point.y) < 10
      )
    );
    
    let index = 0;
    detectionTimerRef.current = window.setInterval(() => {
      if (index < additionalDetectionPoints.length) {
        setDetectionPoints(prev => [...prev, additionalDetectionPoints[index]]);
        index++;
      } else {
        if (detectionTimerRef.current) window.clearInterval(detectionTimerRef.current);
      }
    }, 400);
  };

  const analyzeProfile = async () => {
    if (!username) {
      toast.error("Veuillez entrer un nom d'utilisateur TikTok");
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const profileData = await fetchTikTokProfile(username);
      setProfile(profileData);
      
      const analysisResult = await analyzeTikTokProfile(profileData, image);
      setAnalysis(analysisResult);
      
      setStep('analysis');
      
      toast.success("L'analyse de votre profil TikTok est prête !");
    } catch (err) {
      console.error('Erreur lors de l\'analyse:', err);
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite lors de l\'analyse');
      
      toast.error(err instanceof Error ? err.message : 'Une erreur s\'est produite lors de l\'analyse');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
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
          
          {showCamera && (
            <div className={`mt-4 relative rounded-xl overflow-hidden transition-opacity duration-300 ${isCameraReady ? 'opacity-100' : 'opacity-0'}`}>
              <video 
                ref={videoRef} 
                className="w-full rounded-lg"
                muted
                playsInline
                autoPlay
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {!isCameraReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <div className="w-10 h-10 border-4 border-tva-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              <div className={`absolute inset-0 pointer-events-none border-2 border-tva-primary/50 z-10 transition-opacity duration-300 ${isCameraReady ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[80%] h-[80%] border-2 border-tva-primary border-dashed rounded-md flex items-center justify-center animate-pulse">
                    <div className="text-xs text-white bg-black/50 px-2 py-1 rounded">
                      Centrez le profil TikTok
                    </div>
                  </div>
                </div>
                
                {detectionPoints.map((point, idx) => (
                  <div 
                    key={idx} 
                    className="absolute animate-fade-in"
                    style={{
                      left: `${point.x}%`,
                      top: `${point.y}%`,
                      transform: 'translate(-50%, -50%)',
                      animationDelay: `${idx * 100}ms`
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-tva-primary rounded-full"></div>
                      <span className="text-[10px] bg-black/60 text-white px-1 rounded">
                        {point.label}
                      </span>
                    </div>
                  </div>
                ))}
                
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-tva-primary"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-tva-primary"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-tva-primary"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-tva-primary"></div>
              </div>
              
              <button
                onClick={capturePhoto}
                disabled={!isCameraReady || captureInProgress}
                className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 
                  ${!isCameraReady || captureInProgress ? 'bg-white/60 text-tva-primary/60' : 'bg-white text-tva-primary'} 
                  py-2 px-6 rounded-full font-medium flex items-center gap-2 shadow-lg transition-opacity duration-300
                  ${isCameraReady ? 'opacity-100' : 'opacity-0'}`}
              >
                {captureInProgress ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Capture...</span>
                  </>
                ) : (
                  <>
                    <Camera size={18} />
                    <span>Capturer</span>
                  </>
                )}
              </button>
            </div>
          )}
        </section>
      )}
      
      {step === 'capture-preview' && (
        <section className="glass p-6 rounded-xl space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">Traitement en cours</h2>
            <p className="text-sm text-tva-text/70">
              Préparation de l'image pour analyse...
            </p>
          </div>
          
          <div className="relative">
            {image && (
              <div className="relative rounded-lg overflow-hidden">
                <img src={image} alt="Capture" className="w-full" />
                
                {transitionOverlay && (
                  <div className="absolute inset-0 bg-gradient-to-b from-tva-primary/10 to-tva-primary/20 backdrop-blur-[1px] animate-pulse flex items-center justify-center">
                    <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg">
                      <div className="flex flex-col items-center">
                        <Sparkles size={20} className="text-tva-primary mb-2 animate-pulse" />
                        <p className="text-white text-sm">Préparation de l'analyse</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="absolute inset-0">
                  {detectionPoints.map((point, idx) => (
                    <div 
                      key={idx} 
                      className="absolute"
                      style={{
                        left: `${point.x}%`,
                        top: `${point.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="relative">
                        <Hexagon size={16} className="text-tva-primary/80 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 border-4 border-tva-primary border-t-transparent rounded-full animate-spin"></div>
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
                    <div className="absolute inset-0 backdrop-blur-[1px]">
                      <div className="absolute inset-0 backdrop-blur-[1px] opacity-30">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div 
                            key={`h-${i}`} 
                            className="absolute left-0 right-0 h-px bg-tva-primary/70"
                            style={{ top: `${(i+1) * 5}%` }}
                          ></div>
                        ))}
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div 
                            key={`v-${i}`} 
                            className="absolute top-0 bottom-0 w-px bg-tva-primary/70"
                            style={{ left: `${(i+1) * 5}%` }}
                          ></div>
                        ))}
                      </div>
                      
                      <div 
                        className="absolute left-0 right-0 h-1 bg-tva-primary shadow-[0_0_15px_rgba(79,70,229,0.8)]"
                        style={{ 
                          top: `${scanProgress}%`,
                          transition: 'top 0.5s ease-out'
                        }}
                      ></div>
                      
                      {detectionPoints.map((point, idx) => (
                        <div 
                          key={idx} 
                          className="absolute"
                          style={{
                            left: `${point.x}%`,
                            top: `${point.y}%`,
                            transform: 'translate(-50%, -50%)',
                            opacity: idx < 4 ? 1 : scanProgress > point.y ? 1 : 0.2,
                            transition: 'opacity 0.3s ease-out'
                          }}
                        >
                          <div className="relative">
                            <Hexagon size={20} className="text-tva-primary/80 animate-pulse" />
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
                              <span className="text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded-sm">
                                {point.label}
                              </span>
                              <div className="h-4 w-4 absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <div className="h-full w-[1px] bg-tva-primary/50 mx-auto"></div>
                              </div>
                            </div>
                          </div>
                          
                          {Array.from({ length: 3 }).map((_, dotIdx) => {
                            const angle = Math.random() * Math.PI * 2;
                            const distance = 15 + Math.random() * 25;
                            const x = Math.cos(angle) * distance;
                            const y = Math.sin(angle) * distance;
                            
                            return (
                              <div 
                                key={`dot-${idx}-${dotIdx}`}
                                className="absolute w-1 h-1 bg-tva-primary/70 rounded-full"
                                style={{
                                  left: `${x}px`,
                                  top: `${y}px`,
                                  opacity: 0.4 + Math.random() * 0.6,
                                  animation: `pulse ${1 + Math.random()}s infinite`
                                }}
                              ></div>
                            );
                          })}
                        </div>
                      ))}
                      
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <div className="bg-black/50 backdrop-blur-sm p-3 rounded-lg flex flex-col items-center justify-center">
                          <div className="flex items-center space-x-3 mb-2">
                            <Sparkles size={16} className="text-yellow-400 animate-pulse" />
                            <span className="text-white font-medium">
                              Analyse IA
                            </span>
                            <Sparkles size={16} className="text-yellow-400 animate-pulse" />
                          </div>
                          <div className="text-xs text-white/70">
                            Extraction des données du profil
                          </div>
                          <div className="mt-2 text-xs font-mono text-white/90 flex items-center">
                            <span className="text-tva-primary">{Math.floor(scanProgress)}</span>
                            <span>% complété</span>
                          </div>
                        </div>
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
              <span>{Math.floor(scanProgress)}%</span>
            </div>
            <Progress value={scanProgress} className="h-2" />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center text-xs">
              <CheckCircle size={14} className={`mr-2 ${scanProgress > 20 ? 'text-tva-primary' : 'text-tva-text/30'}`} />
              <span className={scanProgress > 20 ? 'text-tva-text' : 'text-tva-text/50'}>Détection de l'interface TikTok</span>
            </div>
            <div className="flex items-center text-xs">
              <CheckCircle size={14} className={`mr-2 ${scanProgress > 40 ? 'text-tva-primary' : 'text-tva-text/30'}`} />
              <span className={scanProgress > 40 ? 'text-tva-text' : 'text-tva-text/50'}>Extraction des éléments du profil</span>
            </div>
            <div className="flex items-center text-xs">
              <CheckCircle size={14} className={`mr-2 ${scanProgress > 60 ? 'text-tva-primary' : 'text-tva-text/30'}`} />
              <span className={scanProgress > 60 ? 'text-tva-text' : 'text-tva-text/50'}>Analyse des métriques</span>
            </div>
            <div className="flex items-center text-xs">
              <CheckCircle size={14} className={`mr-2 ${scanProgress > 80 ? 'text-tva-primary' : 'text-tva-text/30'}`} />
              <span className={scanProgress > 80 ? 'text-tva-text' : 'text-tva-text/50'}>Préparation des recommandations</span>
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
              ) : (
                <>
                  <Zap size={16} />
                  <span>Analyser</span>
                </>
              )}
            </button>
          </div>
          
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </section>
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
                <p className="text-xs text-tva-text/70">@{profile.username}</p>
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
