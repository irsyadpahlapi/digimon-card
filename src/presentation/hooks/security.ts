// Security utilities for input validation and sanitization

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .trim()
    .replaceAll(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replaceAll(/javascript:/gi, '') // Remove javascript: protocol
    .replaceAll(/on\w+=/gi, '') // Remove event handlers like onclick=
    .slice(0, 100); // Limit length to prevent DoS
}

/**
 * Validate username format
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  const sanitized = sanitizeInput(username);

  if (!sanitized) {
    return { valid: false, error: 'Username is required' };
  }

  if (sanitized.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }

  if (sanitized.length > 20) {
    return { valid: false, error: 'Username must not exceed 20 characters' };
  }

  // Only allow alphanumeric, spaces, and basic punctuation
  const validPattern = /^[a-zA-Z0-9\s._-]+$/;
  if (!validPattern.test(sanitized)) {
    return { valid: false, error: 'Username contains invalid characters' };
  }

  return { valid: true };
}

/**
 * Validate and sanitize numeric input
 */
export function sanitizeNumber(value: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): number {
  const num = Number(value);

  if (Number.isNaN(num) || !Number.isFinite(num)) {
    return min;
  }

  return Math.max(min, Math.min(max, Math.floor(num)));
}

/**
 * Prevent timing attacks for sensitive comparisons
 */
export function secureCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.codePointAt(i)! ^ b.codePointAt(i)!;
  }

  return result === 0;
}

/**
 * Rate limiting helper for localStorage
 */
export function checkRateLimit(key: string, maxAttempts = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const storageKey = `rateLimit_${key}`;

  try {
    const data = localStorage.getItem(storageKey);

    // Safely parse the data
    let attempts: number[] = [];
    if (data) {
      const parsed = JSON.parse(data);
      // Validate that parsed data is an array of numbers
      if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'number')) {
        attempts = parsed;
      }
    }

    // Filter out old attempts outside the time window
    const recentAttempts = attempts.filter((timestamp) => now - timestamp < windowMs);

    if (recentAttempts.length >= maxAttempts) {
      return false; // Rate limit exceeded
    }

    // Add current attempt
    recentAttempts.push(now);
    localStorage.setItem(storageKey, JSON.stringify(recentAttempts));

    return true;
  } catch {
    // If localStorage fails, allow the action
    return true;
  }
}

/**
 * Safely parse JSON with error handling
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Validate API response structure
 */
export function validateApiResponse(data: unknown): boolean {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Validate basic structure exists
  const response = data as Record<string, unknown>;

  // Check if it has expected properties for list response or detail response
  const hasListStructure = 'content' in response && Array.isArray(response.content);
  const hasDetailStructure = 'id' in response && 'name' in response;

  return hasListStructure || hasDetailStructure;
}
