
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

  // Function to check license expiration
  const checkLicenseExpiration = async () => {
    try {
      console.log("Calling license expiration check");
      const { error } = await supabase.functions.invoke("check_license_expiration", {
        method: "POST",
      });
      
      if (error) {
        console.error("Error checking license expiration:", error);
      } else {
        console.log("License expiration check successful");
      }
    } catch (error) {
      console.error("Error invoking license expiration function:", error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log(`Auth state changed: ${event}`);
      
      // Only synchronous state updates here to avoid deadlocks
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      // Handle specific auth events
      if (event === 'SIGNED_IN') {
        toast.success("Connexion réussie");
        
        // Check license expiration after sign in
        // Use setTimeout to avoid deadlocks in auth state change handler
        setTimeout(() => {
          checkLicenseExpiration();
        }, 0);
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
          await checkLicenseExpiration();
        }
      } catch (error) {
        console.error("Error getting session:", error);
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
