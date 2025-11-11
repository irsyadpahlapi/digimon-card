import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import type { DetailDigimonEntity } from '@/core/entities/digimon';
import type { BuyStarterpack } from '@/data/datasources/buyStarterpackDataSource';

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
export const mockLocalStorage = (data: Record<string, any>) => {
  const localStorageMock = {
    getItem: jest.fn((key: string) => {
      return data[key] ? JSON.stringify(data[key]) : null;
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
