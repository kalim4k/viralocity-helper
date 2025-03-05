
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useLicense } from "@/contexts/LicenseContext";
import { useAuth } from "@/contexts/AuthContext";
import { LicenseRequired } from "./LicenseRequired";
import { toast } from "sonner";
import { useCachedLicense } from "@/hooks/useCachedLicense";

interface ProtectedLicenseRouteProps {
  children: React.ReactNode;
}

export const ProtectedLicenseRoute: React.FC<ProtectedLicenseRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const { hasLicense, isLoadingLicense } = useLicense();
  const { verifyLicense, cachedHasLicense } = useCachedLicense();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [licenseVerified, setLicenseVerified] = useState(false);

  // Initial setup - only run once when component mounts
  useEffect(() => {
    let isMounted = true;
    
    const checkAccess = async () => {
      if (!isAuthenticated || isLoading) return;
      
      try {
        // Only verify from server if we haven't verified yet since mounting
        if (!licenseVerified) {
          console.log("Vérification initiale de la licence");
          await verifyLicense();
          if (isMounted) setLicenseVerified(true);
        }
      } catch (err) {
        console.error("Erreur lors de la vérification de la licence:", err);
      } finally {
        if (isMounted) setIsCheckingAccess(false);
      }
    };
    
    checkAccess();
    
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isLoading, verifyLicense, licenseVerified]);

  // When loading states change, update checking state
  useEffect(() => {
    if (!isLoading && !isLoadingLicense) {
      setIsCheckingAccess(false);
    }
  }, [isLoading, isLoadingLicense]);

  // Show loading state while checking access
  if ((isLoading || isLoadingLicense || isCheckingAccess) && !licenseVerified) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-tva-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-tva-text/70">Vérification de votre accès...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log(`Accès refusé à ${location.pathname} - Non authentifié`);
    toast.error("Veuillez vous connecter pour accéder à cette page");
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // Show license required page if no license
  // Use cached value first for faster rendering
  if (!cachedHasLicense && !hasLicense) {
    console.log(`Accès refusé à ${location.pathname} - Licence requise`);
    return <LicenseRequired />;
  }

  // User is authenticated and has a license
  return <>{children}</>;
};
