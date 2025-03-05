
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
      
      // Get user's active license if any
      const { data, error } = await supabase
        .from('licenses')
        .select('license_key, status, expires_at')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      
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

  // Function to activate a license key - SIMPLIFIED to avoid recursion issues
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
        .select('id, status, user_id')
        .eq('license_key', key)
        .maybeSingle();
      
      console.log("License check result:", licenseCheck, checkError);

      if (checkError) {
        console.error("Error checking license:", checkError);
        toast.error("Erreur lors de la vérification de la licence");
        return false;
      }

      if (!licenseCheck) {
        toast.error("Clé de licence invalide");
        return false;
      }

      if (licenseCheck.status === 'expired') {
        toast.error("Cette licence a expiré");
        return false;
      }

      if (licenseCheck.status === 'active' && licenseCheck.user_id && licenseCheck.user_id !== user.id) {
        toast.error("Cette licence est déjà utilisée par un autre compte");
        return false;
      }

      // Set expiration date to 30 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      console.log("Updating license with ID:", licenseCheck.id);
      
      // Activate the license
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
        throw updateError;
      }

      // Refresh license status
      await checkLicenseStatus();
      
      toast.success("Licence activée avec succès!");
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
