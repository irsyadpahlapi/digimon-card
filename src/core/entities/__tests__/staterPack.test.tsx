import { StarterPackProps } from '../staterPack';
import {
  STARTER_PACKS,
  validatePropertyTypes,
  validateRequiredProperties,
} from '@/__tests__/test-utils';

describe('StarterPack Entity', () => {
  describe('StarterPackProps Interface', () => {
    it('should have correct structure for StarterPackProps interface', () => {
      const mockProps: StarterPackProps = {
        item: {
          id: 1,
          name: 'Common Pack',
          type: 'C',
          image: '/images/common.png',
          price: 5,
          description: 'Perfect for beginners! Get 4 Rookie cards to start your collection.',
        },
      };

      validatePropertyTypes(mockProps.item, {
        id: 'number',
        name: 'string',
        type: 'string',
        image: 'string',
        price: 'number',
        description: 'string',
      });
      expect(mockProps.item.description).toContain('Perfect for beginners');
    });

    it('should validate all required properties exist', () => {
      const starterPack: StarterPackProps = {
        item: {
          id: 2,
          name: 'Balance Pack',
          type: 'B',
          image: '/images/balance.png',
          price: 10,
          description: 'Balanced starter pack',
        },
      };

      validateRequiredProperties(starterPack.item, [
        'id',
        'name',
        'type',
        'image',
        'price',
        'description',
      ]);
    });

    it('should handle different starter pack types', () => {
      for (const pack of STARTER_PACKS) {
        expect(['C', 'B', 'A', 'R']).toContain(pack.type);
        expect(pack.price).toBeGreaterThan(0);
        expect(pack.image).toMatch(/\.(png)$/);
      }
    });

    it('should validate price is a positive number', () => {
      const validPack: StarterPackProps = {
        item: {
          id: 1,
          name: 'Test Pack',
          type: 'C',
          image: '/images/test.png',
          price: 15,
          description: 'Test description',
        },
      };

      expect(validPack.item.price).toBeGreaterThan(0);
      expect(typeof validPack.item.price).toBe('number');
      expect(Number.isInteger(validPack.item.price)).toBe(true);
    });

    it('should validate image path format', () => {
      const pack: StarterPackProps = {
        item: {
          id: 1,
          name: 'Test Pack',
          type: 'C',
          image: '/images/common.png',
          price: 5,
          description: 'Test description',
        },
      };

      expect(pack.item.image).toMatch(/^\/images\/\w+\.(png|jpg|jpeg|gif)$/);
      expect(pack.item.image).toContain('/images/');
    });

    it('should validate pack type is single character', () => {
      for (const pack of STARTER_PACKS) {
        expect(pack.type).toHaveLength(1);
        expect(['C', 'B', 'A', 'R']).toContain(pack.type);
        expect(typeof pack.type).toBe('string');
      }
    });

    it('should validate description is not empty', () => {
      const pack: StarterPackProps = {
        item: {
          id: 1,
          name: 'Common Pack',
          type: 'C',
          image: '/images/common.png',
          price: 5,
          description:
            'Perfect for beginners! Get 4 Rookie cards to start your collection and 1 Champion to lead your team into battle.',
        },
      };

      expect(pack.item.description.length).toBeGreaterThan(0);
      expect(pack.item.description.trim()).toBe(pack.item.description);
      expect(pack.item.description).toContain('cards');
    });

    it('should validate ID is unique and positive', () => {
      const ids = STARTER_PACKS.map((p) => p.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const id of ids) {
        expect(id).toBeGreaterThan(0);
        expect(Number.isInteger(id)).toBe(true);
      }
    });

    it('should validate name is descriptive and not empty', () => {
      const pack: StarterPackProps = {
        item: {
          id: 1,
          name: 'Common Pack',
          type: 'C',
          image: '/images/common.png',
          price: 5,
          description: 'Common starter pack',
        },
      };

      expect(pack.item.name.length).toBeGreaterThan(0);
      expect(pack.item.name.trim()).toBe(pack.item.name);
      expect(pack.item.name).not.toContain('  '); // No double spaces
    });

    it('should create valid props for component consumption', () => {
      for (const pack of STARTER_PACKS) {
        expect(pack.name).toBeTruthy();
        expect(pack.price).toBeTruthy();
        expect(pack.description).toBeTruthy();
        expect(pack.image).toBeTruthy();
      }
    });

    it('should maintain data consistency for price ordering', () => {
      const sortedByPrice = [...STARTER_PACKS].sort((a, b) => a.price - b.price);
      for (let i = 1; i < sortedByPrice.length; i++) {
        expect(sortedByPrice[i].price).toBeGreaterThan(sortedByPrice[i - 1].price);
      }
      const typeHierarchy = ['C', 'B', 'A', 'R'];
      for (const [index, pack] of STARTER_PACKS.entries()) {
        expect(pack.type).toBe(typeHierarchy[index]);
      }
    });
  });
});
