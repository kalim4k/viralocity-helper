
import React, { useState } from 'react';
import { AppLayout } from './AppLayout';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useLicense } from '@/contexts/LicenseContext';
import { ArrowRight, Key, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from './ui/alert';

export const LicenseRequired: React.FC = () => {
  const [licenseKey, setLicenseKey] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [activationError, setActivationError] = useState<string | null>(null);
  const { activateLicense } = useLicense();

  const handleActivate = async () => {
    if (!licenseKey.trim()) return;
    
    setIsActivating(true);
    setActivationError(null);
    
    try {
      console.log("Attempting to activate license on LicenseRequired page:", licenseKey.trim());
      const success = await activateLicense(licenseKey.trim());
      
      if (!success) {
        // L'erreur a déjà été affichée par le toast dans la fonction activateLicense
        setActivationError("Échec de l'activation. Veuillez vérifier que votre clé est valide.");
      }
    } catch (error) {
      console.error('Error during license activation:', error);
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
          <h1 className="text-2xl font-bold">Accès Limité</h1>
          <p className="text-tva-text/70">
            Cette fonctionnalité n'est disponible qu'avec une licence active
          </p>
        </div>

        <div className="glass p-6 rounded-xl space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm">
                Vous n'avez pas de licence active. Entrez votre clé de licence ci-dessous pour débloquer toutes les fonctionnalités de TikViral.
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
