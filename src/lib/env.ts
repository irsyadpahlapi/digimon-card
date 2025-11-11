/**
 * Environment variable validation
 * This ensures all required env vars are present and valid
 */

const requiredEnvVars = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
} as const;

export function validateEnv(): void {
  const missing: string[] = [];
  const invalid: string[] = [];

  // Check for missing variables
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.warn(
      '⚠️  Missing environment variables:',
      missing.join(', '),
      '\nUsing fallback values.',
    );
  }

  // Validate API URL format
  const apiUrl = requiredEnvVars.NEXT_PUBLIC_API_URL;
  if (apiUrl && !isValidUrl(apiUrl)) {
    invalid.push('NEXT_PUBLIC_API_URL');
  }

  if (invalid.length > 0) {
    console.error(
      '❌ Invalid environment variables:',
      invalid.join(', '),
      '\nPlease check your .env.local file.',
    );
  }
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// Validate on module load (only in development)
if (process.env.NODE_ENV === 'development') {
  validateEnv();
}

// Export validated env vars with fallbacks
export const env = {
  apiUrl: requiredEnvVars.NEXT_PUBLIC_API_URL || 'https://digi-api.com/api/v1/digimon',
} as const;
