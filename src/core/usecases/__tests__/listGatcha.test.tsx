import { ListGatcha } from '../listGatcha';
import { DetailDigimonEntity } from '@/core/entities/digimon.d';
import { makeDetailDigimonEntity } from '@/__tests__/test-utils';

// Mock the repository
const mockListGatchaImpl = {
  getListGacha: jest.fn(),
};

jest.mock('../../../data/repositories/listGatchaRepository', () => ({
  ListGatchaImpl: jest.fn().mockImplementation(() => mockListGatchaImpl),
}));

// Mock utils
jest.mock('../../../presentation/hooks/utils', () => ({
  Category: jest.fn((level: string) => {
    switch (level) {
      case 'Child':
        return 'Rookie';
      case 'Adult':
        return 'Champion';
      case 'Ultimate':
        return 'Ultimate';
      case 'Perfect':
        return 'Mega';
      default:
        return 'Unknown';
    }
  }),
  sellingDigimonPrice: jest.fn((category: string, hasEvolution: boolean) => {
    const basePrice =
      {
        Rookie: 5,
        Champion: 10,
        Ultimate: 15,
        Mega: 20,
      }[category] || 5;
    return hasEvolution ? basePrice + 5 : basePrice;
  }),
  highestLevelFromLevels: jest.fn((levels: Array<{ level: string }>) => {
    if (!levels || levels.length === 0) return '';
    // Mock the actual behavior: return highest by LEVEL_ORDER
    const LEVEL_ORDER = ['Child', 'Adult', 'Armor', 'Unknown', 'Hybrid', 'Ultimate', 'Perfect'];
    const rank = new Map(LEVEL_ORDER.map((n, i) => [n, i]));
    let best: { level: string } | undefined;
    let bestRank = -1;

    for (const item of levels) {
      const r = rank.get(item.level);
      if (r === undefined) continue;
      if (r > bestRank) {
        best = item;
        bestRank = r;
      }
    }
    return best?.level || '';
  }),
}));

