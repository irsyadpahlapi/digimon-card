import {
  sanitizeInput,
  validateUsername,
  sanitizeNumber,
  secureCompare,
  checkRateLimit,
  clearRateLimit,
  safeJsonParse,
  validateApiResponse,
} from '../security';

describe('Security Utilities', () => {
  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeInput('Hello<script>alert("xss")</script>World')).toBe(
        'Helloscriptalert("xss")/scriptWorld',
      );
      expect(sanitizeInput('<div>Test</div>')).toBe('divTest/div');
    });

    it('should remove javascript: protocol', () => {
      expect(sanitizeInput('javascript:alert(1)')).toBe('alert(1)');
      expect(sanitizeInput('JAVASCRIPT:void(0)')).toBe('void(0)');
    });

    it('should remove event handlers', () => {
      expect(sanitizeInput('onclick=alert(1)')).toBe('alert(1)');
      expect(sanitizeInput('onload=malicious()')).toBe('malicious()');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
      expect(sanitizeInput('\n\ttest\n\t')).toBe('test');
    });

    it('should limit length to 100 characters', () => {
      const longString = 'a'.repeat(150);
      expect(sanitizeInput(longString)).toHaveLength(100);
    });

    it('should handle empty or invalid input', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput(null as unknown as string)).toBe('');
      expect(sanitizeInput(undefined as unknown as string)).toBe('');
      expect(sanitizeInput(123 as unknown as string)).toBe('');
    });
  });

  describe('validateUsername', () => {
    it('should accept valid usernames', () => {
      expect(validateUsername('john_doe')).toEqual({ valid: true });
      expect(validateUsername('user123')).toEqual({ valid: true });
      expect(validateUsername('Test-User.Name')).toEqual({ valid: true });
    });

    it('should reject empty username', () => {
      expect(validateUsername('')).toEqual({
        valid: false,
        error: 'Username is required',
      });
    });

    it('should reject username shorter than 3 characters', () => {
      expect(validateUsername('ab')).toEqual({
        valid: false,
        error: 'Username must be at least 3 characters',
      });
    });

    it('should reject username longer than 20 characters', () => {
      expect(validateUsername('a'.repeat(21))).toEqual({
        valid: false,
        error: 'Username must not exceed 20 characters',
      });
    });

    it('should reject username with invalid characters', () => {
      expect(validateUsername('user@email')).toEqual({
        valid: false,
        error: 'Username contains invalid characters',
      });
      expect(validateUsername('user#123')).toEqual({
        valid: false,
        error: 'Username contains invalid characters',
      });
    });

    it('should sanitize username before validation', () => {
      expect(validateUsername('<script>test</script>')).toEqual({
        valid: false,
        error: 'Username contains invalid characters',
      });
    });
  });

  describe('sanitizeNumber', () => {
    it('should sanitize valid numbers', () => {
      expect(sanitizeNumber(42)).toBe(42);
      expect(sanitizeNumber(100.7)).toBe(100);
      expect(sanitizeNumber('50')).toBe(50);
    });

    it('should enforce minimum value', () => {
      expect(sanitizeNumber(-10, 0)).toBe(0);
      expect(sanitizeNumber(5, 10)).toBe(10);
    });

    it('should enforce maximum value', () => {
      expect(sanitizeNumber(1000, 0, 100)).toBe(100);
      expect(sanitizeNumber(50, 0, 30)).toBe(30);
    });

    it('should handle NaN values', () => {
      expect(sanitizeNumber(Number.NaN)).toBe(0);
      expect(sanitizeNumber('invalid')).toBe(0);
      expect(sanitizeNumber(undefined)).toBe(0);
    });

    it('should handle Infinity', () => {
      expect(sanitizeNumber(Infinity)).toBe(0);
      expect(sanitizeNumber(-Infinity)).toBe(0);
    });

    it('should floor decimal numbers', () => {
      expect(sanitizeNumber(42.9)).toBe(42);
      expect(sanitizeNumber(1.1)).toBe(1);
    });
  });

  describe('secureCompare', () => {
    it('should return true for equal strings', () => {
      expect(secureCompare('password', 'password')).toBe(true);
      expect(secureCompare('test123', 'test123')).toBe(true);
    });

    it('should return false for different strings', () => {
      expect(secureCompare('password', 'Password')).toBe(false);
      expect(secureCompare('abc', 'xyz')).toBe(false);
    });

    it('should return false for different length strings', () => {
      expect(secureCompare('short', 'longerstring')).toBe(false);
      expect(secureCompare('abc', 'ab')).toBe(false);
    });

    it('should handle non-string inputs', () => {
      expect(secureCompare(null as unknown as string, 'test')).toBe(false);
      expect(secureCompare('test', undefined as unknown as string)).toBe(false);
      expect(secureCompare(123 as unknown as string, 123 as unknown as string)).toBe(false);
    });

    it('should handle empty strings', () => {
      expect(secureCompare('', '')).toBe(true);
      expect(secureCompare('', 'nonempty')).toBe(false);
    });

    it('should handle unicode characters', () => {
      expect(secureCompare('😀', '😀')).toBe(true);
      expect(secureCompare('café', 'café')).toBe(true);
      expect(secureCompare('café', 'cafe')).toBe(false);
    });
  });

  describe('checkRateLimit', () => {
    beforeEach(() => {
      localStorage.clear();
      jest.clearAllMocks();
    });

    it('should allow action within rate limit', () => {
      expect(checkRateLimit('test', 5, 60000)).toBe(true);
      expect(checkRateLimit('test', 5, 60000)).toBe(true);
      expect(checkRateLimit('test', 5, 60000)).toBe(true);
    });

    it('should block action when rate limit exceeded', () => {
      for (let i = 0; i < 5; i++) {
        expect(checkRateLimit('test', 5, 60000)).toBe(true);
      }
      expect(checkRateLimit('test', 5, 60000)).toBe(false);
    });

    it('should use different keys for different actions', () => {
      for (let i = 0; i < 5; i++) {
        checkRateLimit('action1', 5, 60000);
      }
      expect(checkRateLimit('action1', 5, 60000)).toBe(false);
      expect(checkRateLimit('action2', 5, 60000)).toBe(true);
    });

    it('should expire old attempts outside time window', () => {
      const now = Date.now();
      const oldTimestamp = now - 70000; // 70 seconds ago

      localStorage.setItem('rateLimit_test', JSON.stringify([oldTimestamp]));

      expect(checkRateLimit('test', 5, 60000)).toBe(true);
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('rateLimit_test', 'invalid json');
      expect(checkRateLimit('test', 5, 60000)).toBe(true);
    });

    it('should handle invalid array data in localStorage', () => {
      localStorage.setItem('rateLimit_test', JSON.stringify({ invalid: 'object' }));
      expect(checkRateLimit('test', 5, 60000)).toBe(true);
    });

    it('should handle array with non-number values', () => {
      localStorage.setItem('rateLimit_test', JSON.stringify(['string', 'values']));
      expect(checkRateLimit('test', 5, 60000)).toBe(true);
    });

    it('should handle localStorage errors gracefully', () => {
      const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
      getItemSpy.mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(checkRateLimit('test', 5, 60000)).toBe(true);

      getItemSpy.mockRestore();
    });
  });

  describe('clearRateLimit', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should clear rate limit data for a key', () => {
      // Set up some rate limit data
      checkRateLimit('test', 5, 60000);
      expect(localStorage.getItem('rateLimit_test')).not.toBeNull();

      // Clear the rate limit
      clearRateLimit('test');
      expect(localStorage.getItem('rateLimit_test')).toBeNull();
    });

    it('should handle clearing non-existent key', () => {
      expect(() => clearRateLimit('nonexistent')).not.toThrow();
    });

    it('should handle localStorage errors gracefully', () => {
      const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
      removeItemSpy.mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => clearRateLimit('test')).not.toThrow();

      removeItemSpy.mockRestore();
    });

    it('should allow new attempts after clearing', () => {
      // Fill up the rate limit
      for (let i = 0; i < 5; i++) {
        checkRateLimit('test', 5, 60000);
      }
      expect(checkRateLimit('test', 5, 60000)).toBe(false);

      // Clear and try again
      clearRateLimit('test');
      expect(checkRateLimit('test', 5, 60000)).toBe(true);
    });
  });

  describe('safeJsonParse', () => {
    it('should parse valid JSON', () => {
      expect(safeJsonParse('{"name":"test"}', {})).toEqual({ name: 'test' });
      expect(safeJsonParse('[1,2,3]', [])).toEqual([1, 2, 3]);
      expect(safeJsonParse('"string"', '')).toBe('string');
    });

    it('should return fallback for invalid JSON', () => {
      expect(safeJsonParse('invalid json', { default: true })).toEqual({ default: true });
      expect(safeJsonParse('{broken', [])).toEqual([]);
    });

    it('should handle null and undefined', () => {
      // safeJsonParse returns fallback for null because parsed ?? fallback returns fallback when parsed is null
      expect(safeJsonParse('null', { default: true })).toEqual({ default: true });
      expect(safeJsonParse('undefined', { default: true })).toEqual({ default: true });
    });

    it('should preserve fallback type', () => {
      const fallback = { count: 0, items: [] as string[] };
      expect(safeJsonParse('invalid', fallback)).toEqual(fallback);
    });
  });

  describe('validateApiResponse', () => {
    it('should validate list response structure', () => {
      const validListResponse = {
        content: [{ id: 1, name: 'Test' }],
        pageable: {},
      };
      expect(validateApiResponse(validListResponse)).toBe(true);
    });

    it('should validate detail response structure', () => {
      const validDetailResponse = {
        id: 1,
        name: 'Agumon',
        levels: [],
      };
      expect(validateApiResponse(validDetailResponse)).toBe(true);
    });

    it('should reject invalid response types', () => {
      expect(validateApiResponse(null)).toBe(false);
      expect(validateApiResponse(undefined)).toBe(false);
      expect(validateApiResponse('string')).toBe(false);
      expect(validateApiResponse(123)).toBe(false);
    });

    it('should reject empty objects', () => {
      expect(validateApiResponse({})).toBe(false);
    });

    it('should reject objects without required properties', () => {
      expect(validateApiResponse({ random: 'data' })).toBe(false);
      expect(validateApiResponse({ content: 'not an array' })).toBe(false);
    });
  });
});
