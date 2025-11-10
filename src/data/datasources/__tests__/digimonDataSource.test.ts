import DigimonAPI from '../digimonDataSource';
import { ListDigimonEntity, DetailDigimonEntity } from '@/core/entities/digimon';

// Mock global fetch
globalThis.fetch = jest.fn();

describe('DigimonAPI DataSource', () => {
  let digimonAPI: DigimonAPI;
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    digimonAPI = new DigimonAPI();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getListDigimon', () => {
    const mockListDigimonResponse: ListDigimonEntity = {
      content: [
        {
          id: 1,
          name: 'Agumon',
          href: '/api/digimon/1',
          image: 'agumon.jpg',
        },
        {
          id: 2,
          name: 'Gabumon',
          href: '/api/digimon/2',
          image: 'gabumon.jpg',
        },
      ],
      pageable: {
        currentPage: 1,
        elementsOnPage: 2,
        totalElements: 100,
        totalPages: 50,
        previousPage: '',
        nextPage: '/api/v1/digimon?level=Rookie&page=2',
      },
    };

    it('should fetch list of digimon with level parameter', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockListDigimonResponse),
        ok: true,
        status: 200,
      } as any);

      const result = await digimonAPI.getListDigimon('Rookie');

      expect(mockFetch).toHaveBeenCalledWith('https://digi-api.com/api/v1/digimon?level=Rookie');
      expect(result).toEqual(mockListDigimonResponse);
      expect(result.content).toHaveLength(2);
      expect(result.content[0].name).toBe('Agumon');
    });

    it('should fetch list of digimon with level and pageSize parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockListDigimonResponse),
        ok: true,
        status: 200,
      } as any);

      const result = await digimonAPI.getListDigimon('Champion', 50);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://digi-api.com/api/v1/digimon?level=Champion&pageSize=50',
      );
      expect(result).toEqual(mockListDigimonResponse);
    });

    it('should handle empty level parameter', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockListDigimonResponse),
        ok: true,
        status: 200,
      } as any);

      const result = await digimonAPI.getListDigimon('');

      expect(mockFetch).toHaveBeenCalledWith('https://digi-api.com/api/v1/digimon?');
      expect(result).toEqual(mockListDigimonResponse);
    });

    it('should handle pageSize of 0', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockListDigimonResponse),
        ok: true,
        status: 200,
      } as any);

      const result = await digimonAPI.getListDigimon('Ultimate', 0);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://digi-api.com/api/v1/digimon?level=Ultimate&pageSize=0',
      );
      expect(result).toEqual(mockListDigimonResponse);
    });

    it('should handle API error responses', async () => {
      mockFetch.mockRejectedValueOnce(new Error('API Error'));

      await expect(digimonAPI.getListDigimon('Rookie')).rejects.toThrow('API Error');
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
        ok: true,
        status: 200,
      } as any);

      await expect(digimonAPI.getListDigimon('Rookie')).rejects.toThrow('Invalid JSON');
    });
  });

  describe('getDigimonById', () => {
    const mockDetailDigimonResponse: DetailDigimonEntity = {
      id: 1,
      name: 'Agumon',
      images: [{ href: 'agumon.jpg', transparent: false }],
      levels: [{ id: 1, level: 'Rookie' }],
      types: [{ id: 1, type: 'Vaccine' }],
      attributes: [{ id: 1, attribute: 'Fire' }],
      fields: [{ id: 1, field: 'Wind Guardians', image: 'field.jpg' }],
      descriptions: [
        {
          origin: 'Digital Monster Ver. 1',
          language: 'en',
          description: 'A small dinosaur Digimon',
        },
      ],
      nextEvolutions: [
        {
          id: 2,
          digimon: 'Greymon',
          condition: 'Level up',
          image: 'greymon.jpg',
          url: '/digimon/greymon',
        },
      ],
      level: { id: 1, level: 'Rookie' },
    };

    it('should fetch digimon by ID', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockDetailDigimonResponse),
        ok: true,
        status: 200,
      } as any);

      const result = await digimonAPI.getDigimonById(1);

      expect(mockFetch).toHaveBeenCalledWith('https://digi-api.com/api/v1/digimon/1');
      expect(result).toEqual(mockDetailDigimonResponse);
      expect(result.id).toBe(1);
      expect(result.name).toBe('Agumon');
    });

    it('should fetch digimon with different ID', async () => {
      const mockDigimon2 = { ...mockDetailDigimonResponse, id: 42, name: 'TestDigimon' };

      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockDigimon2),
        ok: true,
        status: 200,
      } as any);

      const result = await digimonAPI.getDigimonById(42);

      expect(mockFetch).toHaveBeenCalledWith('https://digi-api.com/api/v1/digimon/42');
      expect(result.id).toBe(42);
      expect(result.name).toBe('TestDigimon');
    });

    it('should remove priorEvolutions property from response', async () => {
      const responseWithPriorEvolutions = {
        ...mockDetailDigimonResponse,
        priorEvolutions: [{ id: 0, digimon: 'Some prior evolution' }],
      };

      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(responseWithPriorEvolutions),
        ok: true,
        status: 200,
      } as any);

      const result = await digimonAPI.getDigimonById(1);

      expect(result).not.toHaveProperty('priorEvolutions');
      expect(result.id).toBe(1);
      expect(result.name).toBe('Agumon');
    });

    it('should handle API error for specific ID', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Digimon not found'));

      await expect(digimonAPI.getDigimonById(999)).rejects.toThrow('Digimon not found');
      expect(mockFetch).toHaveBeenCalledWith('https://digi-api.com/api/v1/digimon/999');
    });

    it('should handle invalid JSON response for detail', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
        ok: true,
        status: 200,
      } as any);

      await expect(digimonAPI.getDigimonById(1)).rejects.toThrow('Invalid JSON');
    });

    it('should handle zero ID', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockDetailDigimonResponse),
        ok: true,
        status: 200,
      } as any);

      const result = await digimonAPI.getDigimonById(0);

      expect(mockFetch).toHaveBeenCalledWith('https://digi-api.com/api/v1/digimon/0');
      expect(result).toEqual(mockDetailDigimonResponse);
    });

    it('should handle negative ID', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockDetailDigimonResponse),
        ok: true,
        status: 200,
      } as any);

      const result = await digimonAPI.getDigimonById(-1);

      expect(mockFetch).toHaveBeenCalledWith('https://digi-api.com/api/v1/digimon/-1');
      expect(result).toEqual(mockDetailDigimonResponse);
    });
  });

  describe('API Integration', () => {
    it('should use correct base URL for all requests', async () => {
      const mockResponse = {
        json: jest.fn().mockResolvedValue({}),
        ok: true,
        status: 200,
      } as any;

      mockFetch.mockResolvedValue(mockResponse);

      await digimonAPI.getListDigimon('Rookie');
      await digimonAPI.getDigimonById(1);

      const calls = mockFetch.mock.calls;
      for (const call of calls) {
        expect(call[0]).toContain('https://digi-api.com/api/v1/digimon');
      }
    });

    it('should construct URLs correctly with multiple parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({}),
        ok: true,
        status: 200,
      } as any);

      await digimonAPI.getListDigimon('Ultimate', 25);

      const expectedUrl = 'https://digi-api.com/api/v1/digimon?level=Ultimate&pageSize=25';
      expect(mockFetch).toHaveBeenCalledWith(expectedUrl);
    });

    it('should handle special characters in level parameter', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({}),
        ok: true,
        status: 200,
      } as any);

      await digimonAPI.getListDigimon('In-Training');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://digi-api.com/api/v1/digimon?level=In-Training',
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
      mockFetch.mockResolvedValueOnce(undefined as any);

      await expect(digimonAPI.getDigimonById(9999)).rejects.toThrow(
        "Cannot read properties of undefined (reading 'json')",
      );
    });
  });
});
