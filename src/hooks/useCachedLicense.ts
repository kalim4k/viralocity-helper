
import { useState, useEffect, useCallback } from 'react';
import { useLicense } from '@/contexts/LicenseContext';

// Cache expiry time in milliseconds (5 minutes)
const CACHE_EXPIRY = 5 * 60 * 1000;

interface CachedLicenseState {
  hasLicense: boolean;
  timestamp: number;
}

export const useCachedLicense = () => {
  const { refreshLicenseStatus, hasLicense, isLoadingLicense } = useLicense();
  const [isVerifying, setIsVerifying] = useState(false);
  const [cachedLicenseStatus, setCachedLicenseStatus] = useState<boolean | null>(null);
  
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
    
    return null;
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
    // First check cache
    const cachedLicense = getLicenseFromCache();
    if (cachedLicense !== null) {
      console.log('Using cached license status');
      return cachedLicense.hasLicense;
    }

    console.log('Verifying license from server');
    setIsVerifying(true);
    try {
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
  }, [refreshLicenseStatus, hasLicense, getLicenseFromCache, updateLicenseCache]);

  // Update cache whenever license status changes
  useEffect(() => {
    if (!isLoadingLicense) {
      updateLicenseCache(hasLicense);
    }
  }, [hasLicense, isLoadingLicense, updateLicenseCache]);

  return {
    verifyLicense,
    isVerifying,
    cachedHasLicense: cachedLicenseStatus ?? hasLicense
  };
};
