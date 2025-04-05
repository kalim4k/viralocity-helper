
import { useState, useEffect, useCallback } from 'react';
import { useLicense } from '@/contexts/LicenseContext';
import { supabase } from "@/integrations/supabase/client";

// Cache expiry time in milliseconds (5 minutes)
const CACHE_EXPIRY = 5 * 60 * 1000;
// Minimum time between license checks in milliseconds (10 seconds)
const MIN_CHECK_INTERVAL = 10 * 1000;

interface CachedLicenseState {
  hasLicense: boolean;
  timestamp: number;
}

export const useCachedLicense = () => {
  const { refreshLicenseStatus, hasLicense, isLoadingLicense } = useLicense();
  const [isVerifying, setIsVerifying] = useState(false);
  const [cachedLicenseStatus, setCachedLicenseStatus] = useState<boolean | null>(null);
  const [lastVerifyTime, setLastVerifyTime] = useState(0);
  
  // Initialize cached license status on component mount
  useEffect(() => {
    const cachedData = getLicenseFromCache();
    if (cachedData) {
      setCachedLicenseStatus(cachedData.hasLicense);
    }
  }, []);

  const getLicenseFromCache = useCallback((): CachedLicenseState | null => {
    const cachedData = localStorage.getItem('license_status');
    if (!cachedData) return null;

    try {
      const parsed = JSON.parse(cachedData) as CachedLicenseState;
      const now = Date.now();
      
      // Check if cache is still valid
      if (now - parsed.timestamp < CACHE_EXPIRY) {
        return parsed;
      }
    } catch (error) {
      console.error('Error parsing cached license data', error);
    }
    
    // Clear expired or invalid cache
    localStorage.removeItem('license_status');
    return null;
  }, []);

  const clearLicenseCache = useCallback(() => {
    localStorage.removeItem('license_status');
    setCachedLicenseStatus(null);
  }, []);

  const updateLicenseCache = useCallback((licenseStatus: boolean) => {
    const data: CachedLicenseState = {
      hasLicense: licenseStatus,
      timestamp: Date.now()
    };
    localStorage.setItem('license_status', JSON.stringify(data));
    setCachedLicenseStatus(licenseStatus);
  }, []);

  const verifyLicense = useCallback(async () => {
    // Prevent multiple simultaneous verifications
    if (isVerifying) {
      return cachedLicenseStatus ?? hasLicense;
    }
    
    // Limit frequency of verification
    const now = Date.now();
    if (now - lastVerifyTime < MIN_CHECK_INTERVAL) {
      console.log('Skipping license verification - too recent');
      return cachedLicenseStatus ?? hasLicense;
    }

    // First check cache
    const cachedLicense = getLicenseFromCache();
    if (cachedLicense !== null) {
      console.log('Using cached license status');
      return cachedLicense.hasLicense;
    }

    console.log('Verifying license from server');
    setIsVerifying(true);
    setLastVerifyTime(now);
    
    try {
      // Force a license expiration check before getting the status
      // Note: This now includes frequency limiting inside the function
      await supabase.functions.invoke("check_license_expiration", {
        method: "POST",
      });
      
      await refreshLicenseStatus();
      // After refresh, update the cache with the new status
      updateLicenseCache(hasLicense);
      return hasLicense;
    } catch (error) {
      console.error('Failed to verify license', error);
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [refreshLicenseStatus, hasLicense, getLicenseFromCache, updateLicenseCache, isVerifying, lastVerifyTime, cachedLicenseStatus]);

  // Update cache whenever license status changes
  useEffect(() => {
    if (!isLoadingLicense) {
      updateLicenseCache(hasLicense);
    }
  }, [hasLicense, isLoadingLicense, updateLicenseCache]);

  return {
    verifyLicense,
    isVerifying,
    cachedHasLicense: cachedLicenseStatus ?? hasLicense,
    clearLicenseCache
  };
};
