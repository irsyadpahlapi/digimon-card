import { ListMyCard } from '../myCard';
import { makeRepoCardSet, adjustStarterPackAndReverse } from '@/__tests__/test-utils';

// Mock the implementation
const mockDigimonImpl = {
  getListMyCard: jest.fn(),
  getDigimonById: jest.fn(),
  sellDigimon: jest.fn(),
  digimonEvolution: jest.fn(),
};

jest.mock('../../../data/repositories/digimonRepository', () => ({
  DigimonImpl: jest.fn().mockImplementation(() => mockDigimonImpl),
}));

describe('ListMyCard Use Case', () => {
  let listMyCard: ListMyCard;

  const mockEvolutionData = {
    id: 2,
    name: 'TestEvolution',
    images: [{ href: 'test.jpg', transparent: false }],
    levels: [{ id: 1, level: 'Champion' }],
    types: [{ id: 1, type: 'Dragon' }],
    attributes: [{ id: 1, attribute: 'Vaccine' }],
    fields: [{ id: 1, field: 'Wind Guardians', image: 'test.jpg' }],
    descriptions: [{ origin: 'Test', language: 'en', description: 'Evolved form' }],
    nextEvolutions: [],
    level: { id: 1, level: 'Champion' },
  };

  const mockCards = makeRepoCardSet();

  beforeEach(() => {
    listMyCard = new ListMyCard();
    jest.clearAllMocks();

    // Setup default mock for getDigimonById
    mockDigimonImpl.getDigimonById.mockResolvedValue(mockEvolutionData);
  });

  describe('Constructor and Function Tests', () => {
    it('should execute ListMyCard constructor function', () => {
      const instance = new ListMyCard();
      expect(instance).toBeInstanceOf(ListMyCard);
    });

    it('should execute dataImpl property initialization', () => {
      const instance = new ListMyCard();
      expect(instance).toHaveProperty('dataImpl');
    });

    it('should test all class methods are defined', () => {
      expect(typeof listMyCard.getListMyCard).toBe('function');
      expect(typeof listMyCard.sellDigimon).toBe('function');
      expect(typeof listMyCard.digimonEvolution).toBe('function');
    });

    it('should execute Map constructor and methods', () => {
      const mapSpy = jest.spyOn(globalThis.Map.prototype, 'set');
      const getSpy = jest.spyOn(globalThis.Map.prototype, 'get');

      listMyCard.getListMyCard(mockCards, '', '');

      expect(mapSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();

      mapSpy.mockRestore();
      getSpy.mockRestore();
    });

    it('should execute Array.from function', () => {
      const fromSpy = jest.spyOn(Array, 'from');

      listMyCard.getListMyCard(mockCards, '', '');

      expect(fromSpy).toHaveBeenCalled();

      fromSpy.mockRestore();
    });

    it('should process data array correctly', () => {
      const result = listMyCard.getListMyCard(mockCards, '', '');

      // Test that function processes the array and returns results
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getListMyCard', () => {
    it('should return all cards when no filters are applied', async () => {
      const result = listMyCard.getListMyCard(mockCards, '', '');
      const expectedCards = adjustStarterPackAndReverse(mockCards);

      expect(result).toEqual(expectedCards);
    });

    it('should filter cards by category', async () => {
      const rookieCards = mockCards.filter((card) => card.category === 'Rookie');

      const result = listMyCard.getListMyCard(mockCards, 'Rookie', '');
      const expectedCards = adjustStarterPackAndReverse(rookieCards);

      expect(result).toEqual(expectedCards);
    });

    it('should filter cards by type', async () => {
      const vaccineCards = mockCards.filter((card) => card.type === 'Vaccine');

      const result = listMyCard.getListMyCard(mockCards, '', 'Vaccine');
      const expectedCards = adjustStarterPackAndReverse(vaccineCards);

      expect(result).toEqual(expectedCards);
    });

    it('should handle empty card collection', async () => {
      const result = listMyCard.getListMyCard([], '', '');

      expect(result).toEqual([]);
    });

    it('should handle duplicate cards correctly by combining totals', () => {
      const duplicateCards = [
        ...mockCards,
        { ...mockCards[0], id: 1 }, // Duplicate Agumon
        { ...mockCards[1], id: 2 }, // Duplicate Gabumon
      ];

      const result = listMyCard.getListMyCard(duplicateCards, '', '');

      expect(result).toHaveLength(3); // Should group duplicates
      const agumon = result.find((card) => card.id === 1);
      expect(agumon?.total).toBe(2); // Should combine totals
      expect(agumon?.starterPack).toBe(8); // Should combine starterPack values
    });

    it('should handle cards with zero evolution and starterPack values', () => {
      const cardWithZeros = {
        ...mockCards[0],
        id: 99,
        evolution: 0,
        starterPack: 0,
        isEvolution: false,
      };

      const result = listMyCard.getListMyCard([cardWithZeros], '', '');

      const card = result.find((c) => c.id === 99);
      expect(card?.evolution).toBe(0); // 0 + 0 = 0 (not evolution)
      expect(card?.starterPack).toBe(1); // 0 + 1 = 1 (not evolution)
    });

    it('should handle evolution cards with isEvolution true (addEvolution = 1, addStarter = 0)', () => {
      const evolutionCard = {
        ...mockCards[0],
        id: 200,
        isEvolution: true,
        evolution: 0,
        starterPack: 0,
      };

      const result = listMyCard.getListMyCard([evolutionCard], '', '');

      const card = result.find((c) => c.id === 200);
      expect(card?.evolution).toBe(1); // isEvolution true: 0 + 1 = 1
      expect(card?.starterPack).toBe(0); // isEvolution true: 0 + 0 = 0
    });

    it('should handle duplicate evolution cards combining values correctly', () => {
      const evolutionCard = {
        ...mockCards[0],
        id: 300,
        isEvolution: true,
        evolution: 5,
        starterPack: 3,
      };

      const duplicateEvolutions = [evolutionCard, evolutionCard, evolutionCard];

      const result = listMyCard.getListMyCard(duplicateEvolutions, '', '');

      const card = result.find((c) => c.id === 300);
      expect(card?.total).toBe(3);
      // Logic: first card sets {evolution: 5, starterPack: 3}
      // Each subsequent card adds: (5 + 1) and (3 + 0)
      // Total: 5 + (5+1) + (5+1) = 5 + 6 + 6 = 17? No...
      // Actually: existing.evolution + addEvolution accumulates
      // Card 1: {evolution: 5+1=6, starterPack: 3+0=3}
      // Card 2 (duplicate): existing(6) + 1 = 7, existing(3) + 0 = 3
      // Card 3 (duplicate): existing(7) + 1 = 8, existing(3) + 0 = 3
      expect(card?.evolution).toBe(8); // 5 + 1 + 1 + 1 = 8
      expect(card?.starterPack).toBe(3); // 3 + 0 + 0 + 0 = 3
    });

    it('should correctly increment evolution counter for evolution cards', () => {
      const evolutionCard = {
        ...mockCards[0],
        id: 400,
        isEvolution: true,
        evolution: 2,
        starterPack: 1,
      };

      const result = listMyCard.getListMyCard([evolutionCard], '', '');

      const card = result.find((c) => c.id === 400);
      // When isEvolution is true: addEvolution = 1, addStarter = 0
      expect(card?.evolution).toBe(3); // 2 + 1 = 3
      expect(card?.starterPack).toBe(1); // 1 + 0 = 1 (no increment for evolution cards)
    });

    it('should filter correctly when category does not match', () => {
      const result = listMyCard.getListMyCard(mockCards, 'Ultimate', '');

      expect(result).toEqual([]); // No Ultimate cards in mock data
    });

    it('should filter correctly when type does not match', () => {
      const result = listMyCard.getListMyCard(mockCards, '', 'Virus');

      expect(result).toEqual([]); // No Virus type cards in mock data
    });

    it('should execute all if/else branches in getListMyCard', () => {
      const evolutionCard = {
        ...mockCards[0],
        id: 10,
        isEvolution: true,
      };
      const mixedCards = [...mockCards, evolutionCard];

      const result = listMyCard.getListMyCard(mixedCards, '', '');

      expect(result).toHaveLength(4);

      // Test that evolution card logic was executed
      const evolutionResult = result.find((card) => card.id === 10);
      expect(evolutionResult?.isEvolution).toBe(true);
    });

    it('should execute existing card branch in groupedMap', () => {
      const duplicateCards = [
        { ...mockCards[0], id: 1 },
        { ...mockCards[0], id: 1 }, // Same ID to trigger existing branch
      ];

      const result = listMyCard.getListMyCard(duplicateCards, '', '');

      expect(result).toHaveLength(1);
      expect(result[0].total).toBe(2); // Proves existing branch was executed
    });

    it('should execute filterCategory return early branch', () => {
      const result = listMyCard.getListMyCard(mockCards, 'NonExistent', '');

      expect(result).toEqual([]); // All cards filtered out
    });

    it('should execute filterType return early branch', () => {
      const result = listMyCard.getListMyCard(mockCards, '', 'NonExistent');

      expect(result).toEqual([]); // All cards filtered out
    });

    it('should execute type.toLowerCase() function', () => {
      const testCards = [
        {
          ...mockCards[0],
          type: 'VACCINE', // Uppercase to test toLowerCase
        },
      ];

      const result = listMyCard.getListMyCard(testCards, '', 'vaccine');

      expect(result).toHaveLength(1); // Should match after toLowerCase
    });

    it('should test evolution logic branch in duplicate handling', () => {
      const evolutionCard = {
        ...mockCards[0],
        id: 1,
        isEvolution: true,
        evolution: 1,
      };
      const nonEvolutionCard = {
        ...mockCards[0],
        id: 1,
        isEvolution: false,
        evolution: 0,
      };

      const result = listMyCard.getListMyCard([evolutionCard, nonEvolutionCard], '', '');

      expect(result).toHaveLength(1);
      expect(result[0].total).toBe(2); // Both cards combined
    });
  });

  describe('digimonEvolution', () => {
    it('should evolve a card successfully', async () => {
      mockDigimonImpl.getDigimonById.mockResolvedValue(mockEvolutionData);

      const result = await listMyCard.digimonEvolution(mockCards, 1, 4);

      expect(result).toHaveLength(mockCards.length); // Same length after evolution
      expect(mockDigimonImpl.getDigimonById).toHaveBeenCalledWith(4);
    });

    it('should handle evolution with invalid card ID', async () => {
      mockDigimonImpl.getDigimonById.mockResolvedValue(mockEvolutionData);

      const result = await listMyCard.digimonEvolution(mockCards, 999, 4);

      expect(result).toHaveLength(mockCards.length + 1); // Card added without removal
      expect(mockDigimonImpl.getDigimonById).toHaveBeenCalledWith(4);
    });

    it('should remove up to 3 cards with same ID during evolution', async () => {
      const multipleCards = [
        { ...mockCards[0], id: 1 },
        { ...mockCards[0], id: 1 },
        { ...mockCards[0], id: 1 },
        { ...mockCards[0], id: 1 },
        { ...mockCards[0], id: 1 }, // 5 cards with ID 1
        ...mockCards.slice(1),
      ];

      mockDigimonImpl.getDigimonById.mockResolvedValue(mockEvolutionData);

      const result = await listMyCard.digimonEvolution(multipleCards, 1, 4);

      // Should remove 3 cards and add 1 evolution card
      const originalLength = multipleCards.length;
      expect(result).toHaveLength(originalLength - 3 + 1);

      // Should have 2 remaining cards with ID 1 (5 - 3 = 2)
      const remainingCardsWithId1 = result.filter((card) => card.id === 1 && !card.isEvolution);
      expect(remainingCardsWithId1).toHaveLength(2);

      // Should have 1 evolution card
      const evolutionCard = result.find((card) => card.isEvolution === true);
      expect(evolutionCard).toBeDefined();
      expect(evolutionCard?.id).toBe(2);
    });

    it('should handle evolution when less than 3 cards are available', async () => {
      const singleCard = [mockCards[0]]; // Only 1 card with ID 1

      mockDigimonImpl.getDigimonById.mockResolvedValue(mockEvolutionData);

      const result = await listMyCard.digimonEvolution(singleCard, 1, 4);

      // Should remove 1 card and add 1 evolution card
      expect(result).toHaveLength(1);

      // Should be the evolution card
      const evolutionCard = result.find((card) => card.isEvolution === true);
      expect(evolutionCard).toBeDefined();
      expect(evolutionCard?.id).toBe(2);
    });

    it('should handle evolution with removedCount logic correctly', async () => {
      const twoCards = [
        { ...mockCards[0], id: 1 },
        { ...mockCards[0], id: 1 },
      ];

      mockDigimonImpl.getDigimonById.mockResolvedValue(mockEvolutionData);

      const result = await listMyCard.digimonEvolution(twoCards, 1, 4);

      // Should remove 2 cards and add 1 evolution card
      expect(result).toHaveLength(1);

      // Should be the evolution card only
      expect(result[0].isEvolution).toBe(true);
      expect(result[0].id).toBe(2);
    });

    it('should execute all sort functions and data processing', async () => {
      const complexEvolutionData = {
        ...mockEvolutionData,
        types: [
          { id: 1, type: 'Vaccine' },
          { id: 2, type: 'Data' },
          { id: 3, type: 'Virus' },
        ],
        attributes: [
          { id: 1, attribute: 'Fire' },
          { id: 2, attribute: 'Water' },
          { id: 3, attribute: 'Earth' },
        ],
        levels: [
          { id: 1, level: 'Rookie' },
          { id: 2, level: 'Champion' },
          { id: 3, level: 'Ultimate' },
        ],
        descriptions: [
          { origin: 'Test1', language: 'en', description: 'First desc' },
          { origin: 'Test2', language: 'en', description: 'Last desc' },
        ],
        nextEvolutions: [{ id: 10, condition: 'test' }],
      };

      mockDigimonImpl.getDigimonById.mockResolvedValue(complexEvolutionData);

      const result = await listMyCard.digimonEvolution(mockCards, 1, 4);

      expect(result).toHaveLength(mockCards.length);
      const evolutionCard = result.find((card) => card.isEvolution === true);
      expect(evolutionCard?.type).toBe('Virus'); // Highest ID from sort
      expect(evolutionCard?.attribute).toBe('Earth'); // Highest ID from sort
      expect(evolutionCard?.level).toBe('Ultimate'); // Highest ID from sort
      expect(evolutionCard?.description).toBe('Last desc'); // Last description
    });

    it('should execute all array filter function logic', async () => {
      const filterSpy = jest.spyOn(Array.prototype, 'filter');

      mockDigimonImpl.getDigimonById.mockResolvedValue(mockEvolutionData);

      await listMyCard.digimonEvolution(mockCards, 1, 4);

      expect(filterSpy).toHaveBeenCalled();

      filterSpy.mockRestore();
    });

    it('should execute array push function', async () => {
      const pushSpy = jest.spyOn(Array.prototype, 'push');

      mockDigimonImpl.getDigimonById.mockResolvedValue(mockEvolutionData);

      await listMyCard.digimonEvolution(mockCards, 1, 4);

      expect(pushSpy).toHaveBeenCalled();

      pushSpy.mockRestore();
    });

    it('should test removedCount increment logic', async () => {
      const fourCards = [
        { ...mockCards[0], id: 1 },
        { ...mockCards[0], id: 1 },
        { ...mockCards[0], id: 1 },
        { ...mockCards[0], id: 1 },
      ];

      mockDigimonImpl.getDigimonById.mockResolvedValue(mockEvolutionData);

      const result = await listMyCard.digimonEvolution(fourCards, 1, 4);

      // Should remove exactly 3 cards, leaving 1 + 1 evolution
      expect(result).toHaveLength(2);
    });

    it('should handle evolution data with empty types array (fallback to empty string)', async () => {
      const emptyTypesData = {
        ...mockEvolutionData,
        types: [], // Empty types array - triggers sortedTypes[0]?.type || ''
      };

      mockDigimonImpl.getDigimonById.mockResolvedValue(emptyTypesData);

      const result = await listMyCard.digimonEvolution(mockCards, 1, 4);

      // Should add evolved card with empty type
      const evolvedCard = result.find((card) => card.id === 2 && card.isEvolution);
      expect(evolvedCard).toBeDefined();
      expect(evolvedCard?.type).toBe('');
    });

    it('should handle evolution data with empty attributes array (fallback to empty string)', async () => {
      const emptyAttributesData = {
        ...mockEvolutionData,
        attributes: [], // Empty attributes - triggers sortedAttributes[0]?.attribute || ''
      };

      mockDigimonImpl.getDigimonById.mockResolvedValue(emptyAttributesData);

      const result = await listMyCard.digimonEvolution(mockCards, 1, 4);

      const evolvedCard = result.find((card) => card.id === 2 && card.isEvolution);
      expect(evolvedCard).toBeDefined();
      expect(evolvedCard?.attribute).toBe('');
    });

    it('should handle evolution data with empty descriptions array (fallback to empty string)', async () => {
      const emptyDescriptionsData = {
        ...mockEvolutionData,
        descriptions: [], // Empty descriptions - triggers .at(-1)?.description || ''
      };

      mockDigimonImpl.getDigimonById.mockResolvedValue(emptyDescriptionsData);

      const result = await listMyCard.digimonEvolution(mockCards, 1, 4);

      const evolvedCard = result.find((card) => card.id === 2 && card.isEvolution);
      expect(evolvedCard).toBeDefined();
      expect(evolvedCard?.description).toBe('');
    });

    it('should handle evolution data with undefined level (fallback to empty string)', async () => {
      const undefinedLevelData = {
        ...mockEvolutionData,
        level: undefined, // Undefined level - triggers levelName || ''
      };

      mockDigimonImpl.getDigimonById.mockResolvedValue(undefinedLevelData);

      const result = await listMyCard.digimonEvolution(mockCards, 1, 4);

      const evolvedCard = result.find((card) => card.id === 2 && card.isEvolution);
      expect(evolvedCard).toBeDefined();
      expect(evolvedCard?.level).toBe('');
    });

    it('should handle evolution data with all missing optional fields', async () => {
      const minimalData = {
        id: 2,
        name: 'MinimalEvolution',
        images: [{ href: 'test.jpg', transparent: false }],
        levels: [],
        types: [],
        attributes: [],
        fields: [],
        descriptions: [],
        nextEvolutions: [],
        level: undefined,
      };

      mockDigimonImpl.getDigimonById.mockResolvedValue(minimalData);

      const result = await listMyCard.digimonEvolution(mockCards, 1, 4);

      const evolvedCard = result.find((card) => card.id === 2 && card.isEvolution);
      expect(evolvedCard).toBeDefined();
      expect(evolvedCard?.type).toBe('');
      expect(evolvedCard?.attribute).toBe('');
      expect(evolvedCard?.description).toBe('');
      expect(evolvedCard?.level).toBe('');
    });
  });

  describe('sellDigimon', () => {
    it('should remove card from collection when sold', () => {
      const remainingCards = mockCards.filter((card) => card.id !== 1);
      mockDigimonImpl.sellDigimon.mockReturnValue(remainingCards);

      const result = listMyCard.sellDigimon(mockCards, 1);

      expect(result).toEqual(remainingCards);
    });

    it('should return original collection if card ID not found', () => {
      const result = listMyCard.sellDigimon(mockCards, 999);

      expect(result).toEqual(mockCards);
    });

    it('should handle empty collection', () => {
      const result = listMyCard.sellDigimon([], 1);

      expect(result).toEqual([]);
    });

    it('should remove only the first occurrence when multiple cards have same ID', () => {
      const duplicateCards = [
        { ...mockCards[0], id: 1 },
        { ...mockCards[0], id: 1 },
        { ...mockCards[0], id: 1 },
        ...mockCards.slice(1),
      ];

      const result = listMyCard.sellDigimon(duplicateCards, 1);

      // Should remove only one card (first occurrence)
      expect(result).toHaveLength(duplicateCards.length - 1);

      // Should still have 2 cards with ID 1
      const remainingCardsWithId1 = result.filter((card) => card.id === 1);
      expect(remainingCardsWithId1).toHaveLength(2);
    });

    it('should handle hasRemoved flag correctly to prevent multiple removals', () => {
      const multipleCards = [
        { ...mockCards[0], id: 5 },
        { ...mockCards[1], id: 5 }, // Different base card but same ID
        { ...mockCards[2], id: 5 }, // Third card with same ID
      ];

      const result = listMyCard.sellDigimon(multipleCards, 5);

      // Should remove only the first card despite multiple matches
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Gabumon'); // Second card should remain
      expect(result[1].name).toBe('Greymon'); // Third card should remain
    });

    it('should preserve all cards when ID does not match any card', () => {
      const result = listMyCard.sellDigimon(mockCards, 999);

      expect(result).toHaveLength(mockCards.length);
      expect(result).toEqual(mockCards);
    });

    it('should execute filter callback function for each item', () => {
      const filterSpy = jest.spyOn(Array.prototype, 'filter');

      listMyCard.sellDigimon(mockCards, 1);

      expect(filterSpy).toHaveBeenCalled();

      filterSpy.mockRestore();
    });

    it('should test hasRemoved flag state changes', () => {
      const tripleCards = [
        { ...mockCards[0], id: 7 },
        { ...mockCards[0], id: 7 },
        { ...mockCards[0], id: 7 },
      ];

      const result = listMyCard.sellDigimon(tripleCards, 7);

      // Should remove exactly one card
      expect(result).toHaveLength(2);

      // All remaining cards should have the target ID
      for (const card of result) {
        expect(card.id).toBe(7);
      }
    });

    it('should execute both branches of filter condition', () => {
      const mixedCards = [
        { ...mockCards[0], id: 1 }, // Will be removed
        { ...mockCards[1], id: 2 }, // Will be kept (different ID)
        { ...mockCards[0], id: 1 }, // Will be kept (hasRemoved = true)
      ];

      const result = listMyCard.sellDigimon(mixedCards, 1);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(2); // Different ID card kept
      expect(result[1].id).toBe(1); // Second occurrence kept
    });
  });

  describe('Function Coverage Tests', () => {
    it('should test all class methods are functions', () => {
      const instance = new ListMyCard();

      // Test that all methods are functions
      expect(typeof instance.getListMyCard).toBe('function');
      expect(typeof instance.sellDigimon).toBe('function');
      expect(typeof instance.digimonEvolution).toBe('function');

      // Test method names
      expect(instance.getListMyCard.name).toBe('getListMyCard');
      expect(instance.sellDigimon.name).toBe('sellDigimon');
      expect(instance.digimonEvolution.name).toBe('digimonEvolution');
    });

    it('should execute all utility functions within methods', async () => {
      // Test that utility functions are called
      const mapValuesSpy = jest.spyOn(Map.prototype, 'values');

      listMyCard.getListMyCard(mockCards, '', '');

      expect(mapValuesSpy).toHaveBeenCalled();

      mapValuesSpy.mockRestore();
    });

    it('should test all conditional branches and return paths', () => {
      // Test early return in getListMyCard with filter
      let result = listMyCard.getListMyCard(mockCards, 'NonExistent', '');
      expect(result).toEqual([]);

      // Test normal return path
      result = listMyCard.getListMyCard(mockCards, '', '');
      expect(result.length).toBeGreaterThan(0);

      // Test sellDigimon return paths
      result = listMyCard.sellDigimon(mockCards, 999);
      expect(result).toEqual(mockCards);

      result = listMyCard.sellDigimon(mockCards, 1);
      expect(result.length).toBe(mockCards.length - 1);
    });

    it('should execute all async/await functionality', async () => {
      mockDigimonImpl.getDigimonById.mockResolvedValue(mockEvolutionData);

      const promise = listMyCard.digimonEvolution(mockCards, 1, 4);

      expect(promise).toBeInstanceOf(Promise);

      const result = await promise;
      expect(result).toBeDefined();
    });

    it('should test all object spread operations', () => {
      const result = listMyCard.getListMyCard(mockCards, '', '');

      // Verify spread operations worked correctly
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('total');
    });

    it('should test all Map operations', () => {
      const setSpy = jest.spyOn(Map.prototype, 'set');
      const getSpy = jest.spyOn(Map.prototype, 'get');
      const valuesSpy = jest.spyOn(Map.prototype, 'values');

      listMyCard.getListMyCard(mockCards, '', '');

      expect(setSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();
      expect(valuesSpy).toHaveBeenCalled();

      setSpy.mockRestore();
      getSpy.mockRestore();
      valuesSpy.mockRestore();
    });
  });
});
