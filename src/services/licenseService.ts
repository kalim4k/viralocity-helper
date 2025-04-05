
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface License {
  id: string;
  license_key: string;
  status: 'active' | 'inactive' | 'expired';
  created_at: string;
  activated_at: string | null;
  expires_at: string | null;
  user_id: string | null;
}

/**
 * Checks if a user has an active license
 * @param userId The user ID to check
 * @returns True if the user has an active license
 */
export const checkUserHasLicense = async (userId: string): Promise<boolean> => {
  try {
    // First trigger a license expiration check
    await supabase.functions.invoke("check_license_expiration", {
      method: "POST"
    });
    
    // Then check for active license
    const { data, error } = await supabase
      .rpc('has_active_license', { user_id: userId });
    
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking if user has license:', error);
    return false;
  }
};

/**
 * Gets a user's active license details
 * @param userId The user ID to check
 * @returns The license details or null
 */
export const getUserActiveLicense = async (userId: string): Promise<License | null> => {
  try {
    const { data, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();
    
    if (error) throw error;
    
    // Ensure status is of the correct type
    if (data) {
      return {
        ...data,
        status: data.status as 'active' | 'inactive' | 'expired'
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user active license:', error);
    return null;
  }
};

/**
 * Verifies and activates a license key
 * @param licenseKey The license key to activate
 * @param userId The user ID to assign the license to
 * @returns True if activation successful
 */
export const activateLicenseKey = async (licenseKey: string, userId: string): Promise<boolean> => {
  try {
    // Check if license exists and is available
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .select('id, status, user_id')
      .eq('license_key', licenseKey)
      .maybeSingle();

    if (licenseError) throw licenseError;

    if (!license) {
      toast.error("Clé de licence invalide");
      return false;
    }

    if (license.status === 'expired') {
      toast.error("Cette licence a expiré");
      return false;
    }

    if (license.status === 'active' && license.user_id && license.user_id !== userId) {
      toast.error("Cette licence est déjà utilisée par un autre compte");
      return false;
    }

    // Set expiration date to 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Activate the license
    const { error: updateError } = await supabase
      .from('licenses')
      .update({
        status: 'active',
        user_id: userId,
        activated_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString()
      })
      .eq('id', license.id);

    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error activating license:', error);
    toast.error("Erreur lors de l'activation de la licence");
    return false;
  }
};

/**
 * Gets the expiry date of a user's license
 * @param userId The user ID to check
 * @returns The expiry date or null if no active license
 */
export const getLicenseExpiryDate = async (userId: string): Promise<string | null> => {
  try {
    const license = await getUserActiveLicense(userId);
    return license?.expires_at || null;
  } catch (error) {
    console.error('Error getting license expiry date:', error);
    return null;
  }
};
