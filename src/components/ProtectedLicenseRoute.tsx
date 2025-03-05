
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useLicense } from "@/contexts/LicenseContext";
import { useAuth } from "@/contexts/AuthContext";
import { LicenseRequired } from "./LicenseRequired";
import { toast } from "sonner";
import { useCachedLicense } from "@/hooks/useCachedLicense";
import { getGeneratedProjects } from "@/services/generatedProjectsService";

interface ProtectedLicenseRouteProps {
  children: React.ReactNode;
}

export const ProtectedLicenseRoute: React.FC<ProtectedLicenseRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const { hasLicense, isLoadingLicense } = useLicense();
  const { verifyLicense, cachedHasLicense } = useCachedLicense();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [shouldShowContent, setShouldShowContent] = useState(false);
  const [hasCreatedFreeProject, setHasCreatedFreeProject] = useState(false);

  // Initial setup and cached license check
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // First use the cached value to make a quick decision
      if (cachedHasLicense) {
        setShouldShowContent(true);
        setIsCheckingAccess(false);
      } else {
        // If no cache or no license in cache, verify from the server
        const checkLicense = async () => {
          await verifyLicense();
          setIsCheckingAccess(false);
        };
        checkLicense();
      }
    } else if (!isLoading) {
      // Not authenticated and not loading
      setIsCheckingAccess(false);
    }
  }, [isAuthenticated, isLoading, cachedHasLicense, verifyLicense]);

  // Update based on license status changes
  useEffect(() => {
    if (!isLoadingLicense) {
      if (hasLicense) {
        setShouldShowContent(true);
      }
    }
  }, [hasLicense, isLoadingLicense]);

  // Check if user has created a free project (for Générateurs page)
  useEffect(() => {
    if (isAuthenticated && location.pathname === '/generateurs' && !hasLicense) {
      const checkFreeProject = async () => {
        try {
          const projects = await getGeneratedProjects();
          setHasCreatedFreeProject(projects.length > 0);
        } catch (error) {
          console.error("Error checking free project status:", error);
        }
      };
      checkFreeProject();
    }
  }, [isAuthenticated, location.pathname, hasLicense]);

  // Show loading state while checking access
  if (isLoading || (isCheckingAccess && !cachedHasLicense)) {
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

  // Special case for Générateurs page - allow access only if the user has no projects or has a license
  if (location.pathname === '/generateurs') {
    if (hasLicense || !hasCreatedFreeProject) {
      return <>{children}</>;
    } else {
      console.log(`Accès refusé à ${location.pathname} - Projet gratuit déjà utilisé`);
      return <LicenseRequired />;
    }
  }

  // Show license required page if no license
  if (!shouldShowContent && !hasLicense && !isLoadingLicense) {
    console.log(`Accès refusé à ${location.pathname} - Licence requise`);
    return <LicenseRequired />;
  }

  // User is authenticated and has a license (or we're showing cached content)
  return <>{children}</>;
};
