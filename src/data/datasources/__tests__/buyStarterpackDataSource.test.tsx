import { BuyStarterpack } from '../buyStarterpackDataSource';
import DigimonAPI from '../digimonDataSource';
import { DetailDigimonEntity, ListDigimonEntity } from '@/core/entities/digimon';
import { makeDetailDigimonEntity, makeListDigimonEntity } from '@/__tests__/test-utils';

// Mock DigimonAPI
jest.mock('../digimonDataSource');
const MockedDigimonAPI = DigimonAPI as jest.MockedClass<typeof DigimonAPI>;

// Helper functions to reduce nesting
type GetListDigimonFn = jest.MockedFunction<(level: string) => Promise<unknown>>;

const getCallsForLevel = (mock: GetListDigimonFn, level: string) => {
  return mock.mock.calls.filter((call: readonly [string]) => call[0] === level);
};

const expectCallCount = (mock: GetListDigimonFn, level: string, expectedCount: number) => {
  const calls = getCallsForLevel(mock, level);
  expect(calls).toHaveLength(expectedCount);
};

describe('BuyStarterpack DataSource', () => {
  let buyStarterpack: BuyStarterpack;
  let mockDigimonAPI: jest.Mocked<DigimonAPI>;

  const mockDetailDigimon: DetailDigimonEntity = makeDetailDigimonEntity();

  const mockListDigimonResponse: ListDigimonEntity = makeListDigimonEntity();

  beforeEach(() => {
    mockDigimonAPI = {
      getListDigimon: jest.fn(),
      getDigimonById: jest.fn(),
    } as jest.Mocked<DigimonAPI>;

    MockedDigimonAPI.mockImplementation(() => mockDigimonAPI);
    buyStarterpack = new BuyStarterpack();

    // Reset Math.random mock
    jest.spyOn(Math, 'random').mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('getListDigimon', () => {
    beforeEach(() => {
      mockDigimonAPI.getListDigimon.mockResolvedValue(mockListDigimonResponse);
      mockDigimonAPI.getDigimonById.mockResolvedValue(mockDetailDigimon);
    });

    it('should fetch random digimon from Child level', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.5); // Will select index 1

      const result = await buyStarterpack.getListDigimon('Child');

      expect(mockDigimonAPI.getListDigimon).toHaveBeenCalledWith('Child', 100);
      expect(mockDigimonAPI.getDigimonById).toHaveBeenCalledWith(2); // Index 1 (0.5 * 3 = 1.5, floor = 1)
      expect(result).toEqual(mockDetailDigimon);
    });

    it('should fetch random digimon from Ultimate level', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.1); // Will select index 0

      const result = await buyStarterpack.getListDigimon('Ultimate');

      expect(mockDigimonAPI.getListDigimon).toHaveBeenCalledWith('Ultimate', 100);
      expect(mockDigimonAPI.getDigimonById).toHaveBeenCalledWith(1); // Index 0
      expect(result).toEqual(mockDetailDigimon);
    });

    it('should handle different random selections', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.9); // Will select index 2

      await buyStarterpack.getListDigimon('Perfect');

      expect(mockDigimonAPI.getListDigimon).toHaveBeenCalledWith('Perfect', 100);
      expect(mockDigimonAPI.getDigimonById).toHaveBeenCalledWith(3); // Index 2 (0.9 * 3 = 2.7, floor = 2)
    });

    it('should handle edge case with single item list', async () => {
      const singleItemList = {
        ...mockListDigimonResponse,
        content: [{ id: 99, name: 'OnlyDigimon', href: '/api/digimon/99', image: 'only.jpg' }],
      };

      mockDigimonAPI.getListDigimon.mockResolvedValue(singleItemList);
      jest.spyOn(Math, 'random').mockReturnValue(0.9); // Even high random should select index 0

      await buyStarterpack.getListDigimon('Test');

      expect(mockDigimonAPI.getDigimonById).toHaveBeenCalledWith(99);
    });

    it('should propagate API errors from getListDigimon', async () => {
      mockDigimonAPI.getListDigimon.mockRejectedValue(new Error('List API Error'));

      await expect(buyStarterpack.getListDigimon('Child')).rejects.toThrow('List API Error');
    });

    it('should propagate API errors from getDigimonById', async () => {
      mockDigimonAPI.getDigimonById.mockRejectedValue(new Error('Detail API Error'));

      await expect(buyStarterpack.getListDigimon('Child')).rejects.toThrow('Detail API Error');
    });
  });

  describe('getListChampion', () => {
    const mockAdultList = makeListDigimonEntity(
      [
        { id: 10, name: 'Greymon', href: '/api/digimon/10', image: 'greymon.jpg' },
        { id: 11, name: 'Garurumon', href: '/api/digimon/11', image: 'garurumon.jpg' },
      ],
      {
        currentPage: 1,
        elementsOnPage: 2,
        totalElements: 20,
        totalPages: 10,
        previousPage: '',
        nextPage: '',
      },
    );

    const mockArmorList = makeListDigimonEntity(
      [{ id: 20, name: 'Flamedramon', href: '/api/digimon/20', image: 'flamedramon.jpg' }],
      {
        currentPage: 1,
        elementsOnPage: 1,
        totalElements: 10,
        totalPages: 10,
        previousPage: '',
        nextPage: '',
      },
    );

    const mockUnknownList = makeListDigimonEntity(
      [{ id: 30, name: 'UnknownMon', href: '/api/digimon/30', image: 'unknown.jpg' }],
      {
        currentPage: 1,
        elementsOnPage: 1,
        totalElements: 5,
        totalPages: 5,
        previousPage: '',
        nextPage: '',
      },
    );

    const mockHybridList = makeListDigimonEntity(
      [
        { id: 40, name: 'Agunimon', href: '/api/digimon/40', image: 'agunimon.jpg' },
        { id: 41, name: 'Lobomon', href: '/api/digimon/41', image: 'lobomon.jpg' },
      ],
      {
        currentPage: 1,
        elementsOnPage: 2,
        totalElements: 15,
        totalPages: 8,
        previousPage: '',
        nextPage: '',
      },
    );

    beforeEach(() => {
      mockDigimonAPI.getListDigimon
        .mockResolvedValueOnce(mockAdultList) // Adult call
        .mockResolvedValueOnce(mockArmorList) // Armor call
        .mockResolvedValueOnce(mockUnknownList) // Unknown call
        .mockResolvedValueOnce(mockHybridList); // Hybrid call

      mockDigimonAPI.getDigimonById.mockResolvedValue(mockDetailDigimon);
    });

    it('should fetch random champion from combined lists', async () => {
      // Total items: 2 (Adult) + 1 (Armor) + 1 (Unknown) + 2 (Hybrid) = 6 items
      // Array order: [10, 11, 20, 30, 40, 41]
      // Mock random to select index 3 (which should be Unknown - id: 30)
      jest.spyOn(Math, 'random').mockReturnValue(0.5); // 0.5 * 6 = 3

      const result = await buyStarterpack.getListChampion();

      expect(mockDigimonAPI.getListDigimon).toHaveBeenCalledWith('Adult', 50);
      expect(mockDigimonAPI.getListDigimon).toHaveBeenCalledWith('Armor', 50);
      expect(mockDigimonAPI.getListDigimon).toHaveBeenCalledWith('Unknown', 50);
      expect(mockDigimonAPI.getListDigimon).toHaveBeenCalledWith('Hybrid', 50);
      expect(mockDigimonAPI.getDigimonById).toHaveBeenCalledWith(30); // Unknown[0]
      expect(result).toEqual(mockDetailDigimon);
    });

    it('should select from Adult list with low random value', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.1); // 0.1 * 6 = 0.6, floor = 0

      await buyStarterpack.getListChampion();

      expect(mockDigimonAPI.getDigimonById).toHaveBeenCalledWith(10); // Adult[0]
    });

    it('should select from last item with high random value', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.9); // 0.9 * 6 = 5.4, floor = 5

      await buyStarterpack.getListChampion();

      expect(mockDigimonAPI.getDigimonById).toHaveBeenCalledWith(41); // Hybrid[1] - last item
    });

    it('should handle empty lists gracefully', async () => {
      const emptyList: ListDigimonEntity = {
        content: [],
        pageable: {
          currentPage: 1,
          elementsOnPage: 0,
          totalElements: 0,
          totalPages: 0,
          previousPage: '',
          nextPage: '',
        },
      };

      // Completely reset all mocks to prevent interference from beforeEach
      mockDigimonAPI.getListDigimon.mockReset();
      mockDigimonAPI.getDigimonById.mockReset();

      // Setup empty list for all calls
      mockDigimonAPI.getListDigimon.mockResolvedValue(emptyList);

      // Mock Math.random for predictable behavior
      jest.spyOn(Math, 'random').mockReturnValue(0.5);

      // When all lists are empty, ListDataAll will be []
      // Accessing ListDataAll[0].id on undefined should throw error
      await expect(buyStarterpack.getListChampion()).rejects.toThrow(
        'Cannot read properties of undefined',
      );
    });

    it('should propagate API errors from any of the list calls', async () => {
      // Completely reset mocks first
      mockDigimonAPI.getListDigimon.mockReset();
      mockDigimonAPI.getDigimonById.mockReset();

      // Setup specific error scenario
      mockDigimonAPI.getListDigimon
        .mockResolvedValueOnce(mockAdultList)
        .mockRejectedValueOnce(new Error('Armor API failed'));

      await expect(buyStarterpack.getListChampion()).rejects.toThrow('Armor API failed');
    });
  });

  describe('getListGacha', () => {
    beforeEach(() => {
      mockDigimonAPI.getListDigimon.mockResolvedValue(mockListDigimonResponse);
      mockDigimonAPI.getDigimonById.mockResolvedValue(mockDetailDigimon);

      // Mock the internal methods
      jest.spyOn(buyStarterpack, 'getListDigimon').mockResolvedValue(mockDetailDigimon);
      jest.spyOn(buyStarterpack, 'getListChampion').mockResolvedValue(mockDetailDigimon);
    });

    describe('Starterpack C', () => {
      it('should return 5 digimon (4 Child + 1 Champion)', async () => {
        const result = await buyStarterpack.getListGacha('C');

        expect(result).toHaveLength(5);
        expect(buyStarterpack.getListDigimon).toHaveBeenCalledTimes(4);
        expect(buyStarterpack.getListDigimon).toHaveBeenCalledWith('Child');
        expect(buyStarterpack.getListChampion).toHaveBeenCalledTimes(1);
      });

      it('should return all DetailDigimonEntity objects for pack C', async () => {
        const result = await buyStarterpack.getListGacha('C');

        for (const digimon of result) {
          expect(digimon).toHaveProperty('id');
          expect(digimon).toHaveProperty('name');
          expect(digimon).toHaveProperty('images');
          expect(digimon).toEqual(mockDetailDigimon);
        }
      });
    });

    describe('Starterpack B', () => {
      it('should return 5 digimon (2 Child + 2 Champion + 1 Ultimate)', async () => {
        const result = await buyStarterpack.getListGacha('B');

        expect(result).toHaveLength(5);
        expect(buyStarterpack.getListDigimon).toHaveBeenCalledWith('Child');
        expect(buyStarterpack.getListDigimon).toHaveBeenCalledWith('Ultimate');
        expect(buyStarterpack.getListChampion).toHaveBeenCalledTimes(2);

        // Verify exact call counts using helper functions
        expectCallCount(buyStarterpack.getListDigimon as GetListDigimonFn, 'Child', 2);
        expectCallCount(buyStarterpack.getListDigimon as GetListDigimonFn, 'Ultimate', 1);
      });
    });

    describe('Starterpack A', () => {
      it('should return 5 digimon (1 Child + 2 Champion + 2 Ultimate)', async () => {
        const result = await buyStarterpack.getListGacha('A');

        expect(result).toHaveLength(5);
        expect(buyStarterpack.getListChampion).toHaveBeenCalledTimes(2);

        expectCallCount(buyStarterpack.getListDigimon as GetListDigimonFn, 'Child', 1);
        expectCallCount(buyStarterpack.getListDigimon as GetListDigimonFn, 'Ultimate', 2);
      });
    });

    describe('Starterpack R', () => {
      it('should return 4 digimon (1 Champion + 2 Ultimate + 1 Perfect)', async () => {
        const result = await buyStarterpack.getListGacha('R');

        expect(result).toHaveLength(4);
        expect(buyStarterpack.getListChampion).toHaveBeenCalledTimes(1);

        expectCallCount(buyStarterpack.getListDigimon as GetListDigimonFn, 'Ultimate', 2);
        expectCallCount(buyStarterpack.getListDigimon as GetListDigimonFn, 'Perfect', 1);
      });
    });

    describe('Invalid starterpack type', () => {
      it('should return empty array for unknown starterpack type', async () => {
        const result = await buyStarterpack.getListGacha('X');

        expect(result).toHaveLength(0);
      });

      it('should return empty array for empty string', async () => {
        const result = await buyStarterpack.getListGacha('');

        expect(result).toHaveLength(0);
      });
    });

    describe('Error handling', () => {
      it('should handle errors from getListDigimon', async () => {
        (buyStarterpack.getListDigimon as jest.Mock).mockRejectedValue(
          new Error('Child API Error'),
        );

        await expect(buyStarterpack.getListGacha('C')).rejects.toThrow('Child API Error');
      });

      it('should handle errors from getListChampion', async () => {
        (buyStarterpack.getListChampion as jest.Mock).mockRejectedValue(
          new Error('Champion API Error'),
        );

        await expect(buyStarterpack.getListGacha('C')).rejects.toThrow('Champion API Error');
      });

      it('should handle partial failures in Promise.all', async () => {
        (buyStarterpack.getListDigimon as jest.Mock)
          .mockResolvedValueOnce(mockDetailDigimon)
          .mockResolvedValueOnce(mockDetailDigimon)
          .mockRejectedValueOnce(new Error('Third call failed'))
          .mockResolvedValueOnce(mockDetailDigimon);

        await expect(buyStarterpack.getListGacha('C')).rejects.toThrow('Third call failed');
      });
    });

    describe('Case sensitivity', () => {
      it('should handle lowercase starterpack types', async () => {
        const result = await buyStarterpack.getListGacha('c');

        expect(result).toHaveLength(0);
      });
    });
  });

  describe('getDigimonById', () => {
    it('should fetch digimon by ID', async () => {
      mockDigimonAPI.getDigimonById.mockResolvedValue(mockDetailDigimon);

      const result = await buyStarterpack.getDigimonById(1);

      expect(mockDigimonAPI.getDigimonById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockDetailDigimon);
    });

    it('should handle different IDs', async () => {
      const differentDigimon = { ...mockDetailDigimon, id: 99, name: 'TestMon' };
      mockDigimonAPI.getDigimonById.mockResolvedValue(differentDigimon);

      const result = await buyStarterpack.getDigimonById(99);

      expect(mockDigimonAPI.getDigimonById).toHaveBeenCalledWith(99);
      expect(result.id).toBe(99);
      expect(result.name).toBe('TestMon');
    });

    it('should propagate API errors', async () => {
      mockDigimonAPI.getDigimonById.mockRejectedValue(new Error('ID API Error'));

      await expect(buyStarterpack.getDigimonById(1)).rejects.toThrow('ID API Error');
    });

    it('should handle zero and negative IDs', async () => {
      mockDigimonAPI.getDigimonById.mockResolvedValue(mockDetailDigimon);

      await buyStarterpack.getDigimonById(0);
      await buyStarterpack.getDigimonById(-1);

      expect(mockDigimonAPI.getDigimonById).toHaveBeenCalledWith(0);
      expect(mockDigimonAPI.getDigimonById).toHaveBeenCalledWith(-1);
    });
  });

  describe('Constructor and DigimonAPI integration', () => {
    it('should create new DigimonAPI instances for each method call', async () => {
      mockDigimonAPI.getListDigimon.mockResolvedValue(mockListDigimonResponse);
      mockDigimonAPI.getDigimonById.mockResolvedValue(mockDetailDigimon);

      await buyStarterpack.getListDigimon('Child');
      await buyStarterpack.getDigimonById(1);

      // Each method creates a new DigimonAPI instance
      expect(MockedDigimonAPI).toHaveBeenCalledTimes(2); // 2 method calls, each creates instance
    });

    it('should handle multiple concurrent operations', async () => {
      mockDigimonAPI.getListDigimon.mockResolvedValue(mockListDigimonResponse);
      mockDigimonAPI.getDigimonById.mockResolvedValue(mockDetailDigimon);

      const operations = [
        buyStarterpack.getListDigimon('Child'),
        buyStarterpack.getListDigimon('Ultimate'),
        buyStarterpack.getDigimonById(1),
        buyStarterpack.getDigimonById(2),
      ];

      const results = await Promise.all(operations);

      expect(results).toHaveLength(4);
      for (const result of results) {
        expect(result).toEqual(mockDetailDigimon);
      }
    });
  });
});
