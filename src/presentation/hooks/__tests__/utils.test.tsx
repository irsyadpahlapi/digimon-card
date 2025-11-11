import {
  Category,
  sellingDigimonPrice,
  PriceStarterpack,
  pickHighestByOrder,
  highestLevelFromLevels,
  pickHighestLevelObject,
} from '../utils';

// Helper tables to reduce duplication
const LEVEL_CATEGORY_CASES: Array<[string, string]> = [
  ['Child', 'Rookie'],
  ['Adult', 'Champion'],
  ['Armor', 'Champion'],
  ['Unknown', 'Champion'],
  ['Hybrid', 'Champion'],
  ['Ultimate', 'Ultimate'],
  ['Perfect', 'Mega'],
];

const INVALID_CATEGORY_INPUTS: string[] = ['Rookie', 'Champion', '', 'Invalid'];

const STARTER_PACK_PRICE_CASES: Array<[string, number]> = [
  ['C', 5],
  ['B', 10],
  ['A', 15],
  ['R', 20],
];

const UNKNOWN_PACK_TYPES: string[] = ['X', '', 'Invalid'];

const SELLING_PRICE_EVOLUTION_CASES: Array<[string, number]> = [
  ['Rookie', 5],
  ['Champion', 10],
  ['Ultimate', 20],
  ['Mega', 30],
];

const SELLING_PRICE_NO_EVOLUTION_CATEGORIES: string[] = ['Rookie', 'Champion', 'Ultimate', 'Mega'];

const SELLING_PRICE_UNKNOWN_CASES: string[] = ['Unknown', 'Baby', '', 'Invalid'];

