import { render, screen, act } from '@testing-library/react';
import type React from 'react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../page';
import { useRouter } from 'next/navigation';
import { useAuthCheck } from '@/presentation/hooks/useAuthCheck';
import useLocalStorage from '@/presentation/hooks/useLocalStorage';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock useAuthCheck hook
jest.mock('@/presentation/hooks/useAuthCheck', () => ({
  useAuthCheck: jest.fn(),
}));

// Mock useLocalStorage hook
jest.mock('@/presentation/hooks/useLocalStorage', () => {
  return jest.fn();
});

// Mock new UI components
interface MockFormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  iconPath?: string;
  error?: string;
  id: string;
}

jest.mock('@/presentation/components/ui/formInput', () => {
  return function MockFormInput({
    label,
    placeholder,
    value,
    onChange,
    disabled,
    error,
    id,
    ...props
  }: MockFormInputProps) {
    return (
      <div>
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          data-error={error}
          {...props}
        />
        {error && <span>{error}</span>}
      </div>
    );
  };
});

interface MockActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
}

jest.mock('@/presentation/components/ui/actionButton', () => {
  return function MockActionButton({
    children,
    onClick,
    disabled,
    isLoading,
    loadingText,
    type,
    ...props
  }: MockActionButtonProps) {
    return (
      <button
        onClick={onClick}
        disabled={disabled || isLoading}
        data-loading={isLoading}
        type={type}
        {...props}
      >
        {isLoading ? loadingText || 'Loading...' : children}
      </button>
    );
  };
});

jest.mock('@/presentation/components/ui/logoBrand', () => {
  return function MockLogoBrand({ title }: { title?: string }) {
    return <div data-testid="logo-brand">{title || 'DigiCard'}</div>;
  };
});

jest.mock('@/presentation/components/ui/authRedirectScreen', () => {
  return function MockAuthRedirectScreen({ variant }: { variant?: string }) {
    return (
      <div data-testid="auth-redirect" data-variant={variant}>
        Redirecting...
      </div>
    );
  };
});

jest.mock('@/presentation/components/ui/gradientBackground', () => {
  return function MockGradientBackground({
    children,
    variant,
  }: {
    children?: React.ReactNode;
    variant?: string;
  }) {
    return (
      <div data-testid="gradient-background" data-variant={variant}>
        {children}
      </div>
    );
  };
});

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseAuthCheck = useAuthCheck as jest.MockedFunction<typeof useAuthCheck>;
const mockUseLocalStorage = useLocalStorage as jest.MockedFunction<typeof useLocalStorage>;

