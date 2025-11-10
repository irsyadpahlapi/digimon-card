import {
  Category,
  sellingDigimonPrice,
  PriceStarterpack,
  pickHighestByOrder,
  highestLevelFromLevels,
  pickHighestLevelObject,
} from '../utils';

describe('Utils Functions', () => {
  describe('Category function', () => {
    it('should return correct category for Child level', () => {
      expect(Category('Child')).toBe('Rookie');
    });

    it('should return correct category for Adult level', () => {
      expect(Category('Adult')).toBe('Champion');
    });

    it('should return correct category for Armor level', () => {
      expect(Category('Armor')).toBe('Champion');
    });

    it('should return correct category for Unknown level', () => {
      expect(Category('Unknown')).toBe('Champion');
    });

    it('should return correct category for Hybrid level', () => {
      expect(Category('Hybrid')).toBe('Champion');
    });

    it('should return correct category for Ultimate level', () => {
      expect(Category('Ultimate')).toBe('Ultimate');
    });

    it('should return correct category for Perfect level', () => {
      expect(Category('Perfect')).toBe('Mega');
    });

    it('should return Baby for unrecognized levels', () => {
      expect(Category('Rookie')).toBe('Baby');
      expect(Category('Champion')).toBe('Baby');
      expect(Category('')).toBe('Baby');
      expect(Category('Invalid')).toBe('Baby');
    });
  });

  describe('PriceStarterpack function', () => {
    it('should return correct price for Common pack (C)', () => {
      expect(PriceStarterpack('C')).toBe(5);
    });

    it('should return correct price for Balance pack (B)', () => {
      expect(PriceStarterpack('B')).toBe(10);
    });

    it('should return correct price for Advanced pack (A)', () => {
      expect(PriceStarterpack('A')).toBe(15);
    });

    it('should return correct price for Rare pack (R)', () => {
      expect(PriceStarterpack('R')).toBe(20);
    });

    it('should return 0 for unknown pack types', () => {
      expect(PriceStarterpack('X')).toBe(0);
      expect(PriceStarterpack('')).toBe(0);
      expect(PriceStarterpack('Invalid')).toBe(0);
    });
  });

  describe('sellingDigimonPrice function', () => {
    it('should return correct price for Rookie category with evolution', () => {
      expect(sellingDigimonPrice('Rookie', true)).toBe(5);
    });

    it('should return correct price for Champion category with evolution', () => {
      expect(sellingDigimonPrice('Champion', true)).toBe(10);
    });

    it('should return correct price for Ultimate category with evolution', () => {
      expect(sellingDigimonPrice('Ultimate', true)).toBe(20);
    });

    it('should return correct price for Mega category with evolution', () => {
      expect(sellingDigimonPrice('Mega', true)).toBe(30);
    });

    it('should return God price when no evolution available', () => {
      expect(sellingDigimonPrice('Rookie', false)).toBe(100);
      expect(sellingDigimonPrice('Champion', false)).toBe(100);
      expect(sellingDigimonPrice('Ultimate', false)).toBe(100);
      expect(sellingDigimonPrice('Mega', false)).toBe(100);
    });

    it('should return default price for unknown categories', () => {
      expect(sellingDigimonPrice('Unknown', true)).toBe(1);
      expect(sellingDigimonPrice('Baby', true)).toBe(1);
      expect(sellingDigimonPrice('', true)).toBe(1);
      expect(sellingDigimonPrice('Invalid', true)).toBe(1);
    });

    it('should return God price when explicitly God category', () => {
      expect(sellingDigimonPrice('God', true)).toBe(100);
      expect(sellingDigimonPrice('God', false)).toBe(100);
    });
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
      const starterPackTypes = ['C', 'B', 'A', 'R'];
      const expectedPrices = [5, 10, 15, 20];

      for (const [index, type] of starterPackTypes.entries()) {
        expect(PriceStarterpack(type)).toBe(expectedPrices[index]);
      }
    });

    it('should correctly handle max selling price for non-evolvable cards', () => {
      const categories = ['Rookie', 'Champion', 'Ultimate', 'Mega'];

      for (const category of categories) {
        const priceWithEvolution = sellingDigimonPrice(category, true);
        const priceWithoutEvolution = sellingDigimonPrice(category, false);

        expect(priceWithoutEvolution).toBe(100); // God price
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