describe('ListGatcha Use Case', () => {
  let listGatcha: ListGatcha;

  const mockDigimonData: DetailDigimonEntity[] = [
    makeDetailDigimonEntity({
      id: 1,
      name: 'Agumon',
      levels: [{ id: 1, level: 'Child' }],
      types: [{ id: 1, type: 'Vaccine' }],
      attributes: [{ id: 1, attribute: 'Fire' }],
      descriptions: [
        { origin: 'Test', language: 'en', description: 'A small dinosaur Digimon' },
        { origin: 'Test2', language: 'en', description: 'Latest description' },
      ],
      nextEvolutions: [
        {
          id: 2,
          digimon: 'Greymon',
          condition: 'Level up',
          image: 'greymon.jpg',
          url: 'greymon-url',
        },
      ],
      level: { id: 1, level: 'Child' },
    }),
    makeDetailDigimonEntity({
      id: 2,
      name: 'Gabumon',
      levels: [{ id: 2, level: 'Adult' }],
      types: [{ id: 2, type: 'Data' }],
      attributes: [{ id: 2, attribute: 'Ice' }],
      fields: [{ id: 2, field: 'Nature Spirits', image: 'field2.jpg' }],
      descriptions: [
        { origin: 'Test', language: 'en', description: 'A fur-covered reptile Digimon' },
      ],
      nextEvolutions: [],
      level: { id: 2, level: 'Adult' },
    }),
  ];

  beforeEach(() => {
    listGatcha = new ListGatcha();
    jest.clearAllMocks();
  });

  describe('getListGacha', () => {
    it('should return transformed digimon data successfully', async () => {
      mockListGatchaImpl.getListGacha.mockResolvedValue(mockDigimonData);

      const result = await listGatcha.getListGacha('Common');

      expect(result).toHaveLength(2);

      // Check first digimon transformation
      const agumon = result[0];
      expect(agumon.id).toBe(1);
      expect(agumon.name).toBe('Agumon');
      expect(agumon.type).toBe('Vaccine');
      expect(agumon.attribute).toBe('Fire');
      expect(agumon.level).toBe('Child');
      expect(agumon.description).toBe('Latest description'); // Should use the last description
      expect(agumon.category).toBe('Rookie');
      expect(agumon.isEvolution).toBe(false);
      expect(agumon.evolution).toBe(0);
      expect(agumon.starterPack).toBe(0);
      expect(agumon.total).toBe(0);
      expect(agumon.sellingDigimon).toBe(10); // 5 base + 5 for having evolution
      expect(agumon.nextEvolutions).toHaveLength(1);

      // Check second digimon transformation
      const gabumon = result[1];
      expect(gabumon.id).toBe(2);
      expect(gabumon.name).toBe('Gabumon');
      expect(gabumon.type).toBe('Data');
      expect(gabumon.attribute).toBe('Ice');
      expect(gabumon.level).toBe('Adult');
      expect(gabumon.description).toBe('A fur-covered reptile Digimon');
      expect(gabumon.category).toBe('Champion');
      expect(gabumon.sellingDigimon).toBe(10); // 10 base, no evolution bonus
      expect(gabumon.nextEvolutions).toHaveLength(0);
    });

    it('should handle digimon with multiple types and attributes', async () => {
      const complexDigimon: DetailDigimonEntity[] = [
        makeDetailDigimonEntity({
          id: 3,
          name: 'MetalGreymon',
          images: [{ href: 'metalgreymon.jpg', transparent: false }],
          levels: [
            { id: 3, level: 'Ultimate' },
            { id: 2, level: 'Champion' },
          ],
          types: [
            { id: 3, type: 'Cyborg' },
            { id: 1, type: 'Vaccine' },
          ],
          attributes: [
            { id: 3, attribute: 'Fire' },
            { id: 1, attribute: 'Vaccine' },
          ],
          fields: [{ id: 1, field: 'Metal Empire', image: 'metal.jpg' }],
          nextEvolutions: [
            {
              id: 4,
              digimon: 'WarGreymon',
              condition: 'Special evolution',
              image: 'wargreymon.jpg',
              url: 'war-url',
            },
          ],
          level: { id: 3, level: 'Ultimate' },
        }),
      ];

      mockListGatchaImpl.getListGacha.mockResolvedValue(complexDigimon);

      const result = await listGatcha.getListGacha('Advanced');

      expect(result).toHaveLength(1);

      const metalGreymon = result[0];
      expect(metalGreymon.type).toBe('Cyborg'); // Should use highest ID type
      expect(metalGreymon.attribute).toBe('Fire'); // Should use highest ID attribute
      expect(metalGreymon.level).toBe('Ultimate'); // Should use highest ID level
      expect(metalGreymon.category).toBe('Ultimate');
      expect(metalGreymon.sellingDigimon).toBe(20); // 15 base + 5 for having evolution
    });

    it('should handle digimon with empty arrays gracefully', async () => {
      const emptyDigimon: DetailDigimonEntity[] = [
        makeDetailDigimonEntity({
          id: 4,
          name: 'EmptyDigimon',
          images: [],
          levels: [{ id: 1, level: '' }],
          types: [],
          attributes: [],
          fields: [],
          descriptions: [],
          nextEvolutions: [],
          level: { id: 1, level: 'Rookie' },
        }),
      ];

      mockListGatchaImpl.getListGacha.mockResolvedValue(emptyDigimon);

      const result = await listGatcha.getListGacha('Common');

      expect(result).toHaveLength(1);

      const emptyResult = result[0];
      expect(emptyResult.type).toBe(''); // Should handle empty types
      expect(emptyResult.attribute).toBe(''); // Should handle empty attributes
      expect(emptyResult.level).toBe(''); // Should handle empty levels
      expect(emptyResult.description).toBe(''); // Should handle empty descriptions
      expect(emptyResult.category).toBe('Unknown'); // Should handle unknown level
      expect(emptyResult.sellingDigimon).toBe(5); // Base price for unknown category
    });

    it('should call repository with correct parameter', async () => {
      mockListGatchaImpl.getListGacha.mockResolvedValue([]);

      await listGatcha.getListGacha('Rare');

      expect(mockListGatchaImpl.getListGacha).toHaveBeenCalledWith('Rare');
      expect(mockListGatchaImpl.getListGacha).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors', async () => {
      const errorMessage = 'Repository error';
      mockListGatchaImpl.getListGacha.mockRejectedValue(new Error(errorMessage));

      await expect(listGatcha.getListGacha('Common')).rejects.toThrow(errorMessage);
    });

    it('should return empty array when repository returns empty data', async () => {
      mockListGatchaImpl.getListGacha.mockResolvedValue([]);

      const result = await listGatcha.getListGacha('Common');

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle digimon with single description correctly', async () => {
      const singleDescDigimon: DetailDigimonEntity[] = [
        makeDetailDigimonEntity({
          id: 5,
          name: 'TestDigimon',
          levels: [{ id: 1, level: 'Rookie' }],
          descriptions: [{ origin: 'Single', language: 'en', description: 'Only description' }],
          level: { id: 1, level: 'Rookie' },
        }),
      ];

      mockListGatchaImpl.getListGacha.mockResolvedValue(singleDescDigimon);

      const result = await listGatcha.getListGacha('Common');

      expect(result[0].description).toBe('Only description');
    });

    it('should properly sort and select highest ID elements', async () => {
      const sortTestDigimon: DetailDigimonEntity[] = [
        makeDetailDigimonEntity({
          id: 6,
          name: 'SortTestDigimon',
          levels: [
            { id: 1, level: 'Child' },
            { id: 5, level: 'Perfect' },
            { id: 3, level: 'Ultimate' },
            { id: 2, level: 'Adult' },
          ],
          types: [
            { id: 2, type: 'Data' },
            { id: 4, type: 'Virus' },
            { id: 1, type: 'Vaccine' },
          ],
          attributes: [
            { id: 1, attribute: 'Fire' },
            { id: 3, attribute: 'Ice' },
            { id: 2, attribute: 'Earth' },
          ],
          level: { id: 5, level: 'Perfect' },
        }),
      ];

      mockListGatchaImpl.getListGacha.mockResolvedValue(sortTestDigimon);

      const result = await listGatcha.getListGacha('Rare');

      expect(result[0].level).toBe('Perfect'); // Highest by LEVEL_ORDER
      expect(result[0].type).toBe('Virus'); // Highest ID type
      expect(result[0].attribute).toBe('Ice'); // Highest ID attribute
      expect(result[0].category).toBe('Mega');
    });
  });
});
