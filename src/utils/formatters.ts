
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
