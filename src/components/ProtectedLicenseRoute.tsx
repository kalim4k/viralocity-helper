
import React from "react";
import { Navigate } from "react-router-dom";
import { useLicense } from "@/contexts/LicenseContext";
import { useAuth } from "@/contexts/AuthContext";
import { LicenseRequired } from "./LicenseRequired";

interface ProtectedLicenseRouteProps {
  children: React.ReactNode;
}

export const ProtectedLicenseRoute: React.FC<ProtectedLicenseRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasLicense, isLoadingLicense } = useLicense();

  // Check if we're still loading auth or license status
  if (isLoading || isLoadingLicense) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Show license required page if authenticated but no license
  if (!hasLicense) {
    return <LicenseRequired />;
  }

  // User is authenticated and has license, show protected content
  return <>{children}</>;
};
