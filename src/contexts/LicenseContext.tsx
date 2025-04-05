
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface LicenseContextType {
  hasLicense: boolean;
  isLoadingLicense: boolean;
  licenseKey: string | null;
  expiresAt: string | null;
  activateLicense: (key: string) => Promise<boolean>;
  refreshLicenseStatus: () => Promise<void>;
}

const LicenseContext = createContext<LicenseContextType>({
  hasLicense: false,
  isLoadingLicense: true,
  licenseKey: null,
  expiresAt: null,
  activateLicense: async () => false,
  refreshLicenseStatus: async () => {},
});

export const useLicense = () => useContext(LicenseContext);

export const LicenseProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { user, isAuthenticated } = useAuth();
  const [hasLicense, setHasLicense] = useState(false);
  const [isLoadingLicense, setIsLoadingLicense] = useState(true);
  const [licenseKey, setLicenseKey] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isCheckingExpiration, setIsCheckingExpiration] = useState(false);
  
  // Utilisation d'un flag pour éviter les vérifications simultanées
  const [lastCheckTime, setLastCheckTime] = useState<number>(0);
  
  // Fonction pour vérifier l'expiration des licences avec restriction de fréquence
  const triggerLicenseExpirationCheck = async () => {
    // Éviter les appels multiples en peu de temps (minimum 5 secondes entre chaque appel)
    const now = Date.now();
    if (now - lastCheckTime < 5000) {
      console.log("Vérification d'expiration de licence ignorée - trop récente");
      return;
    }
    
    if (isCheckingExpiration) {
      console.log("Vérification d'expiration déjà en cours, ignorée");
      return;
    }
    
    try {
      setIsCheckingExpiration(true);
      console.log("Vérification de l'expiration des licences depuis LicenseContext");
      
      await supabase.functions.invoke("check_license_expiration", {
        method: "POST",
      });
      
      setLastCheckTime(Date.now());
    } catch (error) {
      console.error("Erreur lors de la vérification de l'expiration des licences:", error);
    } finally {
      setIsCheckingExpiration(false);
    }
  };

  // Fonction pour vérifier si l'utilisateur a une licence active
  const checkLicenseStatus = async () => {
    if (!user) {
      setHasLicense(false);
      setIsLoadingLicense(false);
      return;
    }

    try {
      setIsLoadingLicense(true);
      
      // D'abord, déclencher une vérification d'expiration des licences
      await triggerLicenseExpirationCheck();
      
      // Ensuite, interroger les licences actives
      const { data, error } = await supabase
        .from('licenses')
        .select('license_key, status, expires_at')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la vérification du statut de licence:', error);
        throw error;
      }
      
      if (data) {
        setHasLicense(true);
        setLicenseKey(data.license_key);
        setExpiresAt(data.expires_at);
      } else {
        setHasLicense(false);
        setLicenseKey(null);
        setExpiresAt(null);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut de licence:', error);
      setHasLicense(false);
    } finally {
      setIsLoadingLicense(false);
    }
  };

  // Activation de licence
  const activateLicense = async (key: string): Promise<boolean> => {
    if (!user) {
      toast.error("Vous devez être connecté pour activer une licence");
      return false;
    }

    try {
      console.log("Tentative d'activation de licence:", key);
      
      // Vérifier si la clé existe et est disponible
      const { data: licenseData, error: licenseError } = await supabase
        .from('licenses')
        .select('id, status, user_id')
        .eq('license_key', key)
        .maybeSingle();
      
      console.log("Résultat de la vérification de licence:", licenseData, licenseError);

      if (licenseError) {
        console.error("Erreur lors de la vérification de la licence:", licenseError);
        toast.error("Erreur lors de la vérification de la licence");
        return false;
      }

      // La licence n'existe pas
      if (!licenseData) {
        toast.error("Clé de licence invalide");
        return false;
      }

      // Vérifier si la licence appartient déjà à cet utilisateur
      if (licenseData.user_id === user.id) {
        if (licenseData.status === 'active') {
          toast.info("Cette licence est déjà active sur votre compte");
          await checkLicenseStatus();
          return true;
        } else if (licenseData.status === 'expired') {
          toast.error("Cette licence a expiré");
          return false;
        }
      } 
      // La licence appartient à un autre utilisateur
      else if (licenseData.user_id !== null && licenseData.user_id !== user.id) {
        toast.error("Cette licence est déjà utilisée par un autre compte");
        return false;
      }
      // La licence est déjà utilisée et expirée
      else if (licenseData.status === 'expired') {
        toast.error("Cette licence a expiré");
        return false;
      } 
      // La licence n'est pas disponible pour d'autres raisons
      else if (licenseData.status !== 'inactive') {
        toast.error("Cette licence n'est pas disponible");
        return false;
      }

      // Définir la date d'expiration à 30 jours à partir de maintenant
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      console.log("Mise à jour de la licence avec ID:", licenseData.id);
      
      // Activation de la licence avec processus simplifié
      const { error: updateError } = await supabase
        .from('licenses')
        .update({
          status: 'active',
          user_id: user.id,
          activated_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString()
        })
        .eq('id', licenseData.id);

      if (updateError) {
        console.error("Erreur lors de la mise à jour de la licence:", updateError);
        toast.error("Erreur lors de l'activation de la licence");
        return false;
      }

      // Actualiser le statut de la licence
      await checkLicenseStatus();
      
      toast.success("Licence activée avec succès! Accès débloqué pour 30 jours.");
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'activation de la licence:', error);
      toast.error("Erreur lors de l'activation de la licence");
      return false;
    }
  };

  const refreshLicenseStatus = async () => {
    await checkLicenseStatus();
  };

  // Vérifier le statut de la licence lors du changement d'authentification
  useEffect(() => {
    if (isAuthenticated) {
      checkLicenseStatus();
    } else {
      setHasLicense(false);
      setIsLoadingLicense(false);
    }
  }, [isAuthenticated, user?.id]);

  return (
    <LicenseContext.Provider
      value={{
        hasLicense,
        isLoadingLicense,
        licenseKey,
        expiresAt,
        activateLicense,
        refreshLicenseStatus
      }}
    >
      {children}
    </LicenseContext.Provider>
  );
};
