import { ListGatchaImpl } from '../listGatchaRepository';
import { BuyStarterpack } from '@/data/datasources/buyStarterpackDataSource';
import { DetailDigimonEntity } from '@/core/entities/digimon';

// Mock BuyStarterpack
jest.mock('@/data/datasources/buyStarterpackDataSource');
const MockedBuyStarterpack = BuyStarterpack as jest.MockedClass<typeof BuyStarterpack>;

// Helper function to create large test data arrays
const createLargeDigimonArray = (baseDigimon: DetailDigimonEntity, size: number) => {
  return new Array(size).fill(0).map((_, index) => ({
    ...baseDigimon,
    id: index + 1,
    name: `Digimon${index + 1}`,
  }));
};

describe('ListGatchaImpl Repository', () => {
  let listGatchaRepository: ListGatchaImpl;
  let mockBuyStarterpack: jest.Mocked<BuyStarterpack>;

  const mockDetailDigimon: DetailDigimonEntity = {
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

  const mockGatchaResult: DetailDigimonEntity[] = [
    { ...mockDetailDigimon, id: 1, name: 'Agumon' },
    { ...mockDetailDigimon, id: 2, name: 'Gabumon' },
    { ...mockDetailDigimon, id: 3, name: 'Patamon' },
    { ...mockDetailDigimon, id: 4, name: 'Tentomon' },
    { ...mockDetailDigimon, id: 5, name: 'Greymon' },
  ];

  beforeEach(() => {
    mockBuyStarterpack = {
      getListDigimon: jest.fn(),
      getListChampion: jest.fn(),
      getListGacha: jest.fn(),
      getDigimonById: jest.fn(),
    } as jest.Mocked<BuyStarterpack>;

    MockedBuyStarterpack.mockImplementation(() => mockBuyStarterpack);
    listGatchaRepository = new ListGatchaImpl();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create BuyStarterpack datasource instance', () => {
      expect(MockedBuyStarterpack).toHaveBeenCalledTimes(1);
      expect(listGatchaRepository).toBeInstanceOf(ListGatchaImpl);
    });

    it('should initialize with private datasource property', () => {
      expect(MockedBuyStarterpack).toHaveBeenCalledWith();
    });
  });

  describe('getListGacha', () => {
    beforeEach(() => {
      mockBuyStarterpack.getListGacha.mockResolvedValue(mockGatchaResult);
    });

    describe('Starterpack C', () => {
      it('should fetch gacha list for pack type C', async () => {
        const result = await listGatchaRepository.getListGacha('C');

        expect(mockBuyStarterpack.getListGacha).toHaveBeenCalledWith('C');
        expect(result).toEqual(mockGatchaResult);
        expect(result).toHaveLength(5);
      });

      it('should return array of DetailDigimonEntity for pack C', async () => {
        const result = await listGatchaRepository.getListGacha('C');

        for (const [index, digimon] of result.entries()) {
          expect(digimon).toHaveProperty('id');
          expect(digimon).toHaveProperty('name');
          expect(digimon).toHaveProperty('images');
          expect(digimon).toHaveProperty('level');
          expect(digimon.id).toBe(index + 1);
        }
      });
    });

    describe('Starterpack B', () => {
      it('should fetch gacha list for pack type B', async () => {
        const result = await listGatchaRepository.getListGacha('B');

        expect(mockBuyStarterpack.getListGacha).toHaveBeenCalledWith('B');
        expect(result).toEqual(mockGatchaResult);
        expect(result).toHaveLength(5);
      });

      it('should handle pack B specific composition', async () => {
        const packBResult = [
          { ...mockDetailDigimon, id: 1, name: 'ChildDigimon1' },
          { ...mockDetailDigimon, id: 2, name: 'ChildDigimon2' },
          { ...mockDetailDigimon, id: 3, name: 'ChampionDigimon1' },
          { ...mockDetailDigimon, id: 4, name: 'ChampionDigimon2' },
          { ...mockDetailDigimon, id: 5, name: 'UltimateDigimon' },
        ];

        mockBuyStarterpack.getListGacha.mockResolvedValue(packBResult);

        const result = await listGatchaRepository.getListGacha('B');

        expect(result).toHaveLength(5);
        expect(result[0].name).toBe('ChildDigimon1');
        expect(result[4].name).toBe('UltimateDigimon');
      });
    });

    describe('Starterpack A', () => {
      it('should fetch gacha list for pack type A', async () => {
        const result = await listGatchaRepository.getListGacha('A');

        expect(mockBuyStarterpack.getListGacha).toHaveBeenCalledWith('A');
        expect(result).toEqual(mockGatchaResult);
        expect(result).toHaveLength(5);
      });

      it('should handle pack A specific composition', async () => {
        const packAResult = [
          { ...mockDetailDigimon, id: 1, name: 'ChildDigimon' },
          { ...mockDetailDigimon, id: 2, name: 'ChampionDigimon1' },
          { ...mockDetailDigimon, id: 3, name: 'ChampionDigimon2' },
          { ...mockDetailDigimon, id: 4, name: 'UltimateDigimon1' },
          { ...mockDetailDigimon, id: 5, name: 'UltimateDigimon2' },
        ];

        mockBuyStarterpack.getListGacha.mockResolvedValue(packAResult);

        const result = await listGatchaRepository.getListGacha('A');

        expect(result).toHaveLength(5);
        expect(result[0].name).toBe('ChildDigimon');
        expect(result[3].name).toBe('UltimateDigimon1');
        expect(result[4].name).toBe('UltimateDigimon2');
      });
    });

    describe('Starterpack R', () => {
      it('should fetch gacha list for pack type R', async () => {
        const packRResult = [
          { ...mockDetailDigimon, id: 1, name: 'ChampionDigimon' },
          { ...mockDetailDigimon, id: 2, name: 'UltimateDigimon1' },
          { ...mockDetailDigimon, id: 3, name: 'UltimateDigimon2' },
          { ...mockDetailDigimon, id: 4, name: 'PerfectDigimon' },
        ];

        mockBuyStarterpack.getListGacha.mockResolvedValue(packRResult);

        const result = await listGatchaRepository.getListGacha('R');

        expect(mockBuyStarterpack.getListGacha).toHaveBeenCalledWith('R');
        expect(result).toEqual(packRResult);
        expect(result).toHaveLength(4);
      });

      it('should handle rare pack specific composition', async () => {
        const packRResult = [
          {
            ...mockDetailDigimon,
            id: 100,
            name: 'RareChampion',
            level: { id: 2, level: 'Champion' },
          },
          {
            ...mockDetailDigimon,
            id: 200,
            name: 'RareUltimate1',
            level: { id: 3, level: 'Ultimate' },
          },
          {
            ...mockDetailDigimon,
            id: 201,
            name: 'RareUltimate2',
            level: { id: 3, level: 'Ultimate' },
          },
          {
            ...mockDetailDigimon,
            id: 300,
            name: 'RarePerfect',
            level: { id: 4, level: 'Perfect' },
          },
        ];

        mockBuyStarterpack.getListGacha.mockResolvedValue(packRResult);

        const result = await listGatchaRepository.getListGacha('R');

        expect(result).toHaveLength(4);
        expect(result[0].level.level).toBe('Champion');
        expect(result[3].level.level).toBe('Perfect');
        expect(result[3].id).toBe(300);
      });
    });

    describe('Invalid starterpack types', () => {
      it('should handle unknown starterpack type', async () => {
        mockBuyStarterpack.getListGacha.mockResolvedValue([]);

        const result = await listGatchaRepository.getListGacha('X');

        expect(mockBuyStarterpack.getListGacha).toHaveBeenCalledWith('X');
        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
      });

      it('should handle empty string starterpack type', async () => {
        mockBuyStarterpack.getListGacha.mockResolvedValue([]);

        const result = await listGatchaRepository.getListGacha('');

        expect(mockBuyStarterpack.getListGacha).toHaveBeenCalledWith('');
        expect(result).toEqual([]);
      });

      it('should handle lowercase starterpack types', async () => {
        mockBuyStarterpack.getListGacha.mockResolvedValue([]);

        const result = await listGatchaRepository.getListGacha('c');

        expect(mockBuyStarterpack.getListGacha).toHaveBeenCalledWith('c');
        expect(result).toEqual([]);
      });

      it('should handle special characters in starterpack type', async () => {
        mockBuyStarterpack.getListGacha.mockResolvedValue([]);

        const specialTypes = ['C!', 'B@', 'A#', 'R$', '123', 'null', 'undefined'];

        for (const type of specialTypes) {
          const result = await listGatchaRepository.getListGacha(type);
          expect(mockBuyStarterpack.getListGacha).toHaveBeenCalledWith(type);
          expect(result).toEqual([]);
        }
      });
    });

    describe('Error handling', () => {
      it('should propagate errors from datasource', async () => {
        mockBuyStarterpack.getListGacha.mockRejectedValue(new Error('Datasource error'));

        await expect(listGatchaRepository.getListGacha('C')).rejects.toThrow('Datasource error');
        expect(mockBuyStarterpack.getListGacha).toHaveBeenCalledWith('C');
      });

      it('should handle network timeout errors', async () => {
        mockBuyStarterpack.getListGacha.mockRejectedValue(new Error('Request timeout'));

        await expect(listGatchaRepository.getListGacha('B')).rejects.toThrow('Request timeout');
      });

      it('should handle API server errors', async () => {
        mockBuyStarterpack.getListGacha.mockRejectedValue(new Error('Internal server error'));

        await expect(listGatchaRepository.getListGacha('A')).rejects.toThrow(
          'Internal server error',
        );
      });

      it('should handle malformed response errors', async () => {
        mockBuyStarterpack.getListGacha.mockRejectedValue(new Error('Invalid JSON response'));

        await expect(listGatchaRepository.getListGacha('R')).rejects.toThrow(
          'Invalid JSON response',
        );
      });
    });

    describe('Data validation', () => {
      it('should return array of DetailDigimonEntity with all required properties', async () => {
        const result = await listGatchaRepository.getListGacha('C');

        expect(Array.isArray(result)).toBe(true);
        for (const digimon of result) {
          expect(digimon).toHaveProperty('id');
          expect(digimon).toHaveProperty('name');
          expect(digimon).toHaveProperty('images');
          expect(digimon).toHaveProperty('levels');
          expect(digimon).toHaveProperty('types');
          expect(digimon).toHaveProperty('attributes');
          expect(digimon).toHaveProperty('fields');
          expect(digimon).toHaveProperty('descriptions');
          expect(digimon).toHaveProperty('nextEvolutions');
          expect(digimon).toHaveProperty('level');

          // Verify property types
          expect(typeof digimon.id).toBe('number');
          expect(typeof digimon.name).toBe('string');
          expect(Array.isArray(digimon.images)).toBe(true);
          expect(Array.isArray(digimon.levels)).toBe(true);
          expect(Array.isArray(digimon.types)).toBe(true);
          expect(Array.isArray(digimon.attributes)).toBe(true);
          expect(Array.isArray(digimon.fields)).toBe(true);
          expect(Array.isArray(digimon.descriptions)).toBe(true);
          expect(Array.isArray(digimon.nextEvolutions)).toBe(true);
          expect(typeof digimon.level).toBe('object');
        }
      });

      it('should handle empty result array', async () => {
        mockBuyStarterpack.getListGacha.mockResolvedValue([]);

        const result = await listGatchaRepository.getListGacha('C');

        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(0);
      });

      it('should handle single item result', async () => {
        const singleResult = [mockDetailDigimon];
        mockBuyStarterpack.getListGacha.mockResolvedValue(singleResult);

        const result = await listGatchaRepository.getListGacha('C');

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(mockDetailDigimon);
      });

      it('should handle large result arrays', async () => {
        const largeResult = createLargeDigimonArray(mockDetailDigimon, 100);

        mockBuyStarterpack.getListGacha.mockResolvedValue(largeResult);

        const result = await listGatchaRepository.getListGacha('C');

        expect(result).toHaveLength(100);
        expect(result[0].name).toBe('Digimon1');
        expect(result[99].name).toBe('Digimon100');
      });
    });

    describe('Different pack variations', () => {
      it('should handle same pack type with different results', async () => {
        const firstCall = [
          { ...mockDetailDigimon, id: 1, name: 'FirstBatch1' },
          { ...mockDetailDigimon, id: 2, name: 'FirstBatch2' },
        ];

        const secondCall = [
          { ...mockDetailDigimon, id: 3, name: 'SecondBatch1' },
          { ...mockDetailDigimon, id: 4, name: 'SecondBatch2' },
        ];

        mockBuyStarterpack.getListGacha
          .mockResolvedValueOnce(firstCall)
          .mockResolvedValueOnce(secondCall);

        const result1 = await listGatchaRepository.getListGacha('C');
        const result2 = await listGatchaRepository.getListGacha('C');

        expect(result1[0].name).toBe('FirstBatch1');
        expect(result2[0].name).toBe('SecondBatch1');
        expect(mockBuyStarterpack.getListGacha).toHaveBeenCalledTimes(2);
      });

      it('should handle mixed pack types in sequence', async () => {
        const packCResult = new Array(5).fill(mockDetailDigimon);
        const packBResult = new Array(5).fill(mockDetailDigimon);
        const packAResult = new Array(5).fill(mockDetailDigimon);
        const packRResult = new Array(4).fill(mockDetailDigimon);

        mockBuyStarterpack.getListGacha
          .mockResolvedValueOnce(packCResult)
          .mockResolvedValueOnce(packBResult)
          .mockResolvedValueOnce(packAResult)
          .mockResolvedValueOnce(packRResult);

        const resultC = await listGatchaRepository.getListGacha('C');
        const resultB = await listGatchaRepository.getListGacha('B');
        const resultA = await listGatchaRepository.getListGacha('A');
        const resultR = await listGatchaRepository.getListGacha('R');

        expect(resultC).toHaveLength(5);
        expect(resultB).toHaveLength(5);
        expect(resultA).toHaveLength(5);
        expect(resultR).toHaveLength(4);
        expect(mockBuyStarterpack.getListGacha).toHaveBeenCalledTimes(4);
      });
    });
  });

  describe('Multiple instances', () => {
    it('should create independent datasource instances', () => {
      const repository1 = new ListGatchaImpl();
      const repository2 = new ListGatchaImpl();

      expect(MockedBuyStarterpack).toHaveBeenCalledTimes(3); // Initial + 2 new instances
      expect(repository1).not.toBe(repository2);
    });

    it('should handle concurrent requests from multiple instances', async () => {
      const repository1 = new ListGatchaImpl();
      const repository2 = new ListGatchaImpl();

      mockBuyStarterpack.getListGacha.mockResolvedValue(mockGatchaResult);

      const promises = [
        repository1.getListGacha('C'),
        repository2.getListGacha('B'),
        listGatchaRepository.getListGacha('A'),
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      for (const result of results) {
        expect(result).toEqual(mockGatchaResult);
      }
    });

    it('should maintain state isolation between instances', async () => {
      // Create multiple instances to test independence
      const result1 = [{ ...mockDetailDigimon, name: 'Repo1Result' }];
      const result2 = [{ ...mockDetailDigimon, name: 'Repo2Result' }];

      // Mock different instances to return different results
      const mockInstance1 = {
        getListDigimon: jest.fn(),
        getListChampion: jest.fn(),
        getListGacha: jest.fn().mockResolvedValue(result1),
        getDigimonById: jest.fn(),
      };

      const mockInstance2 = {
        getListDigimon: jest.fn(),
        getListChampion: jest.fn(),
        getListGacha: jest.fn().mockResolvedValue(result2),
        getDigimonById: jest.fn(),
      };

      MockedBuyStarterpack.mockImplementationOnce(
        () => mockInstance1 as any,
      ).mockImplementationOnce(() => mockInstance2 as any);

      const repo1 = new ListGatchaImpl();
      const repo2 = new ListGatchaImpl();

      const res1 = await repo1.getListGacha('C');
      const res2 = await repo2.getListGacha('C');

      expect(res1[0].name).toBe('Repo1Result');
      expect(res2[0].name).toBe('Repo2Result');
    });
  });

  describe('Performance considerations', () => {
    it('should handle rapid successive calls', async () => {
      mockBuyStarterpack.getListGacha.mockResolvedValue(mockGatchaResult);

      const rapidCalls = new Array(10)
        .fill(0)
        .map((_, index) => listGatchaRepository.getListGacha(['C', 'B', 'A', 'R'][index % 4]));

      const results = await Promise.all(rapidCalls);

      expect(results).toHaveLength(10);
      expect(mockBuyStarterpack.getListGacha).toHaveBeenCalledTimes(10);
    });

    it('should handle large concurrent requests', async () => {
      mockBuyStarterpack.getListGacha.mockResolvedValue(mockGatchaResult);

      const concurrentCalls = new Array(50)
        .fill(0)
        .map(() => listGatchaRepository.getListGacha('C'));

      const results = await Promise.all(concurrentCalls);

      expect(results).toHaveLength(50);
      for (const result of results) {
        expect(result).toEqual(mockGatchaResult);
      }
    });
  });

  describe('Edge cases', () => {
    it('should handle very long starterpack type strings', async () => {
      const longType = 'C'.repeat(1000);
      mockBuyStarterpack.getListGacha.mockResolvedValue([]);

      const result = await listGatchaRepository.getListGacha(longType);

      expect(mockBuyStarterpack.getListGacha).toHaveBeenCalledWith(longType);
      expect(result).toEqual([]);
    });

    it('should handle unicode characters in starterpack type', async () => {
      const unicodeTypes = ['C🎮', 'B💎', 'A🌟', 'R🔥'];
      mockBuyStarterpack.getListGacha.mockResolvedValue([]);

      for (const type of unicodeTypes) {
        const result = await listGatchaRepository.getListGacha(type);
        expect(mockBuyStarterpack.getListGacha).toHaveBeenCalledWith(type);
        expect(result).toEqual([]);
      }
    });

    it('should handle starterpack type with whitespace', async () => {
      const whitespaceTypes = [' C ', '\tB\t', '\nA\n', '\r\nR\r\n'];
      mockBuyStarterpack.getListGacha.mockResolvedValue([]);

      for (const type of whitespaceTypes) {
        const result = await listGatchaRepository.getListGacha(type);
        expect(mockBuyStarterpack.getListGacha).toHaveBeenCalledWith(type);
        expect(result).toEqual([]);
      }
    });
  });
});
