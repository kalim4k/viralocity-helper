
import React, { useState, useEffect } from 'react';
import { AppLayout } from './AppLayout';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useLicense } from '@/contexts/LicenseContext';
import { ArrowRight, Key, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Alert, AlertDescription } from './ui/alert';

// Page descriptions for each premium route
const PAGE_INFO = {
  '/generateurs': {
    title: 'Générateurs de Contenu',
    description: 'Créez facilement des scripts, des descriptions et des légendes optimisées pour TikTok grâce à notre outil d\'IA. Débloquez cette fonctionnalité pour gagner du temps et améliorer l\'engagement.'
  },
  '/boost': {
    title: 'Booster d\'Abonnés',
    description: 'Simulez l\'augmentation rapide de vos abonnés TikTok avec notre outil futuriste. Visualisez votre croissance potentielle et planifiez votre stratégie de développement.'
  },
  '/analyse': {
    title: 'Analyse de Profil',
    description: 'Obtenez une analyse détaillée de votre profil TikTok avec des recommandations pour améliorer votre visibilité, augmenter vos abonnés et optimiser votre contenu.'
  },
  '/telechargement': {
    title: 'Téléchargements',
    description: 'Accédez à une bibliothèque complète de ressources premium: modèles de vidéos, effets spéciaux, musiques libres de droits et formations exclusives pour réussir sur TikTok.'
  },
  '/tendance': {
    title: 'Tendances TikTok',
    description: 'Découvrez en temps réel les tendances TikTok: vidéos virales, hashtags populaires, défis en vogue et sons tendance pour rester à la pointe et créer du contenu pertinent.'
  }
};

export const LicenseRequired: React.FC = () => {
  const [licenseKey, setLicenseKey] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [activationError, setActivationError] = useState<string | null>(null);
  const { activateLicense } = useLicense();
  const location = useLocation();
  
  // Get current page info based on location
  const currentPageInfo = PAGE_INFO[location.pathname] || {
    title: 'Fonctionnalité Premium',
    description: 'Cette fonctionnalité n\'est disponible qu\'avec une licence active. Activez votre licence pour y accéder.'
  };

  const handleActivate = async () => {
    if (!licenseKey.trim()) {
      setActivationError("Veuillez entrer une clé de licence");
      return;
    }
    
    setIsActivating(true);
    setActivationError(null);
    
    try {
      console.log("Tentative d'activation de licence sur la page LicenseRequired:", licenseKey.trim());
      const success = await activateLicense(licenseKey.trim());
      
      if (!success) {
        setActivationError("Échec de l'activation. Veuillez vérifier que votre clé est valide.");
      }
    } catch (error) {
      console.error('Erreur lors de l\'activation de la licence:', error);
      setActivationError("Une erreur inattendue s'est produite. Veuillez réessayer plus tard.");
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-md mx-auto my-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-tva-surface rounded-full flex items-center justify-center">
            <Key size={24} className="text-tva-primary" />
          </div>
          <h1 className="text-2xl font-bold">{currentPageInfo.title}</h1>
          <p className="text-tva-text/70">
            {currentPageInfo.description}
          </p>
        </div>

        <div className="glass p-6 rounded-xl space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm">
                Vous n'avez pas de licence active. Entrez votre clé de licence ci-dessous pour débloquer toutes les fonctionnalités de TikViral pour 30 jours.
              </p>
            </div>
          </div>

          {activationError && (
            <Alert variant="destructive">
              <AlertDescription>{activationError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="licenseKey" className="text-sm font-medium">
              Clé de licence
            </label>
            <Input
              id="licenseKey"
              placeholder="XXXX-XXXX-XXXX-XXXX"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              className="bg-tva-surface"
            />
          </div>

          <Button 
            className="w-full" 
            onClick={handleActivate}
            disabled={isActivating || !licenseKey.trim()}
          >
            {isActivating ? (
              <>Activation en cours...</>
            ) : (
              <>
                <CheckCircle size={16} className="mr-2" />
                Activer ma licence
              </>
            )}
          </Button>
        </div>

        <div className="text-center space-y-3">
          <p className="text-sm text-tva-text/70">
            Vous n'avez pas de licence ? Contactez-nous pour en obtenir une.
          </p>
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowRight size={16} className="mr-2" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};