describe('Utils Functions', () => {
  describe('Category function', () => {
    it.each(LEVEL_CATEGORY_CASES)('should map level %s to category %s', (input, expected) => {
      expect(Category(input)).toBe(expected);
    });

    it.each(INVALID_CATEGORY_INPUTS)('should return Baby for unrecognized level %s', (input) => {
      expect(Category(input)).toBe('Baby');
    });
  });

  describe('PriceStarterpack function', () => {
    it.each(STARTER_PACK_PRICE_CASES)(
      'should return correct price %d for pack type %s',
      (type, price) => {
        expect(PriceStarterpack(type)).toBe(price);
      },
    );

    it.each(UNKNOWN_PACK_TYPES)('should return 0 for unknown pack type %s', (type) => {
      expect(PriceStarterpack(type)).toBe(0);
    });
  });

  describe('sellingDigimonPrice function', () => {
    it.each(SELLING_PRICE_EVOLUTION_CASES)(
      'should return correct price %d for category %s with evolution',
      (category, expectedPrice) => {
        expect(sellingDigimonPrice(category, true)).toBe(expectedPrice);
      },
    );

    it.each(SELLING_PRICE_NO_EVOLUTION_CATEGORIES)(
      'should return God price for category %s without evolution',
      (category) => {
        expect(sellingDigimonPrice(category, false)).toBe(100);
      },
    );

    it.each(SELLING_PRICE_UNKNOWN_CASES)(
      'should return default price 1 for unknown category %s',
      (category) => {
        expect(sellingDigimonPrice(category, true)).toBe(1);
      },
    );

    it.each(['God'])(
      'should return God price for explicit God category %s regardless of evolution',
      (category) => {
        expect(sellingDigimonPrice(category, true)).toBe(100);
        expect(sellingDigimonPrice(category, false)).toBe(100);
      },
    );
  });

  describe('Integration tests', () => {
    it('should work together for complete card pricing flow', () => {
      const testCases = [
        { digimonLevel: 'Child', expectedCategory: 'Rookie', hasEvolution: true, expectedPrice: 5 },
        {
          digimonLevel: 'Adult',
          expectedCategory: 'Champion',
          hasEvolution: true,
          expectedPrice: 10,
        },
        {
          digimonLevel: 'Ultimate',
          expectedCategory: 'Ultimate',
          hasEvolution: true,
          expectedPrice: 20,
        },
        {
          digimonLevel: 'Perfect',
          expectedCategory: 'Mega',
          hasEvolution: true,
          expectedPrice: 30,
        },
      ];

      for (const { digimonLevel, expectedCategory, hasEvolution, expectedPrice } of testCases) {
        const category = Category(digimonLevel);
        const price = sellingDigimonPrice(category, hasEvolution);

        expect(category).toBe(expectedCategory);
        expect(price).toBe(expectedPrice);
      }
    });

    it('should handle starter pack pricing separately', () => {
      for (const [type, price] of STARTER_PACK_PRICE_CASES) {
        expect(PriceStarterpack(type)).toBe(price);
      }
    });

    it('should correctly handle max selling price for non-evolvable cards', () => {
      for (const category of SELLING_PRICE_NO_EVOLUTION_CATEGORIES) {
        const priceWithEvolution = sellingDigimonPrice(category, true);
        const priceWithoutEvolution = sellingDigimonPrice(category, false);
        expect(priceWithoutEvolution).toBe(100);
        expect(priceWithEvolution).toBeLessThan(priceWithoutEvolution);
      }
    });
  });

  describe('pickHighestByOrder function', () => {
    const dataResponse = [
      { id: 1, name: 'Baby II' },
      { id: 2, name: 'Adult' },
      { id: 3, name: 'Perfect' },
      { id: 4, name: 'Child' },
      { id: 5, name: 'Baby I' },
      { id: 6, name: 'Ultimate' },
      { id: 7, name: 'Armor' },
      { id: 8, name: 'Unknown' },
      { id: 9, name: 'Hybrid' },
    ];

    it('should return the highest priority item based on LEVEL_ORDER', () => {
      const result = pickHighestByOrder(dataResponse);
      expect(result).toEqual({ id: 3, name: 'Perfect' });
    });

    it('should return Ultimate when Perfect is not in list', () => {
      const filtered = dataResponse.filter((item) => item.name !== 'Perfect');
      const result = pickHighestByOrder(filtered);
      expect(result).toEqual({ id: 6, name: 'Ultimate' });
    });

    it('should return Child when only low-priority items exist', () => {
      const filtered = [
        { id: 1, name: 'Baby II' },
        { id: 4, name: 'Child' },
        { id: 5, name: 'Baby I' },
      ];
      const result = pickHighestByOrder(filtered);
      expect(result).toEqual({ id: 4, name: 'Child' });
    });

    it('should return undefined when no items match the order', () => {
      const noMatch = [
        { id: 1, name: 'Baby II' },
        { id: 5, name: 'Baby I' },
      ];
      const result = pickHighestByOrder(noMatch);
      expect(result).toBeUndefined();
    });

    it('should return undefined for empty array', () => {
      const result = pickHighestByOrder([]);
      expect(result).toBeUndefined();
    });

    it('should work with custom order', () => {
      const customOrder = ['Adult', 'Child', 'Perfect'];
      const result = pickHighestByOrder(dataResponse, customOrder);
      expect(result).toEqual({ id: 3, name: 'Perfect' });
    });
  });

  describe('highestLevelFromLevels function', () => {
    it('should return highest level name from levels array', () => {
      const levels = [
        { level: 'Child', id: 1 },
        { level: 'Adult', id: 2 },
        { level: 'Ultimate', id: 3 },
      ];
      const result = highestLevelFromLevels(levels);
      expect(result).toBe('Ultimate');
    });

    it('should return Perfect when it exists', () => {
      const levels = [
        { level: 'Adult', id: 1 },
        { level: 'Perfect', id: 2 },
        { level: 'Child', id: 3 },
      ];
      const result = highestLevelFromLevels(levels);
      expect(result).toBe('Perfect');
    });

    it('should skip unknown levels and return highest known', () => {
      const levels = [
        { level: 'Baby I', id: 1 },
        { level: 'Child', id: 2 },
        { level: 'Baby II', id: 3 },
      ];
      const result = highestLevelFromLevels(levels);
      expect(result).toBe('Child');
    });

    it('should return empty string for empty array', () => {
      const result = highestLevelFromLevels([]);
      expect(result).toBe('');
    });

    it('should return empty string when no levels match order', () => {
      const levels = [
        { level: 'Baby I', id: 1 },
        { level: 'Baby II', id: 2 },
      ];
      const result = highestLevelFromLevels(levels);
      expect(result).toBe('');
    });
  });

  describe('pickHighestLevelObject function', () => {
    it('should work the same as pickHighestByOrder for standard objects', () => {
      const data = [
        { id: 1, name: 'Child' },
        { id: 2, name: 'Adult' },
        { id: 3, name: 'Perfect' },
      ];
      const result = pickHighestLevelObject(data);
      expect(result).toEqual({ id: 3, name: 'Perfect' });
    });

    it('should return undefined for empty array', () => {
      const result = pickHighestLevelObject([]);
      expect(result).toBeUndefined();
    });
  });
});
