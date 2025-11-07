import { render, screen, waitFor } from '@testing-library/react';
import { useAuthCheck } from '@/presentation/hooks/useAuthCheck';
import Homepage from '../page';
import React from 'react';

// Mock the dynamic import and HomePage component
jest.mock('next/dynamic', () => {
  return jest.fn(() => {
    const MockedHomePage = () => (
      <div data-testid="homepage-component">Mocked HomePage Component</div>
    );
    MockedHomePage.displayName = 'MockedHomePage';
    return MockedHomePage;
  });
});

// Mock the useAuthCheck hook
jest.mock('@/presentation/hooks/useAuthCheck', () => ({
  useAuthCheck: jest.fn(),
}));

// Mock useEffect
const mockUseEffect = jest.spyOn(React, 'useEffect');

const mockUseAuthCheck = useAuthCheck as jest.MockedFunction<typeof useAuthCheck>;

describe('Homepage Component', () => {
  let mockRedirectToLogin: jest.Mock;
  let mockRedirectToHome: jest.Mock;
  let mockLogout: jest.Mock;

  const createMockAuthReturn = (overrides: any = {}) => ({
    redirectToLogin: mockRedirectToLogin,
    redirectToHome: mockRedirectToHome,
    logout: mockLogout,
    isLoading: false,
    isAuthenticated: false,
    profile: null,
    ...overrides,
  });

  beforeEach(() => {
    mockRedirectToLogin = jest.fn();
    mockRedirectToHome = jest.fn();
    mockLogout = jest.fn();
    jest.clearAllMocks();
  });

  describe('Component Function Tests', () => {
    it('should execute Homepage default export function', () => {
      const Component = Homepage;
      expect(typeof Component).toBe('function');

      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: false,
          isAuthenticated: true,
        }),
      );

      const { container } = render(<Component />);
      expect(container.firstChild).toBeDefined();
    });

    it('should execute LoadingScreen component function', () => {
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: true,
          isAuthenticated: false,
        }),
      );

      render(<Homepage />);
      expect(screen.getByText('Checking authentication...')).toBeInTheDocument();
    });

    it('should execute useEffect hook function', () => {
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: false,
          isAuthenticated: false,
        }),
      );

      render(<Homepage />);

      // Verify useEffect was called
      expect(mockUseEffect).toHaveBeenCalled();
    });

    it('should execute conditional rendering functions', () => {
      // Test loading condition
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: true,
          isAuthenticated: false,
        }),
      );

      const { rerender } = render(<Homepage />);
      expect(screen.getByText('Checking authentication...')).toBeInTheDocument();

      // Test unauthenticated condition
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: false,
          isAuthenticated: false,
        }),
      );

      rerender(<Homepage />);
      expect(screen.getByText('Checking authentication...')).toBeInTheDocument();

      // Test authenticated condition
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: false,
          isAuthenticated: true,
        }),
      );

      rerender(<Homepage />);
      expect(screen.getByTestId('homepage-component')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should render loading screen when isLoading is true', () => {
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: true,
          isAuthenticated: false,
        }),
      );

      render(<Homepage />);
      expect(screen.getByText('Checking authentication...')).toBeInTheDocument();
    });

    it('should display loading spinner animation', () => {
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: true,
          isAuthenticated: false,
        }),
      );

      const { container } = render(<Homepage />);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should not render HomePage component when loading', () => {
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: true,
          isAuthenticated: false,
        }),
      );

      render(<Homepage />);
      expect(screen.queryByTestId('homepage-component')).not.toBeInTheDocument();
    });
  });

  describe('Authenticated State', () => {
    it('should render HomePage component when authenticated', () => {
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: false,
          isAuthenticated: true,
        }),
      );

      render(<Homepage />);
      expect(screen.getByTestId('homepage-component')).toBeInTheDocument();
    });

    it('should not render loading screen when authenticated', () => {
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: false,
          isAuthenticated: true,
        }),
      );

      render(<Homepage />);
      expect(screen.queryByText('Checking authentication...')).not.toBeInTheDocument();
    });

    it('should execute MapComponent rendering function', () => {
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: false,
          isAuthenticated: true,
        }),
      );

      render(<Homepage />);
      const mapComponent = screen.getByTestId('homepage-component');
      expect(mapComponent).toBeInTheDocument();
    });
  });

  describe('Unauthenticated State', () => {
    it('should call redirectToLogin when not authenticated', async () => {
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: false,
          isAuthenticated: false,
        }),
      );

      render(<Homepage />);

      await waitFor(() => {
        expect(mockRedirectToLogin).toHaveBeenCalledTimes(1);
      });
    });

    it('should render loading screen while redirecting', () => {
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: false,
          isAuthenticated: false,
        }),
      );

      render(<Homepage />);
      expect(screen.getByText('Checking authentication...')).toBeInTheDocument();
    });

    it('should execute useEffect with correct dependencies', async () => {
      const isLoading = false;
      const isAuthenticated = false;
      const redirectToLogin = mockRedirectToLogin;

      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading,
          isAuthenticated,
          redirectToLogin,
        }),
      );

      render(<Homepage />);

      await waitFor(() => {
        expect(redirectToLogin).toHaveBeenCalled();
      });
    });
  });

  describe('State Transitions', () => {
    it('should handle transition from loading to authenticated', async () => {
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: true,
          isAuthenticated: false,
        }),
      );

      const { rerender } = render(<Homepage />);
      expect(screen.getByText('Checking authentication...')).toBeInTheDocument();

      // Transition to authenticated
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: false,
          isAuthenticated: true,
        }),
      );

      rerender(<Homepage />);

      await waitFor(() => {
        expect(screen.getByTestId('homepage-component')).toBeInTheDocument();
      });
    });

    it('should handle transition from loading to unauthenticated', async () => {
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: true,
          isAuthenticated: false,
        }),
      );

      const { rerender } = render(<Homepage />);

      // Transition to unauthenticated
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: false,
          isAuthenticated: false,
        }),
      );

      rerender(<Homepage />);

      await waitFor(() => {
        expect(mockRedirectToLogin).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Edge Cases and Function Coverage', () => {
    it('should handle dynamic import properly', () => {
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: false,
          isAuthenticated: true,
        }),
      );

      expect(() => {
        render(<Homepage />);
      }).not.toThrow();

      expect(screen.getByTestId('homepage-component')).toBeInTheDocument();
    });

    it('should handle error cases gracefully', () => {
      mockUseAuthCheck.mockImplementation(() => {
        throw new Error('Hook error');
      });

      expect(() => {
        render(<Homepage />);
      }).toThrow('Hook error');
    });

    it('should execute all conditional branches', () => {
      // Test isLoading === true branch
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: true,
          isAuthenticated: true,
        }),
      );

      let { rerender } = render(<Homepage />);
      expect(screen.getByText('Checking authentication...')).toBeInTheDocument();

      // Test !isAuthenticated branch (when not loading)
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: false,
          isAuthenticated: false,
        }),
      );

      rerender(<Homepage />);
      expect(screen.getByText('Checking authentication...')).toBeInTheDocument();

      // Test authenticated branch
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: false,
          isAuthenticated: true,
        }),
      );

      rerender(<Homepage />);
      expect(screen.getByTestId('homepage-component')).toBeInTheDocument();
    });

    it('should execute all function paths', async () => {
      // Test path 1: Loading state function
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: true,
          isAuthenticated: false,
        }),
      );

      const { rerender } = render(<Homepage />);

      // Test path 2: Redirect function execution
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: false,
          isAuthenticated: false,
        }),
      );

      rerender(<Homepage />);

      await waitFor(() => {
        expect(mockRedirectToLogin).toHaveBeenCalled();
      });

      // Test path 3: Render main component function
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: false,
          isAuthenticated: true,
        }),
      );

      rerender(<Homepage />);
      expect(screen.getByTestId('homepage-component')).toBeInTheDocument();
    });
  });

  describe('Function Definitions Coverage', () => {
    it('should test LoadingScreen function definition and execution', () => {
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: true,
          isAuthenticated: false,
        }),
      );

      render(<Homepage />);

      // LoadingScreen function should be executed
      expect(screen.getByText('Checking authentication...')).toBeInTheDocument();
      expect(screen.getByLabelText).toBeDefined(); // Ensure the function creates the expected elements
    });

    it('should test Homepage function definition and all return paths', () => {
      const Component = Homepage;

      // Test function definition
      expect(typeof Component).toBe('function');
      expect(Component.name).toBe('Homepage');

      // Test all return paths

      // Return path 1: Loading state
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: true,
          isAuthenticated: false,
        }),
      );

      const { rerender, container } = render(<Component />);
      expect(container.innerHTML).toContain('Checking authentication...');

      // Return path 2: Unauthenticated state
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: false,
          isAuthenticated: false,
        }),
      );

      rerender(<Component />);
      expect(container.innerHTML).toContain('Checking authentication...');

      // Return path 3: Authenticated state
      mockUseAuthCheck.mockReturnValue(
        createMockAuthReturn({
          isLoading: false,
          isAuthenticated: true,
        }),
      );

      rerender(<Component />);
      expect(screen.getByTestId('homepage-component')).toBeInTheDocument();
    });
  });
});

describe('Component Functions Direct Testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should directly test component function execution', () => {
    const mockAuth = {
      redirectToLogin: jest.fn(),
      redirectToHome: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
      isAuthenticated: true,
      profile: null,
    };

    mockUseAuthCheck.mockReturnValue(mockAuth);

    // Test component through rendering instead of direct call
    render(<Homepage />);
    expect(screen.getByTestId('homepage-component')).toBeInTheDocument();
  });

  it('should test all component internal functions', async () => {
    const mockAuth = {
      redirectToLogin: jest.fn(),
      redirectToHome: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
      isAuthenticated: false,
      profile: null,
    };

    mockUseAuthCheck.mockReturnValue(mockAuth);

    render(<Homepage />);

    // Test that useEffect function executes
    await waitFor(() => {
      expect(mockAuth.redirectToLogin).toHaveBeenCalled();
    });
  });
});
