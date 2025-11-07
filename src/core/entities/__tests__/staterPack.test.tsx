import { StarterPackProps } from '../staterPack';

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

      expect(mockProps.item.id).toBe(1);
      expect(mockProps.item.name).toBe('Common Pack');
      expect(mockProps.item.type).toBe('C');
      expect(mockProps.item.image).toBe('/images/common.png');
      expect(mockProps.item.price).toBe(5);
      expect(mockProps.item.description).toContain('Perfect for beginners');

      // Type validation
      expect(typeof mockProps.item.id).toBe('number');
      expect(typeof mockProps.item.name).toBe('string');
      expect(typeof mockProps.item.type).toBe('string');
      expect(typeof mockProps.item.image).toBe('string');
      expect(typeof mockProps.item.price).toBe('number');
      expect(typeof mockProps.item.description).toBe('string');
    });

    it('should validate all required properties exist', () => {
      const createStarterPack = (data: Partial<StarterPackProps['item']>): StarterPackProps => {
        return {
          item: {
            id: 0,
            name: '',
            type: '',
            image: '',
            price: 0,
            description: '',
            ...data,
          },
        };
      };

      const starterPack = createStarterPack({
        id: 2,
        name: 'Balance Pack',
        type: 'B',
        image: '/images/balance.png',
        price: 10,
        description: 'Balanced starter pack',
      });

      expect(starterPack.item).toHaveProperty('id');
      expect(starterPack.item).toHaveProperty('name');
      expect(starterPack.item).toHaveProperty('type');
      expect(starterPack.item).toHaveProperty('image');
      expect(starterPack.item).toHaveProperty('price');
      expect(starterPack.item).toHaveProperty('description');
    });

    it('should handle different starter pack types', () => {
      const packTypes = ['C', 'B', 'A', 'R'];
      const packNames = ['Common', 'Balance', 'Advanced', 'Rare'];
      const prices = [5, 10, 15, 20];

      packTypes.forEach((type, index) => {
        const pack: StarterPackProps = {
          item: {
            id: index + 1,
            name: `${packNames[index]} Pack`,
            type: type,
            image: `/images/${packNames[index].toLowerCase()}.png`,
            price: prices[index],
            description: `${packNames[index]} starter pack description`,
          },
        };

        expect(pack.item.type).toBe(type);
        expect(pack.item.price).toBe(prices[index]);
        expect(pack.item.name).toContain(packNames[index]);
        expect(pack.item.image).toContain(packNames[index].toLowerCase());
      });
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
      const validTypes = ['C', 'B', 'A', 'R'];

      validTypes.forEach((type) => {
        const pack: StarterPackProps = {
          item: {
            id: 1,
            name: 'Test Pack',
            type: type,
            image: '/images/test.png',
            price: 5,
            description: 'Test description',
          },
        };

        expect(pack.item.type).toHaveLength(1);
        expect(validTypes).toContain(pack.item.type);
      });
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
      const packs: StarterPackProps[] = [
        {
          item: {
            id: 1,
            name: 'Common',
            type: 'C',
            image: '/images/common.png',
            price: 5,
            description: 'Common pack',
          },
        },
        {
          item: {
            id: 2,
            name: 'Balance',
            type: 'B',
            image: '/images/balance.png',
            price: 10,
            description: 'Balance pack',
          },
        },
        {
          item: {
            id: 3,
            name: 'Advanced',
            type: 'A',
            image: '/images/advanced.png',
            price: 15,
            description: 'Advanced pack',
          },
        },
      ];

      const ids = packs.map((pack) => pack.item.id);
      const uniqueIds = [...new Set(ids)];

      expect(uniqueIds).toHaveLength(ids.length); // All IDs should be unique

      packs.forEach((pack) => {
        expect(pack.item.id).toBeGreaterThan(0);
        expect(Number.isInteger(pack.item.id)).toBe(true);
      });
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
      const componentProps: StarterPackProps = {
        item: {
          id: 4,
          name: 'Rare Pack',
          type: 'R',
          image: '/images/rare.png',
          price: 20,
          description:
            'The ultimate pack! Experience legendary power with 1 Champion, 2 Ultimates, and 1 exclusive Mega card. For serious collectors only!',
        },
      };

      // Should be valid for React component props
      expect(componentProps.item).toBeDefined();
      expect(Object.keys(componentProps.item)).toHaveLength(6);

      // Should have all required properties for UI display
      expect(componentProps.item.name).toBeTruthy();
      expect(componentProps.item.price).toBeTruthy();
      expect(componentProps.item.description).toBeTruthy();
      expect(componentProps.item.image).toBeTruthy();
    });

    it('should maintain data consistency for price ordering', () => {
      const packs: StarterPackProps[] = [
        {
          item: {
            id: 1,
            name: 'Common',
            type: 'C',
            image: '/images/common.png',
            price: 5,
            description: 'Common',
          },
        },
        {
          item: {
            id: 2,
            name: 'Balance',
            type: 'B',
            image: '/images/balance.png',
            price: 10,
            description: 'Balance',
          },
        },
        {
          item: {
            id: 3,
            name: 'Advanced',
            type: 'A',
            image: '/images/advanced.png',
            price: 15,
            description: 'Advanced',
          },
        },
        {
          item: {
            id: 4,
            name: 'Rare',
            type: 'R',
            image: '/images/rare.png',
            price: 20,
            description: 'Rare',
          },
        },
      ];

      // Prices should be in ascending order
      for (let i = 1; i < packs.length; i++) {
        expect(packs[i].item.price).toBeGreaterThan(packs[i - 1].item.price);
      }

      // Type hierarchy should match price hierarchy
      const typeHierarchy = ['C', 'B', 'A', 'R'];
      packs.forEach((pack, index) => {
        expect(pack.item.type).toBe(typeHierarchy[index]);
      });
    });
  });
});
