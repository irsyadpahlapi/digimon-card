import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

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

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });

  return localStorageMock;
};

// Helper to wait for async operations
export const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
