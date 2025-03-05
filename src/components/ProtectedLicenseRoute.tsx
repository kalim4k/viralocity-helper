
import React, { useState, useEffect } from "react";
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
      // Explicitly refresh license status when route is mounted
      refreshLicenseStatus().catch(err => {
        console.error("Error refreshing license status:", err);
      });
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    // When auth and license checks are complete, mark access checking as done
    if (!isLoading && !isLoadingLicense) {
      setIsCheckingAccess(false);
    }
  }, [isLoading, isLoadingLicense]);

  // Check if we're still loading auth or license status
  if (isLoading || isLoadingLicense || isCheckingAccess) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-2 border-tva-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    toast.error("Veuillez vous connecter pour accéder à cette page");
    return <Navigate to="/auth" replace />;
  }

  // Show license required page if authenticated but no license
  if (!hasLicense) {
    return <LicenseRequired />;
  }

  // User is authenticated and has license, show protected content
  return <>{children}</>;
};
