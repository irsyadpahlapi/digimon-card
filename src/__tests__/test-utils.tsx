import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import type { DetailDigimonEntity, ListDigimonEntity } from '@/core/entities/digimon';
import type { BuyStarterpack } from '@/data/datasources/buyStarterpackDataSource';
import type { DetailDigimonRepository } from '@/core/repositories/myCardRepository';

// Custom render function that includes common providers
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  return render(ui, {
    // Add providers here if needed (like Context providers)
    ...options,
  });
};

// Mock data for testing
export const mockDigimonCard = {
  id: 1,
  name: 'Agumon',
  images: ['https://example.com/agumon.jpg'],
  type: 'Vaccine',
  attribute: 'Fire',
  level: 'Rookie',
  description: 'A small dinosaur Digimon',
  nextEvolutions: [
    {
      id: 2,
      digimon: 'Greymon',
      condition: 'Level up',
      image: 'https://example.com/greymon.jpg',
      url: 'https://example.com/greymon',
    },
  ],
  fields: [
    {
      id: 1,
      field: 'Dragon Roar',
      image: 'https://example.com/dragon-roar.jpg',
    },
  ],
  category: 'Rookie',
  evolution: 0,
  starterPack: 1,
  isEvolution: false,
  sellPrice: 5,
};

export const mockStarterPack = {
  id: 1,
  name: 'Common',
  type: 'C',
  price: 5,
  image: '/images/common.png',
  description: 'Perfect for beginners! Get 4 Rookie cards to start your collection.',
};

export const mockProfile = {
  id: 1,
  name: 'Test User',
  coin: 100,
};

// Helper to mock localStorage
export const mockLocalStorage = (data: Record<string, unknown>) => {
  const localStorageMock = {
    getItem: jest.fn((key: string) => {
      const value = data[key];
      return value === undefined ? null : JSON.stringify(value);
    }),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };

  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });

  return localStorageMock;
};

// Helper to wait for async operations
export const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Validation helpers to reduce duplication in entity tests
export function validatePropertyTypes(
  obj: Record<string, unknown>,
  expectedTypes: Record<string, string>,
) {
  for (const [key, expectedType] of Object.entries(expectedTypes)) {
    const actualValue = obj[key];
    const actualType = Array.isArray(actualValue) ? 'array' : typeof actualValue;

    expect(actualType).toBe(expectedType);
  }
}

export function validateRequiredProperties(obj: Record<string, unknown>, requiredProps: string[]) {
  for (const prop of requiredProps) {
    expect(obj).toHaveProperty(prop);
  }
}

export function validateImageStructure(images: Array<{ href: string; transparent: boolean }>) {
  for (const image of images) {
    expect(typeof image.href).toBe('string');
    expect(typeof image.transparent).toBe('boolean');
    expect(image.href.length).toBeGreaterThan(0);
  }
}

export function validateFieldStructure(
  fields: Array<{ id: number; field: string; image: string }>,
) {
  for (const field of fields) {
    expect(typeof field.id).toBe('number');
    expect(typeof field.field).toBe('string');
    expect(typeof field.image).toBe('string');
    expect(field.id).toBeGreaterThan(0);
    expect(field.field.length).toBeGreaterThan(0);
    expect(field.image.length).toBeGreaterThan(0);
  }
}

export function validateNextEvolutionStructure(
  evolutions: Array<{ id: number; digimon: string; condition: string; image: string; url: string }>,
) {
  for (const evolution of evolutions) {
    expect(typeof evolution.id).toBe('number');
    expect(typeof evolution.digimon).toBe('string');
    expect(typeof evolution.condition).toBe('string');
    expect(typeof evolution.image).toBe('string');
    expect(typeof evolution.url).toBe('string');
    expect(evolution.id).toBeGreaterThan(0);
    expect(evolution.digimon.length).toBeGreaterThan(0);
    expect(evolution.condition.length).toBeGreaterThan(0);
    expect(evolution.image.length).toBeGreaterThan(0);
    expect(evolution.url.length).toBeGreaterThan(0);
  }
}

export function validateNumericConstraints(
  obj: Record<string, number>,
  constraints: Record<string, { min?: number; isInteger?: boolean }>,
) {
  for (const [key, constraint] of Object.entries(constraints)) {
    const value = obj[key];

    if (constraint.min !== undefined) {
      expect(value).toBeGreaterThanOrEqual(constraint.min);
    }

    if (constraint.isInteger) {
      expect(Number.isInteger(value)).toBe(true);
    }
  }
}

