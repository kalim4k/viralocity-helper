
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useLicense } from "@/contexts/LicenseContext";
import { useAuth } from "@/contexts/AuthContext";
import { LicenseRequired } from "./LicenseRequired";
import { toast } from "sonner";

interface ProtectedLicenseRouteProps {
  children: React.ReactNode;
}

export const ProtectedLicenseRoute: React.FC<ProtectedLicenseRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasLicense, isLoadingLicense, refreshLicenseStatus } = useLicense();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // Rafraîchir explicitement le statut de la licence lorsque le composant est monté
      refreshLicenseStatus().catch(err => {
        console.error("Erreur lors du rafraîchissement du statut de la licence:", err);
      });
    }
  }, [isAuthenticated, isLoading, refreshLicenseStatus]);

  useEffect(() => {
    // Lorsque les vérifications d'authentification et de licence sont terminées, marquer la vérification d'accès comme terminée
    if (!isLoading && !isLoadingLicense) {
      setIsCheckingAccess(false);
    }
  }, [isLoading, isLoadingLicense]);

  // Vérifier si nous chargeons toujours le statut d'authentification ou de licence
  if (isLoading || isLoadingLicense || isCheckingAccess) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-2 border-tva-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    toast.error("Veuillez vous connecter pour accéder à cette page");
    return <Navigate to="/auth" replace />;
  }

  // Afficher la page de licence requise si authentifié mais sans licence
  if (!hasLicense) {
    return <LicenseRequired />;
  }

  // L'utilisateur est authentifié et a une licence, afficher le contenu protégé
  return <>{children}</>;
};
