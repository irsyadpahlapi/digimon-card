import { DigimonImpl } from '../digimonRepository';
import { BuyStarterpack } from '@/data/datasources/buyStarterpackDataSource';
import { DetailDigimonEntity } from '@/core/entities/digimon';
import { makeDetailDigimonEntity, createMockBuyStarterpack } from '@/__tests__/test-utils';

// Mock BuyStarterpack
jest.mock('@/data/datasources/buyStarterpackDataSource');
const MockedBuyStarterpack = BuyStarterpack as jest.MockedClass<typeof BuyStarterpack>;

describe('DigimonImpl Repository', () => {
  let digimonRepository: DigimonImpl;
  let mockBuyStarterpack: jest.Mocked<BuyStarterpack>;

  const mockDetailDigimon: DetailDigimonEntity = makeDetailDigimonEntity();

  beforeEach(() => {
    mockBuyStarterpack = createMockBuyStarterpack();

    MockedBuyStarterpack.mockImplementation(() => mockBuyStarterpack);
    digimonRepository = new DigimonImpl();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create BuyStarterpack datasource instance', () => {
      expect(MockedBuyStarterpack).toHaveBeenCalledTimes(1);
      expect(digimonRepository).toBeInstanceOf(DigimonImpl);
    });

    it('should initialize with private datasource property', () => {
      // Verify that the datasource is properly set
      expect(MockedBuyStarterpack).toHaveBeenCalledWith();
    });
  });

  describe('getDigimonById', () => {
    beforeEach(() => {
      mockBuyStarterpack.getDigimonById.mockResolvedValue(mockDetailDigimon);
    });

    it('should fetch digimon by ID through datasource', async () => {
      const result = await digimonRepository.getDigimonById(1);

      expect(mockBuyStarterpack.getDigimonById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockDetailDigimon);
      expect(result.id).toBe(1);
      expect(result.name).toBe('Agumon');
    });

    it('should handle different digimon IDs', async () => {
      const differentDigimon = makeDetailDigimonEntity({
        id: 25,
        name: 'Patamon',
        level: { id: 2, level: 'Rookie' },
      });

      mockBuyStarterpack.getDigimonById.mockResolvedValue(differentDigimon);

      const result = await digimonRepository.getDigimonById(25);

      expect(mockBuyStarterpack.getDigimonById).toHaveBeenCalledWith(25);
      expect(result.id).toBe(25);
      expect(result.name).toBe('Patamon');
    });

    it('should handle zero ID', async () => {
      const result = await digimonRepository.getDigimonById(0);

      expect(mockBuyStarterpack.getDigimonById).toHaveBeenCalledWith(0);
      expect(result).toEqual(mockDetailDigimon);
    });

    it('should handle negative ID', async () => {
      const result = await digimonRepository.getDigimonById(-1);

      expect(mockBuyStarterpack.getDigimonById).toHaveBeenCalledWith(-1);
      expect(result).toEqual(mockDetailDigimon);
    });

    it('should handle large ID numbers', async () => {
      const largeId = 999999;

      const result = await digimonRepository.getDigimonById(largeId);

      expect(mockBuyStarterpack.getDigimonById).toHaveBeenCalledWith(largeId);
      expect(result).toEqual(mockDetailDigimon);
    });

    it('should propagate errors from datasource', async () => {
      mockBuyStarterpack.getDigimonById.mockRejectedValue(new Error('Datasource error'));

      await expect(digimonRepository.getDigimonById(1)).rejects.toThrow('Datasource error');
      expect(mockBuyStarterpack.getDigimonById).toHaveBeenCalledWith(1);
    });

    it('should handle network timeout errors', async () => {
      mockBuyStarterpack.getDigimonById.mockRejectedValue(new Error('Request timeout'));

      await expect(digimonRepository.getDigimonById(1)).rejects.toThrow('Request timeout');
    });

    it('should handle API not found errors', async () => {
      mockBuyStarterpack.getDigimonById.mockRejectedValue(new Error('Digimon not found'));

      await expect(digimonRepository.getDigimonById(999)).rejects.toThrow('Digimon not found');
      expect(mockBuyStarterpack.getDigimonById).toHaveBeenCalledWith(999);
    });

    it('should return different digimon data for different calls', async () => {
      const agumon = { ...mockDetailDigimon, id: 1, name: 'Agumon' };
      const gabumon = { ...mockDetailDigimon, id: 2, name: 'Gabumon' };

      mockBuyStarterpack.getDigimonById
        .mockResolvedValueOnce(agumon)
        .mockResolvedValueOnce(gabumon);

      const result1 = await digimonRepository.getDigimonById(1);
      const result2 = await digimonRepository.getDigimonById(2);

      expect(result1.name).toBe('Agumon');
      expect(result2.name).toBe('Gabumon');
      expect(mockBuyStarterpack.getDigimonById).toHaveBeenCalledTimes(2);
    });
  });

  describe('Data validation', () => {
    beforeEach(() => {
      mockBuyStarterpack.getDigimonById.mockResolvedValue(mockDetailDigimon);
    });

    it('should return DetailDigimonEntity with all required properties', async () => {
      const result = await digimonRepository.getDigimonById(1);

      // Verify all required properties exist
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('images');
      expect(result).toHaveProperty('levels');
      expect(result).toHaveProperty('types');
      expect(result).toHaveProperty('attributes');
      expect(result).toHaveProperty('fields');
      expect(result).toHaveProperty('descriptions');
      expect(result).toHaveProperty('nextEvolutions');
      expect(result).toHaveProperty('level');

      // Verify property types
      expect(typeof result.id).toBe('number');
      expect(typeof result.name).toBe('string');
      expect(Array.isArray(result.images)).toBe(true);
      expect(Array.isArray(result.levels)).toBe(true);
      expect(Array.isArray(result.types)).toBe(true);
      expect(Array.isArray(result.attributes)).toBe(true);
      expect(Array.isArray(result.fields)).toBe(true);
      expect(Array.isArray(result.descriptions)).toBe(true);
      expect(Array.isArray(result.nextEvolutions)).toBe(true);
      expect(typeof result.level).toBe('object');
    });

    it('should handle digimon with empty arrays', async () => {
      const digimonWithEmptyArrays = makeDetailDigimonEntity({
        images: [],
        levels: [],
        types: [],
        attributes: [],
        fields: [],
        descriptions: [],
        nextEvolutions: [],
      });

      mockBuyStarterpack.getDigimonById.mockResolvedValue(digimonWithEmptyArrays);

      const result = await digimonRepository.getDigimonById(1);

      expect(result.images).toHaveLength(0);
      expect(result.levels).toHaveLength(0);
      expect(result.types).toHaveLength(0);
      expect(result.attributes).toHaveLength(0);
      expect(result.fields).toHaveLength(0);
      expect(result.descriptions).toHaveLength(0);
      expect(result.nextEvolutions).toHaveLength(0);
    });

    it('should handle digimon with complex nested data', async () => {
      const complexDigimon = makeDetailDigimonEntity({
        images: [
          { href: 'image1.jpg', transparent: true },
          { href: 'image2.png', transparent: false },
        ],
        nextEvolutions: [
          {
            id: 1,
            digimon: 'Evolution1',
            condition: 'Condition1',
            image: 'evo1.jpg',
            url: '/evo1',
          },
          {
            id: 2,
            digimon: 'Evolution2',
            condition: 'Condition2',
            image: 'evo2.jpg',
            url: '/evo2',
          },
          {
            id: 3,
            digimon: 'Evolution3',
            condition: 'Condition3',
            image: 'evo3.jpg',
            url: '/evo3',
          },
        ],
        descriptions: [
          { origin: 'Origin1', language: 'en', description: 'Description1' },
          { origin: 'Origin2', language: 'jp', description: 'Description2' },
        ],
      });

      mockBuyStarterpack.getDigimonById.mockResolvedValue(complexDigimon);

      const result = await digimonRepository.getDigimonById(1);

      expect(result.images).toHaveLength(2);
      expect(result.nextEvolutions).toHaveLength(3);
      expect(result.descriptions).toHaveLength(2);
      expect(result.images[0].transparent).toBe(true);
      expect(result.images[1].transparent).toBe(false);
    });
  });

  describe('Multiple instances', () => {
    it('should create independent datasource instances', () => {
      const repository1 = new DigimonImpl();
      const repository2 = new DigimonImpl();

      expect(MockedBuyStarterpack).toHaveBeenCalledTimes(3); // Initial + 2 new instances
      expect(repository1).not.toBe(repository2);
    });

    it('should handle concurrent requests from multiple instances', async () => {
      const repository1 = new DigimonImpl();
      const repository2 = new DigimonImpl();

      mockBuyStarterpack.getDigimonById.mockResolvedValue(mockDetailDigimon);

      const promises = [
        repository1.getDigimonById(1),
        repository2.getDigimonById(2),
        digimonRepository.getDigimonById(3),
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      for (const result of results) {
        expect(result).toEqual(mockDetailDigimon);
      }
    });
  });

  describe('Edge cases', () => {
    it('should handle very large response objects', async () => {
      const largeDigimon = makeDetailDigimonEntity({
        descriptions: new Array(100).fill(0).map((_, index) => ({
          origin: `Origin${index}`,
          language: 'en',
          description: `Very long description ${index}`.repeat(100),
        })),
        nextEvolutions: new Array(50).fill(0).map((_, index) => ({
          id: index as number,
          digimon: `Evolution${index}`,
          condition: `Condition${index}`,
          image: `evolution${index}.jpg`,
          url: `/evolution/${index}`,
        })),
      });

      mockBuyStarterpack.getDigimonById.mockResolvedValue(largeDigimon);

      const result = await digimonRepository.getDigimonById(1);

      expect(result.descriptions).toHaveLength(100);
      expect(result.nextEvolutions).toHaveLength(50);
    });

    it('should handle null/undefined values in response', async () => {
      const digimonWithNulls = makeDetailDigimonEntity({
        name: '',
        images: [{ href: '', transparent: false }],
        level: { id: 0, level: '' },
      });

      mockBuyStarterpack.getDigimonById.mockResolvedValue(digimonWithNulls);

      const result = await digimonRepository.getDigimonById(1);

      expect(result.name).toBe('');
      expect(result.images[0].href).toBe('');
      expect(result.level.level).toBe('');
    });
  });

  describe('Performance considerations', () => {
    it('should handle rapid successive calls', async () => {
      mockBuyStarterpack.getDigimonById.mockResolvedValue(mockDetailDigimon);

      const rapidCalls = new Array(10)
        .fill(0)
        .map((_, index) => digimonRepository.getDigimonById(index));

      const results = await Promise.all(rapidCalls);

      expect(results).toHaveLength(10);
      expect(mockBuyStarterpack.getDigimonById).toHaveBeenCalledTimes(10);
    });

    it('should maintain performance with large ID values', async () => {
      const largeIds = [1000000, 2000000, 3000000];

      mockBuyStarterpack.getDigimonById.mockResolvedValue(mockDetailDigimon);

      for (const id of largeIds) {
        const result = await digimonRepository.getDigimonById(id);
        expect(result).toEqual(mockDetailDigimon);
        expect(mockBuyStarterpack.getDigimonById).toHaveBeenCalledWith(id);
      }
    });
  });
});
