
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { getCurrentUser } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      setIsLoading(true);
      
      const { data: currentUser } = await getCurrentUser();
      setUser(currentUser);
      
      setIsLoading(false);
    };

    initializeAuth();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Auth state changed: ${event}`);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Clean up subscription
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