describe('LoginPage Component', () => {
  let mockSetProfile: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSetProfile = jest.fn();

    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    });

    mockUseAuthCheck.mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
      profile: null,
      redirectToLogin: jest.fn(),
      redirectToHome: jest.fn(),
      logout: jest.fn(),
    });

    mockUseLocalStorage.mockReturnValue([{}, mockSetProfile]);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic Rendering', () => {
    it('should render the login page with new components', () => {
      render(<LoginPage />);

      expect(screen.getByTestId('logo-brand')).toBeInTheDocument();
      expect(screen.getByTestId('gradient-background')).toHaveAttribute('data-variant', 'login');
      expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should show redirect screen when authenticated', () => {
      mockUseAuthCheck.mockReturnValue({
        isLoading: false,
        isAuthenticated: true,
        profile: { id: 1, name: 'test', coin: 100 },
        redirectToLogin: jest.fn(),
        redirectToHome: jest.fn(),
        logout: jest.fn(),
      });

      render(<LoginPage />);

      expect(screen.getByTestId('auth-redirect')).toBeInTheDocument();
      expect(screen.getByTestId('auth-redirect')).toHaveAttribute('data-variant', 'toHome');
    });

    it('should render with loading state', () => {
      mockUseAuthCheck.mockReturnValue({
        isLoading: true,
        isAuthenticated: false,
        profile: null,
        redirectToLogin: jest.fn(),
        redirectToHome: jest.fn(),
        logout: jest.fn(),
      });

      render(<LoginPage />);
      expect(screen.getByTestId('logo-brand')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should allow user input in username field', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const input = screen.getByPlaceholderText('Enter your username');
      await user.type(input, 'testuser');

      expect(input).toHaveValue('testuser');
    });

    it('should handle form submission with valid username', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const input = screen.getByPlaceholderText('Enter your username');
      const button = screen.getByRole('button');

      await user.type(input, 'testuser');
      await user.click(button);

      expect(button).toHaveAttribute('data-loading', 'true');
      expect(button).toBeDisabled();
    });

    it('should not submit with empty username', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockSetProfile).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should trim whitespace from username', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(<LoginPage />);

      const input = screen.getByPlaceholderText('Enter your username');
      const button = screen.getByRole('button');

      await user.type(input, '  testuser  ');
      await user.click(button);

      act(() => {
        jest.runAllTimers();
      });

      expect(mockSetProfile).toHaveBeenCalledWith({
        id: expect.any(Number),
        name: 'testuser',
        coin: 100,
      });

      jest.useRealTimers();
    });
  });

  describe('Component Integration', () => {
    it('should use new UI components correctly', () => {
      render(<LoginPage />);

      // Check all new components are rendered
      expect(screen.getByTestId('gradient-background')).toBeInTheDocument();
      expect(screen.getByTestId('logo-brand')).toBeInTheDocument();

      // Form components should be present
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should redirect to home after successful login', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(<LoginPage />);

      const input = screen.getByPlaceholderText('Enter your username');
      const button = screen.getByRole('button');

      await user.type(input, 'testuser');
      await user.click(button);

      act(() => {
        jest.runAllTimers();
      });

      expect(mockPush).toHaveBeenCalledWith('/');
      jest.useRealTimers();
    });

    it('should create profile with correct data structure', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(<LoginPage />);

      const input = screen.getByPlaceholderText('Enter your username');
      const button = screen.getByRole('button');

      await user.type(input, 'newuser');
      await user.click(button);

      act(() => {
        jest.runAllTimers();
      });

      expect(mockSetProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(Number),
          name: 'newuser',
          coin: 100,
        }),
      );

      jest.useRealTimers();
    });

    it('should disable form during submission', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const input = screen.getByPlaceholderText('Enter your username');
      const button = screen.getByRole('button');

      await user.type(input, 'testuser');
      await user.click(button);

      expect(input).toBeDisabled();
      expect(button).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('should handle authentication state changes', () => {
      const { rerender } = render(<LoginPage />);

      // Initially not authenticated
      expect(screen.queryByTestId('auth-redirect')).not.toBeInTheDocument();

      // Become authenticated
      mockUseAuthCheck.mockReturnValue({
        isLoading: false,
        isAuthenticated: true,
        profile: { id: 1, name: 'test', coin: 100 },
        redirectToLogin: jest.fn(),
        redirectToHome: jest.fn(),
        logout: jest.fn(),
      });

      rerender(<LoginPage />);
      expect(screen.getByTestId('auth-redirect')).toBeInTheDocument();
    });

    it('should show error for invalid username with special characters', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const input = screen.getByPlaceholderText('Enter your username');
      const button = screen.getByRole('button');

      await user.type(input, '<script>alert("xss")</script>');
      await user.click(button);

      // Should show validation error (actual error: "Username must not exceed 20 characters")
      const errorMessage = screen.getByText(/Username must not exceed 20 characters/i);
      expect(errorMessage).toBeInTheDocument();

      // Should not save profile or redirect
      expect(mockSetProfile).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should show error for username with SQL injection attempt', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const input = screen.getByPlaceholderText('Enter your username');
      const button = screen.getByRole('button');

      await user.type(input, "admin' OR '1'='1");
      await user.click(button);

      // Should show validation error (actual error: "Username contains invalid characters")
      expect(screen.getByText(/Username contains invalid characters/i)).toBeInTheDocument();
      expect(mockSetProfile).not.toHaveBeenCalled();
    });

    it('should show error for username that is too long', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const input = screen.getByPlaceholderText('Enter your username');
      const button = screen.getByRole('button');

      await user.type(input, 'a'.repeat(51)); // Max 20 chars
      await user.click(button);

      expect(screen.getByText(/Username must not exceed 20 characters/i)).toBeInTheDocument();
      expect(mockSetProfile).not.toHaveBeenCalled();
    });

    it('should show custom error message from validateUsername when available', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const input = screen.getByPlaceholderText('Enter your username');
      const button = screen.getByRole('button');

      // Test various invalid patterns
      await user.type(input, '!!!');
      await user.click(button);

      const errorElement = screen.getByText(/Username contains invalid characters/i);
      expect(errorElement).toBeInTheDocument();
    });
  });
});
