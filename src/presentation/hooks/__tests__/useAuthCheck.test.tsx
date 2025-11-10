import { renderHook, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useAuthCheck } from '../useAuthCheck';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

mockUseRouter.mockReturnValue({
  push: mockPush,
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
} as any);

// Mock useLocalStorage
jest.mock('../useLocalStorage');
import useLocalStorage from '../useLocalStorage';

const mockUseLocalStorage = useLocalStorage as jest.MockedFunction<typeof useLocalStorage>;

// Mock localStorage
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    removeItem: jest.fn(),
  },
  writable: true,
});

describe('useAuthCheck Hook', () => {
  const mockProfile = { id: 1, name: 'Test User', coin: 100 };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
  });

  it('should mark user as authenticated when profile is valid', () => {
    mockUseLocalStorage.mockReturnValue([mockProfile, jest.fn()]);

    const { result } = renderHook(() => useAuthCheck());

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.profile).toEqual(mockProfile);
  });

  it('should mark user as not authenticated when profile is empty', () => {
    mockUseLocalStorage.mockReturnValue([{}, jest.fn()]);

    const { result } = renderHook(() => useAuthCheck());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.profile).toBeNull();
  });

  it('should mark user as not authenticated when profile name is empty', () => {
    const invalidProfile = { id: 1, name: '', coin: 100 };
    mockUseLocalStorage.mockReturnValue([invalidProfile, jest.fn()]);

    const { result } = renderHook(() => useAuthCheck());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.profile).toBeNull();
  });

  it('should mark user as not authenticated when profile is missing required fields', () => {
    const invalidProfile = { name: 'Test User' }; // missing id and coin
    mockUseLocalStorage.mockReturnValue([invalidProfile, jest.fn()]);

    const { result } = renderHook(() => useAuthCheck());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.profile).toBeNull();
  });

  it('should redirect to login when redirectToLogin is called', () => {
    mockUseLocalStorage.mockReturnValue([{}, jest.fn()]);

    const { result } = renderHook(() => useAuthCheck());

    act(() => {
      result.current.redirectToLogin();
    });

    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('should redirect to home when redirectToHome is called', () => {
    mockUseLocalStorage.mockReturnValue([mockProfile, jest.fn()]);

    const { result } = renderHook(() => useAuthCheck());

    act(() => {
      result.current.redirectToHome();
    });

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should logout user and clear profile', () => {
    mockUseLocalStorage.mockReturnValue([mockProfile, jest.fn()]);

    const { result } = renderHook(() => useAuthCheck());

    act(() => {
      result.current.logout();
    });

    expect(localStorage.removeItem).toHaveBeenCalledWith('Profile');
    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.profile).toBeNull();
  });

  it('should handle profile with whitespace-only name as not authenticated', () => {
    const profileWithWhitespaceName = { id: 1, name: '   ', coin: 50 };
    mockUseLocalStorage.mockReturnValue([profileWithWhitespaceName, jest.fn()]);

    const { result } = renderHook(() => useAuthCheck());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.profile).toBeNull();
  });

  it('should handle null profile gracefully', () => {
    mockUseLocalStorage.mockReturnValue([null, jest.fn()]);

    const { result } = renderHook(() => useAuthCheck());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.profile).toBeNull();
  });
});
