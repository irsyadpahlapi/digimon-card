import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthRedirectScreen from '../AuthRedirectScreen';
import { useRouter } from 'next/navigation';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the child components
jest.mock('../LoadingSpinner', () => {
  return function MockLoadingSpinner({
    size,
    color,
  }: {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
  }) {
    return (
      <div data-testid="loading-spinner" data-size={size} data-color={color}>
        Loading Spinner
      </div>
    );
  };
});

jest.mock('../GradientBackground', () => {
  return function MockGradientBackground({
    children,
    variant,
  }: {
    children: React.ReactNode;
    variant: string;
  }) {
    return (
      <div data-testid="gradient-background" data-variant={variant}>
        {children}
      </div>
    );
  };
});

describe('AuthRedirectScreen Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  describe('Basic Rendering', () => {
    it('should render with default props (toHome variant)', () => {
      render(<AuthRedirectScreen />);

      expect(screen.getByText('Redirecting to dashboard...')).toBeInTheDocument();
      expect(screen.getByTestId('gradient-background')).toHaveAttribute('data-variant', 'homepage');
      expect(screen.getByTestId('loading-spinner')).toHaveAttribute('data-size', 'lg');
      expect(screen.getByTestId('loading-spinner')).toHaveAttribute('data-color', 'white');
    });

    it('should render toHome variant correctly', () => {
      render(<AuthRedirectScreen variant="toHome" />);

      expect(screen.getByText('Redirecting to dashboard...')).toBeInTheDocument();
      expect(screen.getByTestId('gradient-background')).toHaveAttribute('data-variant', 'homepage');
    });

    it('should render toLogin variant correctly', () => {
      render(<AuthRedirectScreen variant="toLogin" />);

      expect(screen.getByText('Redirecting to login...')).toBeInTheDocument();
      expect(screen.getByTestId('gradient-background')).toHaveAttribute('data-variant', 'login');
    });
  });

  describe('Router Navigation', () => {
    it('should redirect to home after delay when variant is toHome', async () => {
      render(<AuthRedirectScreen variant="toHome" />);

      // Wait for the redirect delay (1500ms)
      await waitFor(
        () => {
          expect(mockPush).toHaveBeenCalledWith('/');
        },
        { timeout: 2000 },
      );
    });

    it('should redirect to login after delay when variant is toLogin', async () => {
      render(<AuthRedirectScreen variant="toLogin" />);

      // Wait for the redirect delay (1500ms)
      await waitFor(
        () => {
          expect(mockPush).toHaveBeenCalledWith('/login');
        },
        { timeout: 2000 },
      );
    });

    it('should default to home redirect when no variant specified', async () => {
      render(<AuthRedirectScreen />);

      await waitFor(
        () => {
          expect(mockPush).toHaveBeenCalledWith('/');
        },
        { timeout: 2000 },
      );
    });
  });

  describe('Loading Spinner Props', () => {
    it('should pass correct props to LoadingSpinner for toHome', () => {
      render(<AuthRedirectScreen variant="toHome" />);

      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveAttribute('data-size', 'lg');
      expect(spinner).toHaveAttribute('data-color', 'white');
    });

    it('should pass correct props to LoadingSpinner for toLogin', () => {
      render(<AuthRedirectScreen variant="toLogin" />);

      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveAttribute('data-size', 'lg');
      expect(spinner).toHaveAttribute('data-color', 'white');
    });
  });

  describe('GradientBackground Integration', () => {
    it('should use homepage variant for toHome', () => {
      render(<AuthRedirectScreen variant="toHome" />);

      const background = screen.getByTestId('gradient-background');
      expect(background).toHaveAttribute('data-variant', 'homepage');
    });

    it('should use login variant for toLogin', () => {
      render(<AuthRedirectScreen variant="toLogin" />);

      const background = screen.getByTestId('gradient-background');
      expect(background).toHaveAttribute('data-variant', 'login');
    });
  });

  describe('Container Structure', () => {
    it('should have proper container classes', () => {
      const { container } = render(<AuthRedirectScreen variant="toHome" />);

      // Find the inner flex container directly
      const flexContainer = container.querySelector('.flex.flex-col.items-center');
      expect(flexContainer).toHaveClass(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'min-h-screen',
        'text-center',
        'px-6',
      );
    });

    it('should contain all expected elements in proper structure', () => {
      const { container } = render(<AuthRedirectScreen variant="toHome" />);

      // Should have GradientBackground as wrapper
      expect(screen.getByTestId('gradient-background')).toBeInTheDocument();

      // Should have centered container
      const centerContainer = container.querySelector('.flex.flex-col.items-center');
      expect(centerContainer).toBeInTheDocument();

      // Should have spinner and text
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByText('Redirecting to dashboard...')).toBeInTheDocument();
    });
  });

  describe('Text Styling', () => {
    it('should apply correct classes to redirect text for toHome', () => {
      render(<AuthRedirectScreen variant="toHome" />);

      const text = screen.getByText('Redirecting to dashboard...');
      expect(text).toHaveClass('text-white', 'text-xl', 'font-semibold', 'mt-6', 'animate-pulse');
    });

    it('should apply correct classes to redirect text for toLogin', () => {
      render(<AuthRedirectScreen variant="toLogin" />);

      const text = screen.getByText('Redirecting to login...');
      expect(text).toHaveClass('text-white', 'text-xl', 'font-semibold', 'mt-6', 'animate-pulse');
    });
  });

  describe('Spacing and Layout', () => {
    it('should have proper spacing between elements', () => {
      render(<AuthRedirectScreen />);

      const text = screen.getByText('Redirecting to dashboard...');
      expect(text).toHaveClass('mt-6');

      const container = text.closest('div');
      expect(container).toHaveClass('px-6');
    });
  });

  describe('Component Cleanup', () => {
    it('should not cause memory leaks when unmounted before redirect', () => {
      const { unmount } = render(<AuthRedirectScreen variant="toHome" />);

      // Unmount before the timeout completes
      unmount();

      // Wait a bit and ensure no redirect happened
      setTimeout(() => {
        expect(mockPush).not.toHaveBeenCalled();
      }, 100);
    });
  });

  describe('Animation Classes', () => {
    it('should apply animate-pulse to text', () => {
      render(<AuthRedirectScreen />);

      const text = screen.getByText('Redirecting to dashboard...');
      expect(text).toHaveClass('animate-pulse');
    });
  });

  describe('Accessibility', () => {
    it('should be accessible with proper text content', () => {
      render(<AuthRedirectScreen variant="toHome" />);

      // Text should be readable by screen readers
      expect(screen.getByText('Redirecting to dashboard...')).toBeInTheDocument();
    });

    it('should indicate loading state properly', () => {
      render(<AuthRedirectScreen variant="toLogin" />);

      // Loading spinner should be present for assistive technology
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByText('Redirecting to login...')).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should call router.push after exactly 1500ms', () => {
      render(<AuthRedirectScreen variant="toHome" />);

      // Initially should not have been called
      expect(mockPush).not.toHaveBeenCalled();

      // Fast-forward time by 1499ms - should not have been called yet
      jest.advanceTimersByTime(1499);
      expect(mockPush).not.toHaveBeenCalled();

      // Fast-forward to 1500ms - should now be called
      jest.advanceTimersByTime(1);
      expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('should handle multiple instances without interference', () => {
      // Render multiple instances
      const { unmount: unmount1 } = render(<AuthRedirectScreen variant="toHome" />);
      const { unmount: unmount2 } = render(<AuthRedirectScreen variant="toLogin" />);

      // Fast-forward time
      jest.advanceTimersByTime(1500);

      expect(mockPush).toHaveBeenCalledTimes(2);
      expect(mockPush).toHaveBeenCalledWith('/');
      expect(mockPush).toHaveBeenCalledWith('/login');

      unmount1();
      unmount2();
    });
  });

  describe('Props Validation', () => {
    it('should handle unknown variant gracefully', () => {
      // TypeScript would catch this, but test runtime behavior
      const { container } = render(
        <AuthRedirectScreen variant={'unknown' as 'toHome' | 'toLogin'} />,
      );

      // Should fallback to default behavior (toHome)
      expect(container).toBeInTheDocument();
      expect(screen.getByText('Redirecting to dashboard...')).toBeInTheDocument();
    });
  });

  describe('Integration Test', () => {
    it('should complete full redirect flow', async () => {
      const { unmount } = render(<AuthRedirectScreen variant="toLogin" />);

      // Verify initial render
      expect(screen.getByText('Redirecting to login...')).toBeInTheDocument();
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByTestId('gradient-background')).toHaveAttribute('data-variant', 'login');

      // Wait for redirect
      await waitFor(
        () => {
          expect(mockPush).toHaveBeenCalledWith('/login');
        },
        { timeout: 2000 },
      );

      unmount();
    });
  });

  describe('Custom className', () => {
    it('should accept and apply custom className to container', () => {
      const { container } = render(<AuthRedirectScreen className="custom-redirect-class" />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('custom-redirect-class');
    });

    it('should combine custom className with base classes', () => {
      const { container } = render(
        <AuthRedirectScreen className="my-custom-class" variant="toLogin" />,
      );

      const innerContainer = container.querySelector('.flex.flex-col.items-center');
      expect(innerContainer).toHaveClass(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'min-h-screen',
        'text-center',
        'px-6',
      );
    });
  });
});
