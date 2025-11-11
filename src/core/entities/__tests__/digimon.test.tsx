import { Content, ListDigimonEntity, DetailDigimonEntity } from '../digimon';
import {
  validatePropertyTypes,
  validateRequiredProperties,
  validateImageStructure,
  validateFieldStructure,
  validateNextEvolutionStructure,
} from '@/__tests__/test-utils';

describe('Digimon Entities', () => {
  describe('Content Interface', () => {
    it('should have correct structure for Content interface', () => {
      const mockContent: Content = {
        id: 1,
        name: 'Agumon',
        href: '/digimon/agumon',
        image: 'agumon.jpg',
      };

      validatePropertyTypes(mockContent as unknown as Record<string, unknown>, {
        id: 'number',
        name: 'string',
        href: 'string',
        image: 'string',
      });
    });

    it('should validate Content interface properties are required', () => {
      const createContent = (data: Partial<Content>): Content => {
        return {
          id: 0,
          name: '',
          href: '',
          image: '',
          ...data,
        } as Content;
      };

      const content = createContent({
        id: 1,
        name: 'Test',
        href: '/test',
        image: 'test.jpg',
      });

      validateRequiredProperties(content as unknown as Record<string, unknown>, [
        'id',
        'name',
        'href',
        'image',
      ]);
    });
  });

  describe('ListDigimonEntity Interface', () => {
    it('should have correct structure for ListDigimonEntity', () => {
      const mockListEntity: ListDigimonEntity = {
        content: [
          {
            id: 1,
            name: 'Agumon',
            href: '/digimon/agumon',
            image: 'agumon.jpg',
          },
          {
            id: 2,
            name: 'Gabumon',
            href: '/digimon/gabumon',
            image: 'gabumon.jpg',
          },
        ],
        pageable: {
          currentPage: 1,
          elementsOnPage: 2,
          totalElements: 10,
          totalPages: 5,
          previousPage: '',
          nextPage: '/page/2',
        },
      };

      expect(mockListEntity.content).toHaveLength(2);
      expect(mockListEntity.content[0].name).toBe('Agumon');
      expect(mockListEntity.content[1].name).toBe('Gabumon');

      expect(mockListEntity.pageable.currentPage).toBe(1);
      expect(mockListEntity.pageable.elementsOnPage).toBe(2);
      expect(mockListEntity.pageable.totalElements).toBe(10);
      expect(mockListEntity.pageable.totalPages).toBe(5);
    });

    it('should handle empty content array', () => {
      const emptyListEntity: ListDigimonEntity = {
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

      expect(emptyListEntity.content).toHaveLength(0);
      expect(emptyListEntity.pageable.totalElements).toBe(0);
    });

    it('should validate pageable structure', () => {
      const mockListEntity: ListDigimonEntity = {
        content: [],
        pageable: {
          currentPage: 2,
          elementsOnPage: 10,
          totalElements: 25,
          totalPages: 3,
          previousPage: '/page/1',
          nextPage: '/page/3',
        },
      };

      validatePropertyTypes(mockListEntity.pageable as unknown as Record<string, unknown>, {
        currentPage: 'number',
        elementsOnPage: 'number',
        totalElements: 'number',
        totalPages: 'number',
        previousPage: 'string',
        nextPage: 'string',
      });
    });
  });

  describe('DetailDigimonEntity Interface', () => {
    it('should have correct structure for DetailDigimonEntity', () => {
      const mockDetailEntity: DetailDigimonEntity = {
        id: 1,
        name: 'Agumon',
        images: [
          { href: 'agumon.jpg', transparent: false },
          { href: 'agumon_transparent.png', transparent: true },
        ],
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

      expect(mockDetailEntity.id).toBe(1);
      expect(mockDetailEntity.name).toBe('Agumon');
      expect(mockDetailEntity.images).toHaveLength(2);
      expect(mockDetailEntity.levels).toHaveLength(1);
      expect(mockDetailEntity.types).toHaveLength(1);
      expect(mockDetailEntity.attributes).toHaveLength(1);
      expect(mockDetailEntity.fields).toHaveLength(1);
      expect(mockDetailEntity.descriptions).toHaveLength(1);
      expect(mockDetailEntity.nextEvolutions).toHaveLength(1);
      expect(mockDetailEntity.level.level).toBe('Rookie');
    });

    it('should validate Image structure', () => {
      const mockDetailEntity: DetailDigimonEntity = {
        id: 1,
        name: 'TestDigimon',
        images: [
          { href: 'test.jpg', transparent: false },
          { href: 'test_bg.png', transparent: true },
        ],
        levels: [],
        types: [],
        attributes: [],
        fields: [],
        descriptions: [],
        nextEvolutions: [],
        level: { id: 1, level: 'Test' },
      };

      validateImageStructure(mockDetailEntity.images);
    });

    it('should validate Level structure', () => {
      const mockDetailEntity: DetailDigimonEntity = {
        id: 1,
        name: 'TestDigimon',
        images: [],
        levels: [
          { id: 1, level: 'Rookie' },
          { id: 2, level: 'Champion' },
        ],
        types: [],
        attributes: [],
        fields: [],
        descriptions: [],
        nextEvolutions: [],
        level: { id: 1, level: 'Rookie' },
      };

      for (const level of mockDetailEntity.levels) {
        validatePropertyTypes(level as unknown as Record<string, unknown>, {
          id: 'number',
          level: 'string',
        });
        expect(level.id).toBeGreaterThan(0);
        expect(level.level.length).toBeGreaterThan(0);
      }
    });

    it('should validate Type structure', () => {
      const mockDetailEntity: DetailDigimonEntity = {
        id: 1,
        name: 'TestDigimon',
        images: [],
        levels: [],
        types: [
          { id: 1, type: 'Vaccine' },
          { id: 2, type: 'Data' },
          { id: 3, type: 'Virus' },
        ],
        attributes: [],
        fields: [],
        descriptions: [],
        nextEvolutions: [],
        level: { id: 1, level: 'Test' },
      };

      for (const type of mockDetailEntity.types) {
        validatePropertyTypes(type as unknown as Record<string, unknown>, {
          id: 'number',
          type: 'string',
        });
        expect(type.id).toBeGreaterThan(0);
        expect(['Vaccine', 'Data', 'Virus']).toContain(type.type);
      }
    });

    it('should validate Attribute structure', () => {
      const mockDetailEntity: DetailDigimonEntity = {
        id: 1,
        name: 'TestDigimon',
        images: [],
        levels: [],
        types: [],
        attributes: [
          { id: 1, attribute: 'Fire' },
          { id: 2, attribute: 'Water' },
        ],
        fields: [],
        descriptions: [],
        nextEvolutions: [],
        level: { id: 1, level: 'Test' },
      };

      for (const attribute of mockDetailEntity.attributes) {
        validatePropertyTypes(attribute as unknown as Record<string, unknown>, {
          id: 'number',
          attribute: 'string',
        });
        expect(attribute.id).toBeGreaterThan(0);
        expect(attribute.attribute.length).toBeGreaterThan(0);
      }
    });

    it('should validate Field structure', () => {
      const mockDetailEntity: DetailDigimonEntity = {
        id: 1,
        name: 'TestDigimon',
        images: [],
        levels: [],
        types: [],
        attributes: [],
        fields: [
          { id: 1, field: 'Wind Guardians', image: 'wind.jpg' },
          { id: 2, field: 'Metal Empire', image: 'metal.jpg' },
        ],
        descriptions: [],
        nextEvolutions: [],
        level: { id: 1, level: 'Test' },
      };

      validateFieldStructure(mockDetailEntity.fields);
    });

    it('should validate NextEvolution structure', () => {
      const mockDetailEntity: DetailDigimonEntity = {
        id: 1,
        name: 'TestDigimon',
        images: [],
        levels: [],
        types: [],
        attributes: [],
        fields: [],
        descriptions: [],
        nextEvolutions: [
          {
            id: 2,
            digimon: 'TestEvolution',
            condition: 'Level up',
            image: 'evolution.jpg',
            url: '/evolution',
          },
        ],
        level: { id: 1, level: 'Test' },
      };

      validateNextEvolutionStructure(mockDetailEntity.nextEvolutions);
    });

    it('should validate Description structure', () => {
      const mockDetailEntity: DetailDigimonEntity = {
        id: 1,
        name: 'TestDigimon',
        images: [],
        levels: [],
        types: [],
        attributes: [],
        fields: [],
        descriptions: [
          {
            origin: 'Digital Monster Ver. 1',
            language: 'en',
            description: 'Test description',
          },
          {
            origin: 'Digimon World',
            language: 'jp',
            description: 'Japanese description',
          },
        ],
        nextEvolutions: [],
        level: { id: 1, level: 'Test' },
      };

      for (const desc of mockDetailEntity.descriptions) {
        validatePropertyTypes(desc as unknown as Record<string, unknown>, {
          origin: 'string',
          language: 'string',
          description: 'string',
        });
        expect(desc.origin.length).toBeGreaterThan(0);
        expect(desc.language.length).toBeGreaterThan(0);
        expect(desc.description.length).toBeGreaterThan(0);
      }
    });

    it('should handle empty arrays in DetailDigimonEntity', () => {
      const emptyDetailEntity: DetailDigimonEntity = {
        id: 1,
        name: 'EmptyDigimon',
        images: [],
        levels: [],
        types: [],
        attributes: [],
        fields: [],
        descriptions: [],
        nextEvolutions: [],
        level: { id: 1, level: 'Unknown' },
      };

      expect(emptyDetailEntity.images).toHaveLength(0);
      expect(emptyDetailEntity.levels).toHaveLength(0);
      expect(emptyDetailEntity.types).toHaveLength(0);
      expect(emptyDetailEntity.attributes).toHaveLength(0);
      expect(emptyDetailEntity.fields).toHaveLength(0);
      expect(emptyDetailEntity.descriptions).toHaveLength(0);
      expect(emptyDetailEntity.nextEvolutions).toHaveLength(0);
    });
  });

  describe('Entity Integration', () => {
    it('should create valid entity structures for API consumption', () => {
      const validListEntity: ListDigimonEntity = {
        content: [
          {
            id: 1,
            name: 'Agumon',
            href: '/api/digimon/1',
            image: 'https://digimon.net/agumon.jpg',
          },
        ],
        pageable: {
          currentPage: 1,
          elementsOnPage: 1,
          totalElements: 100,
          totalPages: 100,
          previousPage: '',
          nextPage: '/api/digimon?page=2',
        },
      };

      expect(validListEntity.content[0].href).toMatch(/^\/api\//);
      expect(validListEntity.pageable.nextPage).toMatch(/page=2/);
    });

    it('should maintain referential integrity between list and detail entities', () => {
      const listContent: Content = {
        id: 1,
        name: 'Agumon',
        href: '/digimon/1',
        image: 'agumon.jpg',
      };

      const detailEntity: DetailDigimonEntity = {
        id: 1, // Same ID as list content
        name: 'Agumon', // Same name as list content
        images: [{ href: 'agumon.jpg', transparent: false }],
        levels: [{ id: 1, level: 'Rookie' }],
        types: [{ id: 1, type: 'Vaccine' }],
        attributes: [{ id: 1, attribute: 'Fire' }],
        fields: [],
        descriptions: [],
        nextEvolutions: [],
        level: { id: 1, level: 'Rookie' },
      };

      expect(listContent.id).toBe(detailEntity.id);
      expect(listContent.name).toBe(detailEntity.name);
    });
  });
});
