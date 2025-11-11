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
    it.each([
      { digimonLevel: 'Child', expectedCategory: 'Rookie', expectedPrice: 5 },
      { digimonLevel: 'Perfect', expectedCategory: 'Mega', expectedPrice: 30 },
    ])(
      'should map %s -> %s and price %d with evolution',
      ({ digimonLevel, expectedCategory, expectedPrice }) => {
        const category = Category(digimonLevel);
        const price = sellingDigimonPrice(category, true);
        expect(category).toBe(expectedCategory);
        expect(price).toBe(expectedPrice);
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

    type Case = {
      name: string;
      list: Array<{ id: number; name: string }>;
      order?: string[];
      expected: { id: number; name: string } | undefined;
    };

    const CASES: Case[] = [
      { name: 'highest is Perfect', list: dataResponse, expected: { id: 3, name: 'Perfect' } },
      {
        name: 'Ultimate when Perfect missing',
        list: dataResponse.filter((i) => i.name !== 'Perfect'),
        expected: { id: 6, name: 'Ultimate' },
      },
      {
        name: 'Child when only low-priority',
        list: [
          { id: 1, name: 'Baby II' },
          { id: 4, name: 'Child' },
          { id: 5, name: 'Baby I' },
        ],
        expected: { id: 4, name: 'Child' },
      },
      {
        name: 'undefined when no items match',
        list: [
          { id: 1, name: 'Baby II' },
          { id: 5, name: 'Baby I' },
        ],
        expected: undefined,
      },
      { name: 'undefined for empty', list: [], expected: undefined },
      {
        name: 'custom order respected',
        list: dataResponse,
        order: ['Adult', 'Child', 'Perfect'],
        expected: { id: 3, name: 'Perfect' },
      },
    ];

    it.each(CASES)('%s', ({ list, order, expected }) => {
      const result = pickHighestByOrder(list, order);
      expect(result).toEqual(expected);
    });
  });

  describe('highestLevelFromLevels function', () => {
    const CASES: Array<[string, Array<{ level: string; id: number }>, string]> = [
      [
        'returns highest known level',
        [
          { level: 'Child', id: 1 },
          { level: 'Adult', id: 2 },
          { level: 'Ultimate', id: 3 },
        ],
        'Ultimate',
      ],
      [
        'returns Perfect when present',
        [
          { level: 'Adult', id: 1 },
          { level: 'Perfect', id: 2 },
          { level: 'Child', id: 3 },
        ],
        'Perfect',
      ],
      [
        'skips unknown levels and returns highest known',
        [
          { level: 'Baby I', id: 1 },
          { level: 'Child', id: 2 },
          { level: 'Baby II', id: 3 },
        ],
        'Child',
      ],
      ['returns empty for empty array', [], ''],
      [
        'returns empty when no levels match order',
        [
          { level: 'Baby I', id: 1 },
          { level: 'Baby II', id: 2 },
        ],
        '',
      ],
    ];

    it.each(CASES)('%s', (_name, levels, expected) => {
      const result = highestLevelFromLevels(levels);
      expect(result).toBe(expected);
    });
  });

  describe('pickHighestLevelObject function', () => {
    it.each<
      [string, Array<{ id: number; name: string }>, { id: number; name: string } | undefined]
    >([
      [
        'returns highest object by order',
        [
          { id: 1, name: 'Child' },
          { id: 2, name: 'Adult' },
          { id: 3, name: 'Perfect' },
        ],
        { id: 3, name: 'Perfect' },
      ],
      ['returns undefined for empty array', [], undefined],
    ])('%s', (_name, data, expected) => {
      const result = pickHighestLevelObject(data);
      expect(result).toEqual(expected);
    });
  });
});
