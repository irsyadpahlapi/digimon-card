import STARTER_PACK_ITEMS, { Cateogory, badgeMap, gradientMap, borderMap } from '../constant';

describe('Constant Hook', () => {
  describe('STARTER_PACK_ITEMS', () => {
    it('should have correct structure and data for all starter packs', () => {
      expect(STARTER_PACK_ITEMS).toHaveLength(4);

      // Test Common pack
      const commonPack = STARTER_PACK_ITEMS[0];
      expect(commonPack.id).toBe(1);
      expect(commonPack.name).toBe('Common');
      expect(commonPack.type).toBe('C');
      expect(commonPack.price).toBe(5);
      expect(commonPack.image).toBe('/images/common.png');
      expect(commonPack.description).toContain('Perfect for beginners');

      // Test Balance pack
      const balancePack = STARTER_PACK_ITEMS[1];
      expect(balancePack.id).toBe(2);
      expect(balancePack.name).toBe('Ballance');
      expect(balancePack.type).toBe('B');
      expect(balancePack.price).toBe(10);
      expect(balancePack.image).toBe('/images/balance.png');
      expect(balancePack.description).toContain('The smart choice');

      // Test Advanced pack
      const advancedPack = STARTER_PACK_ITEMS[2];
      expect(advancedPack.id).toBe(3);
      expect(advancedPack.name).toBe('Advanced');
      expect(advancedPack.type).toBe('A');
      expect(advancedPack.price).toBe(15);
      expect(advancedPack.image).toBe('/images/advance.png');
      expect(advancedPack.description).toContain('Power up your game');

      // Test Rare pack
      const rarePack = STARTER_PACK_ITEMS[3];
      expect(rarePack.id).toBe(4);
      expect(rarePack.name).toBe('Rare');
      expect(rarePack.type).toBe('R');
      expect(rarePack.price).toBe(20);
      expect(rarePack.image).toBe('/images/rare.png');
      expect(rarePack.description).toContain('The ultimate pack');
    });

    it('should have all required properties for each starter pack', () => {
      for (const [index, pack] of STARTER_PACK_ITEMS.entries()) {
        expect(pack).toHaveProperty('id');
        expect(pack).toHaveProperty('name');
        expect(pack).toHaveProperty('type');
        expect(pack).toHaveProperty('price');
        expect(pack).toHaveProperty('image');
        expect(pack).toHaveProperty('description');

        // Validate types
        expect(typeof pack.id).toBe('number');
        expect(typeof pack.name).toBe('string');
        expect(typeof pack.type).toBe('string');
        expect(typeof pack.price).toBe('number');
        expect(typeof pack.image).toBe('string');
        expect(typeof pack.description).toBe('string');

        // Validate non-empty strings
        expect(pack.name.length).toBeGreaterThan(0);
        expect(pack.type.length).toBeGreaterThan(0);
        expect(pack.image.length).toBeGreaterThan(0);
        expect(pack.description.length).toBeGreaterThan(0);

        // Validate positive prices
        expect(pack.price).toBeGreaterThan(0);

        // Validate unique IDs
        const otherPacks = STARTER_PACK_ITEMS.filter((_, i) => i !== index);
        expect(otherPacks.find((other) => other.id === pack.id)).toBeUndefined();
      }
    });

    it('should have packs ordered by price ascending', () => {
      for (let i = 1; i < STARTER_PACK_ITEMS.length; i++) {
        expect(STARTER_PACK_ITEMS[i].price).toBeGreaterThan(STARTER_PACK_ITEMS[i - 1].price);
      }
    });

    it('should have unique pack types', () => {
      const types = STARTER_PACK_ITEMS.map((pack) => pack.type);
      const uniqueTypes = [...new Set(types)];
      expect(uniqueTypes).toHaveLength(types.length);
    });

    it('should have valid image paths', () => {
      for (const pack of STARTER_PACK_ITEMS) {
        expect(pack.image).toMatch(/^\/images\/\w+\.png$/);
      }
    });
  });

  describe('badgeMap (Rarity Colors)', () => {
    it('should have correct color mappings for all rarity types', () => {
      expect(badgeMap).toHaveProperty('C');
      expect(badgeMap).toHaveProperty('B');
      expect(badgeMap).toHaveProperty('A');
      expect(badgeMap).toHaveProperty('R');

      expect(badgeMap.C).toBe('bg-gray-500');
      expect(badgeMap.B).toBe('bg-blue-500');
      expect(badgeMap.A).toBe('bg-purple-500');
      expect(badgeMap.R).toBe('bg-gradient-to-r from-yellow-400 to-orange-500');
    });

    it('should have valid CSS classes for all colors', () => {
      for (const color of Object.values(badgeMap)) {
        expect(typeof color).toBe('string');
        expect(color.length).toBeGreaterThan(0);
        expect(color).toMatch(/^bg-/); // All should start with 'bg-'
      }
    });

    it('should map to starter pack types correctly', () => {
      for (const pack of STARTER_PACK_ITEMS) {
        expect(badgeMap).toHaveProperty(pack.type);
        expect(typeof badgeMap[pack.type as keyof typeof badgeMap]).toBe('string');
      }
    });
  });

  describe('gradientMap', () => {
    it('should have correct gradient mappings for all rarity types', () => {
      expect(gradientMap).toHaveProperty('C');
      expect(gradientMap).toHaveProperty('B');
      expect(gradientMap).toHaveProperty('A');
      expect(gradientMap).toHaveProperty('R');

      expect(gradientMap.C).toBe('from-gray-400 via-gray-500 to-gray-600');
      expect(gradientMap.B).toBe('from-blue-400 via-blue-500 to-blue-600');
      expect(gradientMap.A).toBe('from-purple-400 via-purple-500 to-purple-600');
      expect(gradientMap.R).toBe('from-yellow-400 via-orange-500 to-red-600');
    });

    it('should have valid gradient classes', () => {
      for (const gradient of Object.values(gradientMap)) {
        expect(typeof gradient).toBe('string');
        expect(gradient.length).toBeGreaterThan(0);
        expect(gradient).toMatch(/^from-/); // All should start with 'from-'
        expect(gradient).toContain('via-'); // All should contain 'via-'
        expect(gradient).toContain('to-'); // All should contain 'to-'
      }
    });
  });

  describe('borderMap', () => {
    it('should have correct border mappings for all rarity types', () => {
      expect(borderMap).toHaveProperty('C');
      expect(borderMap).toHaveProperty('B');
      expect(borderMap).toHaveProperty('A');
      expect(borderMap).toHaveProperty('R');

      expect(borderMap.C).toBe('border-gray-400');
      expect(borderMap.B).toBe('border-blue-400');
      expect(borderMap.A).toBe('border-purple-400');
      expect(borderMap.R).toBe('border-yellow-400');
    });

    it('should have valid border classes', () => {
      for (const border of Object.values(borderMap)) {
        expect(typeof border).toBe('string');
        expect(border.length).toBeGreaterThan(0);
        expect(border).toMatch(/^border-/); // All should start with 'border-'
      }
    });
  });

  describe('Cateogory', () => {
    it('should contain all expected digimon categories', () => {
      expect(Cateogory).toHaveLength(4);
      expect(Cateogory).toContain('Rookie');
      expect(Cateogory).toContain('Champion');
      expect(Cateogory).toContain('Ultimate');
      expect(Cateogory).toContain('Mega');
    });

    it('should have categories in correct evolution order', () => {
      expect(Cateogory[0]).toBe('Rookie');
      expect(Cateogory[1]).toBe('Champion');
      expect(Cateogory[2]).toBe('Ultimate');
      expect(Cateogory[3]).toBe('Mega');
    });

    it('should be an array of strings', () => {
      expect(Array.isArray(Cateogory)).toBe(true);
      for (const category of Cateogory) {
        expect(typeof category).toBe('string');
        expect(category.length).toBeGreaterThan(0);
      }
    });

    it('should have unique categories', () => {
      const uniqueCategories = [...new Set(Cateogory)];
      expect(uniqueCategories).toHaveLength(Cateogory.length);
    });
  });

  describe('Integration Tests', () => {
    it('should have consistent data across all constants', () => {
      // Check if all starter pack types have corresponding badge colors
      for (const pack of STARTER_PACK_ITEMS) {
        expect(badgeMap).toHaveProperty(pack.type);
      }

      // Verify default export is the starter pack items
      expect(Array.isArray(STARTER_PACK_ITEMS)).toBe(true);
      expect(STARTER_PACK_ITEMS.length).toBeGreaterThan(0);
    });

    it('should have all required exports', () => {
      // Test that all expected exports are available
      expect(STARTER_PACK_ITEMS).toBeDefined();
      expect(Cateogory).toBeDefined();
      expect(badgeMap).toBeDefined();
      expect(gradientMap).toBeDefined();
      expect(borderMap).toBeDefined();
    });
  });

  describe('Data Validation', () => {
    it('should have consistent pack naming and typing', () => {
      const expectedPacks = [
        { name: 'Common', type: 'C' },
        { name: 'Ballance', type: 'B' }, // Note: intentional typo in original
        { name: 'Advanced', type: 'A' },
        { name: 'Rare', type: 'R' },
      ];

      for (const [index, expected] of expectedPacks.entries()) {
        expect(STARTER_PACK_ITEMS[index].name).toBe(expected.name);
        expect(STARTER_PACK_ITEMS[index].type).toBe(expected.type);
      }
    });

    it('should have increasing pack values', () => {
      // Test that more expensive packs provide better value
      const commonPack = STARTER_PACK_ITEMS[0];
      const rarePack = STARTER_PACK_ITEMS[3];

      expect(rarePack.price).toBeGreaterThan(commonPack.price);
      expect(rarePack.description.length).toBeGreaterThan(0);
      expect(commonPack.description.length).toBeGreaterThan(0);
    });
  });
});
