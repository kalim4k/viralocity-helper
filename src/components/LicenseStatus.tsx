
import React from 'react';
import { useLicense } from '@/contexts/LicenseContext';
import { CheckCircle, Clock, Shield, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const LicenseStatus: React.FC = () => {
  const { hasLicense, licenseKey, expiresAt } = useLicense();
  
  const formatExpiryDate = () => {
    if (!expiresAt) return 'Inconnue';
    try {
      return format(new Date(expiresAt), 'd MMMM yyyy', { locale: fr });
    } catch (error) {
      return 'Inconnue';
    }
  };
  
  const calculateDaysRemaining = () => {
    if (!expiresAt) return 0;
    try {
      const expiry = new Date(expiresAt);
      const today = new Date();
      const diffTime = expiry.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (error) {
      return 0;
    }
  };
  
  const daysRemaining = calculateDaysRemaining();
  
  return (
    <div className="glass p-5 rounded-xl">
      <div className="flex items-start space-x-4">
        <div className={`p-2 rounded-lg ${hasLicense ? 'bg-green-500/20' : 'bg-amber-500/20'}`}>
          {hasLicense ? (
            <Shield className="h-6 w-6 text-green-500" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">
            {hasLicense ? 'Licence Active' : 'Aucune Licence'}
          </h3>
          
          {hasLicense ? (
            <div className="space-y-2">
              <p className="text-sm text-tva-text/70">
                Votre licence vous donne accès à toutes les fonctionnalités premium de TikViral.
              </p>
              
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="p-3 bg-tva-surface rounded-lg flex flex-col">
                  <span className="text-xs text-tva-text/60 mb-1">Clé de licence</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                    <span className="text-sm font-medium">{licenseKey || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="p-3 bg-tva-surface rounded-lg flex flex-col">
                  <span className="text-xs text-tva-text/60 mb-1">Expiration</span>
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 text-tva-accent mr-1.5" />
                    <span className="text-sm font-medium">{formatExpiryDate()}</span>
                  </div>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg flex items-center space-x-2 ${
                daysRemaining <= 5 ? 'bg-amber-500/10 text-amber-500' : 'bg-tva-surface'
              }`}>
                {daysRemaining <= 5 ? (
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                ) : (
                  <Clock className="h-4 w-4 shrink-0 text-tva-text/60" />
                )}
                <span className="text-sm">
                  {daysRemaining > 0 
                    ? `Expire dans ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''}`
                    : "Votre licence a expiré"}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-tva-text/70">
              Activez une licence pour débloquer toutes les fonctionnalités premium de TikViral.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
