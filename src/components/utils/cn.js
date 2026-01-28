/**
 * Utility function for className merging
 * Combines Tailwind CSS classes with conditional logic
 */

export function cn(...inputs) {
  return inputs
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
