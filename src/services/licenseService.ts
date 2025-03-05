
import { supabase } from '@/integrations/supabase/client';

export type LicenseStatus = 'active' | 'inactive' | 'expired';

export interface License {
  id: string;
  license_key: string;
  user_id: string | null;
  admin_id: string | null;
  status: LicenseStatus;
  activated_at: string | null;
  expires_at: string | null;
  created_at: string;
  price: number | null;
}

/**
 * Vérifie si un utilisateur a une licence active
 */
export const checkUserHasActiveLicense = async (): Promise<boolean> => {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    
    if (!currentUser || !currentUser.user) {
      return false;
    }
    
    // Utiliser la fonction RPC pour vérifier la licence
    const { data, error } = await supabase.rpc('has_active_license', {
      user_id: currentUser.user.id
    });
    
    if (error) {
      console.error('Error checking license status:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking license status:', error);
    return false;
  }
};

/**
 * Récupère les informations détaillées sur la licence d'un utilisateur
 */
export const getUserLicenseDetails = async (): Promise<License | null> => {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    
    if (!currentUser || !currentUser.user) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('user_id', currentUser.user.id)
      .eq('status', 'active')
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching license details:', error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      ...data,
      status: data.status as LicenseStatus
    };
  } catch (error) {
    console.error('Error fetching license details:', error);
    return null;
  }
};

/**
 * Active une licence pour l'utilisateur actuel
 */
export const activateLicense = async (licenseKey: string): Promise<{ success: boolean; message: string }> => {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    
    if (!currentUser || !currentUser.user) {
      return { success: false, message: "Utilisateur non authentifié" };
    }

    // Vérifier si la clé existe et est inactive
    const { data: license, error: fetchError } = await supabase
      .from('licenses')
      .select('*')
      .eq('license_key', licenseKey)
      .eq('status', 'inactive')
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error fetching license:', fetchError);
      return { success: false, message: "Erreur lors de la vérification de la licence" };
    }
    
    if (!license) {
      return { success: false, message: "Cette clé de licence n'existe pas ou a déjà été utilisée" };
    }
    
    // Vérifier si l'utilisateur a déjà une licence active
    const hasActiveLicense = await checkUserHasActiveLicense();
    if (hasActiveLicense) {
      return { success: false, message: "Vous avez déjà une licence active" };
    }
    
    // Activer la licence
    const now = new Date().toISOString();
    // La licence est valide pour 1 an (à ajuster selon vos besoins)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    
    const { error: updateError } = await supabase
      .from('licenses')
      .update({
        user_id: currentUser.user.id,
        status: 'active',
        activated_at: now,
        expires_at: expiresAt.toISOString()
      })
      .eq('id', license.id);
    
    if (updateError) {
      console.error('Error activating license:', updateError);
      return { success: false, message: "Erreur lors de l'activation de la licence" };
    }
    
    return { success: true, message: "Licence activée avec succès" };
  } catch (error) {
    console.error('Error activating license:', error);
    return { success: false, message: "Erreur lors de l'activation de la licence" };
  }
};

/**
 * Récupère les clés de licence disponibles pour l'administrateur
 */
export const getAvailableLicenseKeys = async (): Promise<License[]> => {
  try {
    const { data, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('status', 'inactive')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching available licenses:', error);
      throw error;
    }
    
    return data.map(license => ({
      ...license,
      status: license.status as LicenseStatus
    }));
  } catch (error) {
    console.error('Error fetching available licenses:', error);
    throw error;
  }
};
