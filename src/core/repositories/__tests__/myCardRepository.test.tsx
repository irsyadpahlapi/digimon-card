import { DetailDigimonRepository } from '../myCardRepository';
import {
  validatePropertyTypes,
  validateRequiredProperties,
  validateImageStructure,
  validateFieldStructure,
  validateNextEvolutionStructure,
  validateNumericConstraints,
} from '@/__tests__/test-utils';

describe('MyCardRepository', () => {
  describe('DetailDigimonRepository Interface', () => {
    it('should have correct structure for DetailDigimonRepository interface', () => {
      const mockRepository: DetailDigimonRepository = {
        id: 1,
        name: 'Agumon',
        images: [
          { href: 'agumon.jpg', transparent: false },
          { href: 'agumon_bg.png', transparent: true },
        ],
        level: 'Rookie',
        type: 'Vaccine',
        attribute: 'Fire',
        fields: [{ id: 1, field: 'Wind Guardians', image: 'field.jpg' }],
        description: 'A small dinosaur Digimon with courage',
        nextEvolutions: [
          {
            id: 2,
            digimon: 'Greymon',
            condition: 'Level up',
            image: 'greymon.jpg',
            url: '/digimon/greymon',
          },
        ],
        isEvolution: false,
        evolution: 0,
        starterPack: 5,
        total: 1,
        category: 'Rookie',
        sellingDigimon: 10,
      };

      expect(mockRepository.id).toBe(1);
      expect(mockRepository.name).toBe('Agumon');
      expect(mockRepository.level).toBe('Rookie');
      expect(mockRepository.type).toBe('Vaccine');
      expect(mockRepository.attribute).toBe('Fire');
      expect(mockRepository.description).toContain('dinosaur');
      expect(mockRepository.isEvolution).toBe(false);
      expect(mockRepository.evolution).toBe(0);
      expect(mockRepository.starterPack).toBe(5);
      expect(mockRepository.total).toBe(1);
      expect(mockRepository.category).toBe('Rookie');
      expect(mockRepository.sellingDigimon).toBe(10);
    });

    it('should validate all required properties exist', () => {
      const repository: DetailDigimonRepository = {
        id: 1,
        name: 'TestDigimon',
        images: [],
        level: 'Champion',
        type: 'Data',
        attribute: 'Water',
        fields: [],
        description: 'Test description',
        nextEvolutions: [],
        isEvolution: true,
        evolution: 2,
        starterPack: 3,
        total: 5,
        category: 'Champion',
        sellingDigimon: 15,
      };

      validateRequiredProperties(repository as unknown as Record<string, unknown>, [
        'id',
        'name',
        'images',
        'level',
        'type',
        'attribute',
        'fields',
        'description',
        'nextEvolutions',
        'isEvolution',
        'evolution',
        'starterPack',
        'total',
        'category',
        'sellingDigimon',
      ]);
    });

    it('should validate data types for all properties', () => {
      const repository: DetailDigimonRepository = {
        id: 1,
        name: 'TypeTestDigimon',
        images: [{ href: 'test.jpg', transparent: false }],
        level: 'Ultimate',
        type: 'Virus',
        attribute: 'Dark',
        fields: [{ id: 1, field: 'Nightmare Soldiers', image: 'field.jpg' }],
        description: 'Type test description',
        nextEvolutions: [],
        isEvolution: true,
        evolution: 3,
        starterPack: 1,
        total: 2,
        category: 'Ultimate',
        sellingDigimon: 20,
      };

      validatePropertyTypes(repository as unknown as Record<string, unknown>, {
        id: 'number',
        name: 'string',
        images: 'array',
        level: 'string',
        type: 'string',
        attribute: 'string',
        fields: 'array',
        description: 'string',
        nextEvolutions: 'array',
        isEvolution: 'boolean',
        evolution: 'number',
        starterPack: 'number',
        total: 'number',
        category: 'string',
        sellingDigimon: 'number',
      });
    });

    it('should validate Image structure within repository', () => {
      const repository: DetailDigimonRepository = {
        id: 1,
        name: 'ImageTestDigimon',
        images: [
          { href: 'main.jpg', transparent: false },
          { href: 'transparent.png', transparent: true },
          { href: 'variant.gif', transparent: false },
        ],
        level: 'Mega',
        type: 'Vaccine',
        attribute: 'Light',
        fields: [],
        description: 'Image test',
        nextEvolutions: [],
        isEvolution: false,
        evolution: 0,
        starterPack: 0,
        total: 1,
        category: 'Mega',
        sellingDigimon: 25,
      };

      validateImageStructure(repository.images);

      // Additional validation for image file extensions
      for (const image of repository.images) {
        expect(image.href).toMatch(/\.(jpg|jpeg|png|gif)$/);
      }
    });

    it('should validate Field structure within repository', () => {
      const repository: DetailDigimonRepository = {
        id: 1,
        name: 'FieldTestDigimon',
        images: [],
        level: 'Champion',
        type: 'Data',
        attribute: 'Earth',
        fields: [
          { id: 1, field: 'Nature Spirits', image: 'nature.jpg' },
          { id: 2, field: 'Wind Guardians', image: 'wind.png' },
          { id: 3, field: 'Metal Empire', image: 'metal.gif' },
        ],
        description: 'Field test',
        nextEvolutions: [],
        isEvolution: false,
        evolution: 0,
        starterPack: 2,
        total: 1,
        category: 'Champion',
        sellingDigimon: 12,
      };

      validateFieldStructure(repository.fields);
    });

    it('should validate NextEvolution structure within repository', () => {
      const repository: DetailDigimonRepository = {
        id: 1,
        name: 'EvolutionTestDigimon',
        images: [],
        level: 'Rookie',
        type: 'Vaccine',
        attribute: 'Fire',
        fields: [],
        description: 'Evolution test',
        nextEvolutions: [
          {
            id: 2,
            digimon: 'FirstEvolution',
            condition: 'Level 10',
            image: 'evo1.jpg',
            url: '/evolution/1',
          },
          {
            id: 3,
            digimon: 'SecondEvolution',
            condition: 'Special item',
            image: 'evo2.png',
            url: '/evolution/2',
          },
        ],
        isEvolution: false,
        evolution: 0,
        starterPack: 1,
        total: 1,
        category: 'Rookie',
        sellingDigimon: 5,
      };

      validateNextEvolutionStructure(repository.nextEvolutions);
    });

    it('should validate evolution logic consistency', () => {
      // Non-evolution Digimon
      const nonEvolution: DetailDigimonRepository = {
        id: 1,
        name: 'NonEvolutionDigimon',
        images: [],
        level: 'Rookie',
        type: 'Vaccine',
        attribute: 'Fire',
        fields: [],
        description: 'Non-evolution test',
        nextEvolutions: [],
        isEvolution: false,
        evolution: 0,
        starterPack: 5,
        total: 1,
        category: 'Rookie',
        sellingDigimon: 5,
      };

      expect(nonEvolution.isEvolution).toBe(false);
      expect(nonEvolution.evolution).toBe(0);
      expect(nonEvolution.starterPack).toBeGreaterThan(0);

      // Evolution Digimon
      const evolution: DetailDigimonRepository = {
        id: 2,
        name: 'EvolutionDigimon',
        images: [],
        level: 'Champion',
        type: 'Vaccine',
        attribute: 'Fire',
        fields: [],
        description: 'Evolution test',
        nextEvolutions: [],
        isEvolution: true,
        evolution: 2,
        starterPack: 0,
        total: 1,
        category: 'Champion',
        sellingDigimon: 10,
      };

      expect(evolution.isEvolution).toBe(true);
      expect(evolution.evolution).toBeGreaterThan(0);
    });

    it('should validate category and level consistency', () => {
      const validCombinations = [
        { level: 'Rookie', category: 'Rookie' },
        { level: 'Champion', category: 'Champion' },
        { level: 'Ultimate', category: 'Ultimate' },
        { level: 'Mega', category: 'Mega' },
      ];

      for (const { level, category } of validCombinations) {
        const repository: DetailDigimonRepository = {
          id: 1,
          name: `${level}Digimon`,
          images: [],
          level: level,
          type: 'Vaccine',
          attribute: 'Fire',
          fields: [],
          description: `${level} level digimon`,
          nextEvolutions: [],
          isEvolution: false,
          evolution: 0,
          starterPack: 1,
          total: 1,
          category: category,
          sellingDigimon: 5,
        };

        expect(repository.level).toBe(repository.category);
      }
    });

    it('should validate selling price logic', () => {
      const repositories: DetailDigimonRepository[] = [
        {
          id: 1,
          name: 'Rookie',
          images: [],
          level: 'Rookie',
          type: 'Vaccine',
          attribute: 'Fire',
          fields: [],
          description: 'Rookie',
          nextEvolutions: [],
          isEvolution: false,
          evolution: 0,
          starterPack: 1,
          total: 1,
          category: 'Rookie',
          sellingDigimon: 5,
        },
        {
          id: 2,
          name: 'Champion',
          images: [],
          level: 'Champion',
          type: 'Vaccine',
          attribute: 'Fire',
          fields: [],
          description: 'Champion',
          nextEvolutions: [],
          isEvolution: false,
          evolution: 0,
          starterPack: 1,
          total: 1,
          category: 'Champion',
          sellingDigimon: 10,
        },
        {
          id: 3,
          name: 'Ultimate',
          images: [],
          level: 'Ultimate',
          type: 'Vaccine',
          attribute: 'Fire',
          fields: [],
          description: 'Ultimate',
          nextEvolutions: [],
          isEvolution: false,
          evolution: 0,
          starterPack: 1,
          total: 1,
          category: 'Ultimate',
          sellingDigimon: 15,
        },
        {
          id: 4,
          name: 'Mega',
          images: [],
          level: 'Mega',
          type: 'Vaccine',
          attribute: 'Fire',
          fields: [],
          description: 'Mega',
          nextEvolutions: [],
          isEvolution: false,
          evolution: 0,
          starterPack: 1,
          total: 1,
          category: 'Mega',
          sellingDigimon: 20,
        },
      ];

      // Selling price should increase with level
      for (let i = 1; i < repositories.length; i++) {
        expect(repositories[i].sellingDigimon).toBeGreaterThan(repositories[i - 1].sellingDigimon);
      }

      for (const repo of repositories) {
        expect(repo.sellingDigimon).toBeGreaterThan(0);
        expect(Number.isInteger(repo.sellingDigimon)).toBe(true);
      }
    });

    it('should validate numeric properties constraints', () => {
      const repository: DetailDigimonRepository = {
        id: 100,
        name: 'NumericTestDigimon',
        images: [],
        level: 'Champion',
        type: 'Data',
        attribute: 'Water',
        fields: [],
        description: 'Numeric test',
        nextEvolutions: [],
        isEvolution: true,
        evolution: 3,
        starterPack: 2,
        total: 5,
        category: 'Champion',
        sellingDigimon: 12,
      };

      validateNumericConstraints(
        {
          id: repository.id,
          evolution: repository.evolution,
          starterPack: repository.starterPack,
          total: repository.total,
          sellingDigimon: repository.sellingDigimon,
        },
        {
          id: { min: 1, isInteger: true },
          evolution: { min: 0, isInteger: true },
          starterPack: { min: 0, isInteger: true },
          total: { min: 1, isInteger: true },
          sellingDigimon: { min: 1, isInteger: true },
        },
      );
    });

    it('should handle empty arrays gracefully', () => {
      const repository: DetailDigimonRepository = {
        id: 1,
        name: 'EmptyArraysDigimon',
        images: [],
        level: 'Rookie',
        type: 'Vaccine',
        attribute: 'Fire',
        fields: [],
        description: 'Test with empty arrays',
        nextEvolutions: [],
        isEvolution: false,
        evolution: 0,
        starterPack: 1,
        total: 1,
        category: 'Rookie',
        sellingDigimon: 5,
      };

      expect(repository.images).toHaveLength(0);
      expect(repository.fields).toHaveLength(0);
      expect(repository.nextEvolutions).toHaveLength(0);
      expect(Array.isArray(repository.images)).toBe(true);
      expect(Array.isArray(repository.fields)).toBe(true);
      expect(Array.isArray(repository.nextEvolutions)).toBe(true);
    });
  });
});
