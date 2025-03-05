
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  useEffect(() => {
    // When auth check is complete, mark access checking as done
    if (!isLoading) {
      setIsCheckingAccess(false);
    }
  }, [isLoading]);

  if (isLoading || isCheckingAccess) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-2 border-tva-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    toast.error("Veuillez vous connecter pour accéder à cette page");
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
