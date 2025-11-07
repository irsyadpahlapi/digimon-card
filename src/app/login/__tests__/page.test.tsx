import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
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
    it('should render the login page correctly', () => {
      render(<LoginPage />);

      expect(screen.getByText('DigiCard')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /enter the digital world/i })).toBeInTheDocument();
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
      expect(screen.getByText('DigiCard')).toBeInTheDocument();
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
      const button = screen.getByRole('button', { name: /enter the digital world/i });

      await user.type(input, 'testuser');
      await user.click(button);

      expect(screen.getByText('Logging in...')).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    it('should not submit with empty username', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const button = screen.getByRole('button', { name: /enter the digital world/i });
      await user.click(button);

      expect(mockSetProfile).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should trim whitespace from username', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(<LoginPage />);

      const input = screen.getByPlaceholderText('Enter your username');
      const button = screen.getByRole('button', { name: /enter the digital world/i });

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

  describe('Component Functionality', () => {
    it('should redirect to home after successful login', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(<LoginPage />);

      const input = screen.getByPlaceholderText('Enter your username');
      const button = screen.getByRole('button', { name: /enter the digital world/i });

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
      const button = screen.getByRole('button', { name: /enter the digital world/i });

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
      const button = screen.getByRole('button', { name: /enter the digital world/i });

      await user.type(input, 'testuser');
      await user.click(button);

      expect(input).toBeDisabled();
      expect(button).toBeDisabled();
    });
  });
});
