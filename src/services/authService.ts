
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const signUp = async (email: string, password: string, username?: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
        emailRedirectTo: `${window.location.origin}/auth?tab=login`,
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error("Error signing up:", error);
    
    // More user-friendly error messages
    let errorMessage = error.message;
    if (error.message.includes("User already registered")) {
      errorMessage = "Cet email est déjà utilisé. Veuillez vous connecter.";
    } else if (error.message.includes("Password")) {
      errorMessage = "Le mot de passe doit contenir au moins 6 caractères.";
    }
    
    toast.error(`Erreur lors de l'inscription: ${errorMessage}`);
    return { data: null, error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error("Error signing in:", error);
    
    // More user-friendly error messages
    let errorMessage = error.message;
    if (error.message.includes("Invalid login credentials")) {
      errorMessage = "Email ou mot de passe incorrect.";
    }
    
    toast.error(`Erreur lors de la connexion: ${errorMessage}`);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error("Error signing out:", error);
    toast.error(`Erreur lors de la déconnexion: ${error.message}`);
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { data: data.user, error: null };
  } catch (error: any) {
    console.error("Error getting current user:", error);
    return { data: null, error };
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?tab=reset-password`,
    });
    
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error("Error resetting password:", error);
    toast.error(`Erreur lors de la réinitialisation du mot de passe: ${error.message}`);
    return { error };
  }
};

export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error("Error updating password:", error);
    toast.error(`Erreur lors de la mise à jour du mot de passe: ${error.message}`);
    return { error };
  }
};
