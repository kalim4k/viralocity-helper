
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
  if (error instanceof Error) {
    // Check for specific error messages
    if (error.message.includes('No user found')) {
      return "Aucun utilisateur trouvé avec ce nom d'utilisateur";
    }
    return error.message;
  }
  return "Une erreur s'est produite lors de la connexion à TikTok";
}
