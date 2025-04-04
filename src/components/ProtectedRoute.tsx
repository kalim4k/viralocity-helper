
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // When auth check is complete, mark access checking as done
    if (!isLoading) {
      setIsCheckingAccess(false);
    }
  }, [isLoading]);

  if (isLoading || isCheckingAccess) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-tva-primary" />
          <p className="text-sm text-tva-text/70">Vérification de l'accès...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    toast.error("Veuillez vous connecter pour accéder à cette page");
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
