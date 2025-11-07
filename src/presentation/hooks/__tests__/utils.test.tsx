import { Category, sellingDigimonPrice, PriceStarterpack } from '../utils';

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

      testCases.forEach(({ digimonLevel, expectedCategory, hasEvolution, expectedPrice }) => {
        const category = Category(digimonLevel);
        const price = sellingDigimonPrice(category, hasEvolution);

        expect(category).toBe(expectedCategory);
        expect(price).toBe(expectedPrice);
      });
    });

    it('should handle starter pack pricing separately', () => {
      const starterPackTypes = ['C', 'B', 'A', 'R'];
      const expectedPrices = [5, 10, 15, 20];

      starterPackTypes.forEach((type, index) => {
        expect(PriceStarterpack(type)).toBe(expectedPrices[index]);
      });
    });

    it('should correctly handle max selling price for non-evolvable cards', () => {
      const categories = ['Rookie', 'Champion', 'Ultimate', 'Mega'];

      categories.forEach((category) => {
        const priceWithEvolution = sellingDigimonPrice(category, true);
        const priceWithoutEvolution = sellingDigimonPrice(category, false);

        expect(priceWithoutEvolution).toBe(100); // God price
        expect(priceWithEvolution).toBeLessThan(priceWithoutEvolution);
      });
    });
  });
});
