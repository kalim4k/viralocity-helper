
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Code, Fingerprint, ScanLine, Zap } from 'lucide-react';

interface FuturisticScanProps {
  isVisible: boolean;
  progress: number;
  onComplete?: () => void;
  steps?: string[];
}

export const FuturisticScan: React.FC<FuturisticScanProps> = ({
  isVisible,
  progress,
  onComplete,
  steps = [
    "Détection du profil TikTok",
    "Analyse de l'image de profil",
    "Extraction des métriques",
    "Analyse de la biographie",
    "Génération des recommandations"
  ]
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Update current step based on progress
  useEffect(() => {
    const newStep = Math.min(Math.floor((progress / 100) * steps.length), steps.length - 1);
    setCurrentStep(newStep);
    
    if (progress >= 100 && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, steps.length, onComplete]);

  if (!isVisible) return null;
  
  const stepIcons = [
    ScanLine,
    Fingerprint,
    Code,
    Zap,
    CheckCircle
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm text-white">
      <AnimatePresence>
        <motion.div 
          className="w-[85%] max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative overflow-hidden rounded-xl mb-6">
            {/* Holographic grid over the image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-tva-primary/20 to-tva-accent/20 z-10">
              <div className="grid grid-cols-8 h-full">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div 
                    key={i}
                    className="border-[0.5px] border-white/10"
                  />
                ))}
              </div>
            </div>
            
            {/* Scanning effect */}
            <div 
              className="absolute inset-0 z-20"
              style={{
                background: `
                  repeating-linear-gradient(
                    0deg,
                    transparent,
                    rgba(79, 70, 229, 0.2) 2px,
                    transparent 4px
                  )
                `
              }}
            >
              <motion.div 
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-tva-primary via-tva-accent to-tva-primary"
                initial={{ top: "0%" }}
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "linear"
                }}
                style={{
                  boxShadow: "0 0 15px rgba(79, 70, 229, 0.6)"
                }}
              />
              
              {/* Scanning points */}
              {[0.2, 0.4, 0.6, 0.8].map((pos, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-tva-accent"
                  style={{ 
                    boxShadow: "0 0 10px rgba(213, 70, 239, 0.8), 0 0 20px rgba(213, 70, 239, 0.4)",
                    left: `${pos * 100}%`,
                  }}
                  initial={{ top: "0%" }}
                  animate={{
                    top: ["0%", "100%"],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3 + i * 0.5,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            
            {/* Data points highlight */}
            {[
              { x: 25, y: 30 },
              { x: 75, y: 25 },
              { x: 40, y: 60 },
              { x: 65, y: 70 },
            ].map((pos, i) => (
              <motion.div
                key={i}
                className="absolute z-30 w-16 h-16"
                style={{ 
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5,
                  delay: i * 1.5,
                  ease: "easeInOut"
                }}
              >
                <span className="absolute h-full w-full rounded-full border border-tva-accent" />
                <motion.span 
                  className="absolute h-full w-full rounded-full border border-tva-primary" 
                  animate={{ scale: [1, 1.6], opacity: [1, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    delay: i * 0.2,
                    ease: "easeOut"
                  }}
                />
                <motion.div
                  className="absolute top-0 left-0 h-0.5 w-4 bg-tva-accent"
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "linear"
                  }}
                  style={{
                    transformOrigin: "0 0",
                    boxShadow: "0 0 5px rgba(213, 70, 239, 0.8)"
                  }}
                />
              </motion.div>
            ))}
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-xs text-tva-text/80">
              <span>Analyse d'IA</span>
              <span>{Math.min(100, Math.round(progress))}%</span>
            </div>
            
            <div className="w-full h-1.5 bg-tva-surface rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-tva-primary to-tva-accent"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            <div className="space-y-2 mt-4">
              {steps.map((step, index) => {
                const StepIcon = stepIcons[index] || CheckCircle;
                const isActive = index <= currentStep;
                const isCurrentStep = index === currentStep;
                
                return (
                  <motion.div 
                    key={index}
                    className={`flex items-center space-x-3 py-1.5 px-3 rounded-lg transition-colors ${
                      isActive ? 'bg-tva-surface/40' : 'opacity-50'
                    } ${isCurrentStep ? 'border border-tva-primary/30' : ''}`}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <motion.div
                      className={`p-1 rounded-full ${
                        isActive ? 'bg-tva-primary/20 text-tva-primary' : 'bg-tva-surface/80 text-tva-text/40'
                      }`}
                      animate={isCurrentStep ? { 
                        scale: [1, 1.1, 1],
                      } : {}}
                      transition={{ 
                        repeat: isCurrentStep ? Infinity : 0,
                        duration: 1.5
                      }}
                    >
                      <StepIcon size={16} />
                    </motion.div>
                    <span className={`text-sm ${isActive ? 'text-white' : 'text-tva-text/50'}`}>
                      {step}
                    </span>
                    {isCurrentStep && (
                      <motion.div 
                        className="ml-auto h-2 w-2 rounded-full bg-tva-primary"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
