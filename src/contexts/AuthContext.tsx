
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCheckTime, setLastCheckTime] = useState(0);

  // Function to check license expiration with rate limiting
  const checkLicenseExpiration = async () => {
    try {
      // Rate limit to once every 15 seconds
      const now = Date.now();
      if (now - lastCheckTime < 15000) {
        console.log("Vérification d'expiration ignorée - trop récente");
        return;
      }
      
      console.log("Vérification de l'expiration des licences depuis AuthContext");
      await supabase.functions.invoke("check_license_expiration", {
        method: "POST",
      });
      
      setLastCheckTime(now);
    } catch (error) {
      console.error("Erreur lors de la vérification d'expiration des licences:", error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log(`État d'authentification changé: ${event}`);
      
      // Only synchronous state updates here to avoid deadlocks
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      // Handle specific auth events
      if (event === 'SIGNED_IN') {
        toast.success("Connexion réussie");
        
        // Check license expiration after sign in, with timeout to avoid race conditions
        setTimeout(checkLicenseExpiration, 1000);
      } else if (event === 'SIGNED_OUT') {
        toast.info("Déconnexion réussie");
      }
    });

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // If user is already signed in, check license expiration
        if (currentSession?.user) {
          // Delay the check to ensure proper initialization
          setTimeout(checkLicenseExpiration, 1000);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Clean up subscription
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        isLoading, 
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