// Test fixtures and builders to reduce duplication across tests
export function makeDetailDigimonEntity(
  overrides: Partial<DetailDigimonEntity> = {},
): DetailDigimonEntity {
  const base: DetailDigimonEntity = {
    id: 1,
    name: 'Agumon',
    images: [{ href: 'agumon.jpg', transparent: false }],
    levels: [{ id: 1, level: 'Rookie' }],
    types: [{ id: 1, type: 'Vaccine' }],
    attributes: [{ id: 1, attribute: 'Fire' }],
    fields: [{ id: 1, field: 'Wind Guardians', image: 'field.jpg' }],
    descriptions: [
      { origin: 'Digital Monster Ver. 1', language: 'en', description: 'A small dinosaur Digimon' },
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
  return { ...base, ...overrides };
}

type StarterPack = {
  id: number;
  name: string;
  type: 'C' | 'B' | 'A' | 'R';
  price: number;
  image: string;
  description: string;
};

export function makeStarterPack(overrides: Partial<StarterPack> = {}): StarterPack {
  const base: StarterPack = {
    id: 1,
    name: 'Common',
    type: 'C',
    price: 5,
    image: '/images/common.png',
    description: 'Perfect for beginners! Get 4 Rookie cards to start your collection.',
  };
  return { ...base, ...overrides } as StarterPack;
}

export const STARTER_PACKS: StarterPack[] = [
  makeStarterPack({ type: 'C', name: 'Common', price: 5, id: 1 }),
  makeStarterPack({ type: 'B', name: 'Balance', price: 10, id: 2 }),
  makeStarterPack({ type: 'A', name: 'Advanced', price: 15, id: 3 }),
  makeStarterPack({ type: 'R', name: 'Rare', price: 20, id: 4 }),
];

export function createMockBuyStarterpack(): jest.Mocked<BuyStarterpack> {
  return {
    getListDigimon: jest.fn(),
    getListChampion: jest.fn(),
    getListGacha: jest.fn(),
    getDigimonById: jest.fn(),
  } as unknown as jest.Mocked<BuyStarterpack>;
}

export function makeListDigimonEntity(
  content: Array<{ id: number; name: string; href: string; image: string }> = [
    { id: 1, name: 'Agumon', href: '/api/digimon/1', image: 'agumon.jpg' },
    { id: 2, name: 'Gabumon', href: '/api/digimon/2', image: 'gabumon.jpg' },
    { id: 3, name: 'Patamon', href: '/api/digimon/3', image: 'patamon.jpg' },
  ],
  pageable?: ListDigimonEntity['pageable'],
): ListDigimonEntity {
  const defaultPageable: ListDigimonEntity['pageable'] = {
    currentPage: 1,
    elementsOnPage: content.length,
    totalElements: 100,
    totalPages: 34,
    previousPage: '',
    nextPage: '/api/v1/digimon?level=Child&page=2',
  };

  return { content, pageable: pageable || defaultPageable };
}

export function makeRepoCard(
  overrides: Partial<DetailDigimonRepository> = {},
): DetailDigimonRepository {
  const base: DetailDigimonRepository = {
    id: 1,
    name: 'Agumon',
    images: [{ href: 'https://example.com/agumon.jpg', transparent: false }],
    type: 'Vaccine',
    attribute: 'Fire',
    level: 'Rookie',
    description: 'A small dinosaur Digimon',
    nextEvolutions: [
      {
        id: 2,
        digimon: 'Greymon',
        condition: 'Level up',
        image: 'https://example.com/greymon.jpg',
        url: 'https://example.com/greymon',
      },
    ],
    fields: [
      {
        id: 1,
        field: 'Dragon Roar',
        image: 'https://example.com/dragon-roar.jpg',
      },
    ],
    category: 'Rookie',
    evolution: 0,
    starterPack: 1,
    isEvolution: false,
    total: 1,
    sellingDigimon: 5,
  };
  return { ...base, ...overrides };
}

// Helper to create a standard set of repository cards for myCard tests
export function makeRepoCardSet(): DetailDigimonRepository[] {
  return [
    makeRepoCard({
      id: 1,
      name: 'Agumon',
      images: [{ href: 'agumon.jpg', transparent: false }],
      level: 'Rookie',
      type: 'Vaccine',
      attribute: 'Fire',
      fields: [],
      description: 'A small dinosaur Digimon',
      nextEvolutions: [],
      isEvolution: false,
      evolution: 0,
      starterPack: 6,
      total: 1,
      category: 'Rookie',
      sellingDigimon: 5,
    }),
    makeRepoCard({
      id: 2,
      name: 'Gabumon',
      images: [{ href: 'gabumon.jpg', transparent: false }],
      level: 'Rookie',
      type: 'Data',
      attribute: 'Ice',
      fields: [],
      description: 'A reptile Digimon with blue fur',
      nextEvolutions: [],
      isEvolution: false,
      evolution: 0,
      starterPack: 6,
      total: 1,
      category: 'Rookie',
      sellingDigimon: 5,
    }),
    makeRepoCard({
      id: 3,
      name: 'Greymon',
      images: [{ href: 'greymon.jpg', transparent: false }],
      level: 'Champion',
      type: 'Vaccine',
      attribute: 'Fire',
      fields: [],
      description: 'A large dinosaur Digimon',
      nextEvolutions: [],
      isEvolution: false,
      evolution: 0,
      starterPack: 6,
      total: 1,
      category: 'Champion',
      sellingDigimon: 10,
    }),
  ];
}

// Helper to apply starterPack+1 logic (used in myCard usecase)
export function adjustStarterPack(cards: DetailDigimonRepository[]): DetailDigimonRepository[] {
  return cards.map((card) => ({
    ...card,
    starterPack: card.isEvolution ? card.starterPack : card.starterPack + 1,
  }));
}

// Helper to apply reverse and starterPack+1 logic (used in myCard usecase getListMyCard)
export function adjustStarterPackAndReverse(
  cards: DetailDigimonRepository[],
): DetailDigimonRepository[] {
  return adjustStarterPack(cards).reverse();
}

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Test to make sure this file is valid
describe('Test Utils', () => {
  it('should export render function', () => {
    expect(customRender).toBeDefined();
  });

  it('should provide mock data objects', () => {
    expect(mockDigimonCard).toBeDefined();
    expect(mockStarterPack).toBeDefined();
    expect(mockProfile).toBeDefined();
  });
});
