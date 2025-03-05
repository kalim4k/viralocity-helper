
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

  // Function to check if user has an active license
  const checkLicenseStatus = async () => {
    if (!user) {
      setHasLicense(false);
      setIsLoadingLicense(false);
      return;
    }

    try {
      setIsLoadingLicense(true);
      
      // Utilisation d'une requête directe
      const { data, error } = await supabase
        .from('licenses')
        .select('license_key, status, expires_at')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        console.error('Error checking license status:', error);
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
      console.error('Error checking license status:', error);
      setHasLicense(false);
    } finally {
      setIsLoadingLicense(false);
    }
  };

  // Simplified license activation function
  const activateLicense = async (key: string): Promise<boolean> => {
    if (!user) {
      toast.error("Vous devez être connecté pour activer une licence");
      return false;
    }

    try {
      console.log("Attempting to activate license:", key);
      
      // First check if the license exists and is available (inactive)
      const { data: licenseCheck, error: checkError } = await supabase
        .from('licenses')
        .select('id, status')
        .eq('license_key', key)
        .is('user_id', null)  // Ensure license is not assigned to any user
        .eq('status', 'inactive')
        .maybeSingle();
      
      console.log("License check result:", licenseCheck, checkError);

      if (checkError) {
        console.error("Error checking license:", checkError);
        toast.error("Erreur lors de la vérification de la licence");
        return false;
      }

      if (!licenseCheck) {
        // Check if the license is already used by this user
        const { data: ownLicense, error: ownLicenseError } = await supabase
          .from('licenses')
          .select('id, status')
          .eq('license_key', key)
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (ownLicenseError) {
          console.error("Error checking own license:", ownLicenseError);
          return false;
        }
        
        if (ownLicense) {
          if (ownLicense.status === 'active') {
            toast.info("Cette licence est déjà active sur votre compte");
            await checkLicenseStatus();
            return true;
          } else if (ownLicense.status === 'expired') {
            toast.error("Cette licence a expiré");
            return false;
          }
        } else {
          // Check if license exists but is used by someone else
          const { data: anyLicense } = await supabase
            .from('licenses')
            .select('status')
            .eq('license_key', key)
            .maybeSingle();
            
          if (anyLicense) {
            if (anyLicense.status === 'active') {
              toast.error("Cette licence est déjà utilisée par un autre compte");
            } else if (anyLicense.status === 'expired') {
              toast.error("Cette licence a expiré");
            } else {
              toast.error("Cette licence n'est pas disponible");
            }
          } else {
            toast.error("Clé de licence invalide");
          }
          return false;
        }
      }

      // Set expiration date to 30 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      console.log("Updating license with ID:", licenseCheck.id);
      
      // Simplified activation process
      const { error: updateError } = await supabase
        .from('licenses')
        .update({
          status: 'active',
          user_id: user.id,
          activated_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString()
        })
        .eq('id', licenseCheck.id);

      if (updateError) {
        console.error("Error updating license:", updateError);
        toast.error("Erreur lors de l'activation de la licence");
        return false;
      }

      // Refresh license status
      await checkLicenseStatus();
      
      toast.success("Licence activée avec succès! Accès débloqué pour 30 jours.");
      return true;
    } catch (error) {
      console.error('Error activating license:', error);
      toast.error("Erreur lors de l'activation de la licence");
      return false;
    }
  };

  const refreshLicenseStatus = async () => {
    await checkLicenseStatus();
  };

  // Check license status on auth change
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
