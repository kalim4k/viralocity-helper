
/**
 * Formats a number to a readable string with K/M suffix
 * @param num The number to format
 * @returns A formatted string (e.g. 1.2K, 3.5M)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Formats a TikTok username (adds @ if missing)
 * @param username The username to format
 * @returns Formatted username with @ prefix
 */
export function formatUsername(username: string): string {
  if (!username) return '';
  return username.startsWith('@') ? username : `@${username}`;
}

/**
 * Handles errors and returns a user-friendly message
 * @param error The error object
 * @returns A user-friendly error message
 */
export function formatError(error: unknown): string {
  console.log('Formatting error:', error);
  
  if (error instanceof Error) {
    // Check for specific error messages from the TikTok API
    if (error.message.includes('No user found')) {
      return "Aucun utilisateur trouvé avec ce nom d'utilisateur. Vérifiez l'orthographe et réessayez.";
    }
    
    if (error.message.includes('Rate limit exceeded')) {
      return "Trop de requêtes. Veuillez attendre quelques minutes avant de réessayer.";
    }
    
    if (error.message.includes('Error fetching TikTok profile')) {
      return "Impossible de se connecter à TikTok en ce moment. Veuillez réessayer plus tard.";
    }
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return "Problème de connexion réseau. Vérifiez votre connexion internet et réessayez.";
    }
    
    if (error.message.includes('timeout') || error.message.includes('Timeout')) {
      return "La requête a pris trop de temps. Veuillez réessayer plus tard.";
    }
    
    if (error.message.includes('User data is incomplete')) {
      return "Les données de profil sont incomplètes. Essayez avec un autre compte.";
    }
    
    // Si c'est un message d'erreur générique, on le retourne directement
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  // Message d'erreur par défaut
  return "Une erreur s'est produite lors de la connexion à TikTok. Veuillez réessayer.";
}
