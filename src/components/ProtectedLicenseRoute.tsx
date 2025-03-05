
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useLicense } from "@/contexts/LicenseContext";
import { useAuth } from "@/contexts/AuthContext";
import { LicenseRequired } from "./LicenseRequired";
import { toast } from "sonner";

interface ProtectedLicenseRouteProps {
  children: React.ReactNode;
}

export const ProtectedLicenseRoute: React.FC<ProtectedLicenseRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const { hasLicense, isLoadingLicense, refreshLicenseStatus } = useLicense();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log(`Vérification de la licence pour l'accès à ${location.pathname}`);
      
      // Rafraîchir explicitement le statut de la licence lorsque le composant est monté
      refreshLicenseStatus().catch(err => {
        console.error("Erreur lors du rafraîchissement du statut de la licence:", err);
        toast.error("Impossible de vérifier votre licence. Veuillez réessayer.");
      });
    }
  }, [isAuthenticated, isLoading, refreshLicenseStatus, location.pathname]);

  useEffect(() => {
    // Lorsque les vérifications d'authentification et de licence sont terminées, marquer la vérification d'accès comme terminée
    if (!isLoading && !isLoadingLicense) {
      setIsCheckingAccess(false);
      
      if (isAuthenticated && hasLicense) {
        console.log(`Accès autorisé à ${location.pathname} - Licence valide`);
      }
    }
  }, [isLoading, isLoadingLicense, isAuthenticated, hasLicense, location.pathname]);

  // Vérifier si nous chargeons toujours le statut d'authentification ou de licence
  if (isLoading || isLoadingLicense || isCheckingAccess) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-tva-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-tva-text/70">Vérification de votre licence...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    console.log(`Accès refusé à ${location.pathname} - Non authentifié`);
    toast.error("Veuillez vous connecter pour accéder à cette page");
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // Afficher la page de licence requise si authentifié mais sans licence
  if (!hasLicense) {
    console.log(`Accès refusé à ${location.pathname} - Licence requise`);
    return <LicenseRequired />;
  }

  // L'utilisateur est authentifié et a une licence, afficher le contenu protégé
  return <>{children}</>;
};
