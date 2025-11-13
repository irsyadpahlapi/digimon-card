import DigimonAPI from '../digimonDataSource';
import { ListDigimonEntity, DetailDigimonEntity } from '../../../core/entities/digimon.d';
import { makeDetailDigimonEntity, makeListDigimonEntity } from '../../../__tests__/test-utils';

// Mock global fetch
globalThis.fetch = jest.fn();

describe('DigimonAPI DataSource', () => {
  let digimonAPI: DigimonAPI;
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
  const makeResponse = (overrides: Partial<Response>): Response => overrides as unknown as Response;

  beforeEach(() => {
    digimonAPI = new DigimonAPI();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getListDigimon', () => {
    const mockListDigimonResponse: ListDigimonEntity = makeListDigimonEntity(
      [
        { id: 1, name: 'Agumon', href: '/api/digimon/1', image: 'agumon.jpg' },
        { id: 2, name: 'Gabumon', href: '/api/digimon/2', image: 'gabumon.jpg' },
      ],
      {
        currentPage: 1,
        elementsOnPage: 2,
        totalElements: 100,
        totalPages: 50,
        previousPage: '',
        nextPage: '/api/v1/digimon?level=Rookie&page=2',
      },
    );

    it('should fetch list of digimon with level parameter', async () => {
      mockFetch.mockResolvedValueOnce(
        makeResponse({
          json: jest.fn().mockResolvedValue(mockListDigimonResponse) as unknown as Response['json'],
          ok: true,
          status: 200,
        }),
      );

      const result = await digimonAPI.getListDigimon('Rookie');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://digi-api.com/api/v1/digimon?level=Rookie',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
          signal: expect.any(Object),
        }),
      );
      expect(result).toEqual(mockListDigimonResponse);
      expect(result.content).toHaveLength(2);
      expect(result.content[0].name).toBe('Agumon');
    });

    it('should fetch list of digimon with level and pageSize parameters', async () => {
      mockFetch.mockResolvedValueOnce(
        makeResponse({
          json: jest.fn().mockResolvedValue(mockListDigimonResponse) as unknown as Response['json'],
          ok: true,
          status: 200,
        }),
      );

      const result = await digimonAPI.getListDigimon('Champion', 50);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://digi-api.com/api/v1/digimon?level=Champion&pageSize=50',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
          signal: expect.any(Object),
        }),
      );
      expect(result).toEqual(mockListDigimonResponse);
    });

    it('should handle empty level parameter', async () => {
      mockFetch.mockResolvedValueOnce(
        makeResponse({
          json: jest.fn().mockResolvedValue(mockListDigimonResponse) as unknown as Response['json'],
          ok: true,
          status: 200,
        }),
      );

      const result = await digimonAPI.getListDigimon('');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://digi-api.com/api/v1/digimon?',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
          signal: expect.any(Object),
        }),
      );
      expect(result).toEqual(mockListDigimonResponse);
    });

    it('should handle pageSize of 0', async () => {
      mockFetch.mockResolvedValueOnce(
        makeResponse({
          json: jest.fn().mockResolvedValue(mockListDigimonResponse) as unknown as Response['json'],
          ok: true,
          status: 200,
        }),
      );

      const result = await digimonAPI.getListDigimon('Ultimate', 0);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://digi-api.com/api/v1/digimon?level=Ultimate&pageSize=0',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
          signal: expect.any(Object),
        }),
      );
      expect(result).toEqual(mockListDigimonResponse);
    });

    it('should handle API error responses', async () => {
      mockFetch.mockRejectedValueOnce(new Error('API Error'));

      await expect(digimonAPI.getListDigimon('Rookie')).rejects.toThrow('API Error');
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce(
        makeResponse({
          json: jest
            .fn()
            .mockRejectedValue(new Error('Invalid JSON')) as unknown as Response['json'],
          ok: true,
          status: 200,
        }),
      );

      await expect(digimonAPI.getListDigimon('Rookie')).rejects.toThrow('Invalid JSON');
    });
  });

  describe('getDigimonById', () => {
    const mockDetailDigimonResponse: DetailDigimonEntity = makeDetailDigimonEntity();

    it('should fetch digimon by ID', async () => {
      mockFetch.mockResolvedValueOnce(
        makeResponse({
          json: jest
            .fn()
            .mockResolvedValue(mockDetailDigimonResponse) as unknown as Response['json'],
          ok: true,
          status: 200,
        }),
      );

      const result = await digimonAPI.getDigimonById(1);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://digi-api.com/api/v1/digimon/1',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
          signal: expect.any(Object),
        }),
      );
      expect(result).toEqual(mockDetailDigimonResponse);
      expect(result.id).toBe(1);
      expect(result.name).toBe('Agumon');
    });

    it('should fetch digimon with different ID', async () => {
      const mockDigimon2 = { ...mockDetailDigimonResponse, id: 42, name: 'TestDigimon' };

      mockFetch.mockResolvedValueOnce(
        makeResponse({
          json: jest.fn().mockResolvedValue(mockDigimon2) as unknown as Response['json'],
          ok: true,
          status: 200,
        }),
      );

      const result = await digimonAPI.getDigimonById(42);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://digi-api.com/api/v1/digimon/42',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
          signal: expect.any(Object),
        }),
      );
      expect(result.id).toBe(42);
      expect(result.name).toBe('TestDigimon');
    });

    it('should remove priorEvolutions property from response', async () => {
      const responseWithPriorEvolutions = {
        ...mockDetailDigimonResponse,
        priorEvolutions: [{ id: 0, digimon: 'Some prior evolution' }],
      };

      mockFetch.mockResolvedValueOnce(
        makeResponse({
          json: jest
            .fn()
            .mockResolvedValue(responseWithPriorEvolutions) as unknown as Response['json'],
          ok: true,
          status: 200,
        }),
      );

      const result = await digimonAPI.getDigimonById(1);

      expect(result).not.toHaveProperty('priorEvolutions');
      expect(result.id).toBe(1);
      expect(result.name).toBe('Agumon');
    });

    it('should handle API error for specific ID', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Digimon not found'));

      await expect(digimonAPI.getDigimonById(999)).rejects.toThrow('Digimon not found');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://digi-api.com/api/v1/digimon/999',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
          signal: expect.any(Object),
        }),
      );
    });

    it('should handle invalid JSON response for detail', async () => {
      mockFetch.mockResolvedValueOnce(
        makeResponse({
          json: jest
            .fn()
            .mockRejectedValue(new Error('Invalid JSON')) as unknown as Response['json'],
          ok: true,
          status: 200,
        }),
      );

      await expect(digimonAPI.getDigimonById(1)).rejects.toThrow('Invalid JSON');
    });

    it('should handle zero ID', async () => {
      await expect(digimonAPI.getDigimonById(0)).rejects.toThrow('Invalid Digimon ID');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should handle negative ID', async () => {
      await expect(digimonAPI.getDigimonById(-1)).rejects.toThrow('Invalid Digimon ID');
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('API Integration', () => {
    it('should use correct base URL for all requests', async () => {
      const mockResponse = makeResponse({
        json: jest.fn().mockResolvedValue({}) as unknown as Response['json'],
        ok: true,
        status: 200,
      });

      mockFetch.mockResolvedValue(mockResponse);

      await digimonAPI.getListDigimon('Rookie');
      await digimonAPI.getDigimonById(1);

      const calls = mockFetch.mock.calls;
      for (const call of calls) {
        expect(call[0]).toContain('https://digi-api.com/api/v1/digimon');
      }
    });

    it('should construct URLs correctly with multiple parameters', async () => {
      mockFetch.mockResolvedValueOnce(
        makeResponse({
          json: jest.fn().mockResolvedValue({}) as unknown as Response['json'],
          ok: true,
          status: 200,
        }),
      );

      await digimonAPI.getListDigimon('Ultimate', 25);

      const expectedUrl = 'https://digi-api.com/api/v1/digimon?level=Ultimate&pageSize=25';
      expect(mockFetch).toHaveBeenCalledWith(
        expectedUrl,
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
          signal: expect.any(Object),
        }),
      );
    });

    it('should handle special characters in level parameter', async () => {
      mockFetch.mockResolvedValueOnce(
        makeResponse({
          json: jest.fn().mockResolvedValue({}) as unknown as Response['json'],
          ok: true,
          status: 200,
        }),
      );

      await digimonAPI.getListDigimon('In-Training');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://digi-api.com/api/v1/digimon?level=In-Training',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
          signal: expect.any(Object),
        }),
      );
    });
  });

  describe('Error Handling', () => {
    it('should propagate network errors', async () => {
      // Mock fetch to reject for network errors - use separate test for each method
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(digimonAPI.getListDigimon('Rookie')).rejects.toThrow('Network error');
    });

    it('should propagate network errors for getDigimonById', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(digimonAPI.getDigimonById(1)).rejects.toThrow('Network error');
    });

    it('should handle failed response.json() calls', async () => {
      // Mock fetch to return undefined/null response (simulating network issues)
      mockFetch.mockResolvedValueOnce(undefined as unknown as Response);

      await expect(digimonAPI.getDigimonById(9999)).rejects.toThrow(
        "Cannot read properties of undefined (reading 'ok')",
      );
    });

    it('should handle HTTP error responses (status 404)', async () => {
      mockFetch.mockResolvedValueOnce(
        makeResponse({
          json: jest.fn().mockResolvedValue({}) as unknown as Response['json'],
          ok: false,
          status: 404,
        }),
      );

      await expect(digimonAPI.getListDigimon('Rookie')).rejects.toThrow('HTTP error! status: 404');
    });

    it('should handle HTTP error responses (status 500)', async () => {
      mockFetch.mockResolvedValueOnce(
        makeResponse({
          json: jest.fn().mockResolvedValue({}) as unknown as Response['json'],
          ok: false,
          status: 500,
        }),
      );

      await expect(digimonAPI.getDigimonById(1)).rejects.toThrow('HTTP error! status: 500');
    });

    it('should handle request timeout (AbortError)', async () => {
      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';

      mockFetch.mockRejectedValueOnce(abortError);

      await expect(digimonAPI.getListDigimon('Rookie')).rejects.toThrow(
        'Request timeout - please try again',
      );
    });

    it('should handle request timeout for getDigimonById', async () => {
      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';

      mockFetch.mockRejectedValueOnce(abortError);

      await expect(digimonAPI.getDigimonById(1)).rejects.toThrow(
        'Request timeout - please try again',
      );
    });

    it('should handle unknown error types', async () => {
      // Mock fetch to throw a non-Error object
      mockFetch.mockRejectedValueOnce('String error' as unknown as Error);

      await expect(digimonAPI.getListDigimon('Rookie')).rejects.toThrow(
        'An unknown error occurred',
      );
    });

    it('should handle unknown error types for getDigimonById', async () => {
      mockFetch.mockRejectedValueOnce({ weird: 'object' } as unknown as Error);

      await expect(digimonAPI.getDigimonById(1)).rejects.toThrow('An unknown error occurred');
    });

    it('should handle invalid response format (null data)', async () => {
      mockFetch.mockResolvedValueOnce(
        makeResponse({
          json: jest.fn().mockResolvedValue(null) as unknown as Response['json'],
          ok: true,
          status: 200,
        }),
      );

      await expect(digimonAPI.getListDigimon('Rookie')).rejects.toThrow('Invalid response format');
    });

    it('should handle invalid response format (non-object data)', async () => {
      mockFetch.mockResolvedValueOnce(
        makeResponse({
          json: jest.fn().mockResolvedValue('invalid string') as unknown as Response['json'],
          ok: true,
          status: 200,
        }),
      );

      await expect(digimonAPI.getListDigimon('Rookie')).rejects.toThrow('Invalid response format');
    });

    it('should handle invalid response format for getDigimonById (null)', async () => {
      mockFetch.mockResolvedValueOnce(
        makeResponse({
          json: jest.fn().mockResolvedValue(null) as unknown as Response['json'],
          ok: true,
          status: 200,
        }),
      );

      await expect(digimonAPI.getDigimonById(1)).rejects.toThrow('Invalid response format');
    });

    it('should handle invalid response format for getDigimonById (number)', async () => {
      mockFetch.mockResolvedValueOnce(
        makeResponse({
          json: jest.fn().mockResolvedValue(12345) as unknown as Response['json'],
          ok: true,
          status: 200,
        }),
      );

      await expect(digimonAPI.getDigimonById(1)).rejects.toThrow('Invalid response format');
    });
  });
});
