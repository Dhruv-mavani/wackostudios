/**
 * Strict email check shared by the form (client) and /api/book (server).
 * Local part: starts and ends with a letter or digit, may contain . _ % + - in between, no double dots, max 64.
 * Domain: dot-separated labels of letters, digits and inner hyphens, ending in a letter-only TLD of 2-24 characters.
 * Whole address max 254 characters, no spaces.
 */
const EMAIL_RE = /^(?!.*\.\.)[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,62}[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;

export const normalizeEmail = (v: string) => v.trim().toLowerCase();
export const isValidEmail = (v: string) => v.length <= 254 && EMAIL_RE.test(v);
export const EMAIL_ERROR = "Please enter a valid email address, like you@brand.com.";
