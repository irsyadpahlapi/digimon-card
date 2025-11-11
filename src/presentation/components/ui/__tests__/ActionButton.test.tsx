import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ActionButton from '../ActionButton';

// Mock LoadingSpinner
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
        Spinner
      </div>
    );
  };
});

describe('ActionButton Component', () => {
  const defaultProps = {
    children: 'Click me',
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render button with children', () => {
      render(<ActionButton {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click me');
    });

    it('should apply base classes', () => {
      render(<ActionButton {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'font-bold',
        'rounded-lg',
        'shadow-lg',
        'transition-all',
        'duration-200',
        'focus:outline-none',
        'focus:ring-2',
        'flex',
        'items-center',
        'justify-center',
        'gap-2',
      );
    });
  });

  describe('Button Types', () => {
    it('should render with button type by default', () => {
      render(<ActionButton {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should render with submit type', () => {
      render(<ActionButton {...defaultProps} type="submit" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should render with reset type', () => {
      render(<ActionButton {...defaultProps} type="reset" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'reset');
    });
  });

  describe('Variants', () => {
    it('should apply primary variant styles (default)', () => {
      render(<ActionButton {...defaultProps} variant="primary" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'bg-gradient-to-r',
        'from-yellow-500',
        'via-orange-500',
        'to-amber-500',
        'text-white',
        'hover:from-yellow-600',
        'hover:via-orange-600',
        'hover:to-amber-600',
        'hover:shadow-xl',
        'focus:ring-orange-500/50',
      );
    });

    it('should apply secondary variant styles', () => {
      render(<ActionButton {...defaultProps} variant="secondary" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'bg-gray-500',
        'text-white',
        'hover:bg-gray-600',
        'hover:shadow-xl',
        'focus:ring-gray-500/50',
      );
    });

    it('should apply success variant styles', () => {
      render(<ActionButton {...defaultProps} variant="success" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'bg-gradient-to-r',
        'from-green-500',
        'to-emerald-600',
        'text-white',
        'hover:shadow-lg',
        'transform',
        'hover:scale-105',
        'focus:ring-green-500/50',
      );
    });

    it('should apply warning variant styles', () => {
      render(<ActionButton {...defaultProps} variant="warning" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'bg-gradient-to-r',
        'from-[#f1ba63]',
        'to-[#fbf39b]',
        'text-[#643c30]',
        'hover:shadow-xl',
        'transform',
        'hover:scale-105',
        'focus:ring-yellow-500/50',
      );
    });

    it('should apply danger variant styles', () => {
      render(<ActionButton {...defaultProps} variant="danger" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'bg-red-500',
        'text-white',
        'hover:bg-red-600',
        'hover:shadow-xl',
        'focus:ring-red-500/50',
      );
    });
  });

  describe('Sizes', () => {
    it('should apply small size styles', () => {
      render(<ActionButton {...defaultProps} size="sm" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('py-2', 'px-4', 'text-sm');
    });

    it('should apply medium size styles (default)', () => {
      render(<ActionButton {...defaultProps} size="md" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('py-3.5', 'px-6', 'text-base');
    });

    it('should apply large size styles', () => {
      render(<ActionButton {...defaultProps} size="lg" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('py-4', 'px-8', 'text-lg');
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when isLoading is true', () => {
      render(<ActionButton {...defaultProps} isLoading />);

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should show custom loading text', () => {
      render(<ActionButton {...defaultProps} isLoading loadingText="Saving..." />);

      expect(screen.getByText('Saving...')).toBeInTheDocument();
      expect(screen.queryByText('Click me')).not.toBeInTheDocument();
    });

    it('should render LoadingSpinner with correct props', () => {
      render(<ActionButton {...defaultProps} isLoading />);

      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveAttribute('data-size', 'sm');
      expect(spinner).toHaveAttribute('data-color', 'white');
    });

    it('should not show children when loading', () => {
      render(<ActionButton {...defaultProps} isLoading />);

      expect(screen.queryByText('Click me')).not.toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<ActionButton {...defaultProps} disabled />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('should be disabled when isLoading is true', () => {
      render(<ActionButton {...defaultProps} isLoading />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('should be disabled when both disabled and isLoading are true', () => {
      render(<ActionButton {...defaultProps} disabled isLoading />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('User Interactions', () => {
    it('should call onClick when clicked', async () => {
      const mockOnClick = jest.fn();
      const user = userEvent.setup();

      render(<ActionButton {...defaultProps} onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const mockOnClick = jest.fn();
      const user = userEvent.setup();

      render(<ActionButton {...defaultProps} onClick={mockOnClick} disabled />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', async () => {
      const mockOnClick = jest.fn();
      const user = userEvent.setup();

      render(<ActionButton {...defaultProps} onClick={mockOnClick} isLoading />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should handle keyboard events', async () => {
      const mockOnClick = jest.fn();
      const user = userEvent.setup();

      render(<ActionButton {...defaultProps} onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      render(<ActionButton {...defaultProps} className="custom-class" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should maintain base classes with custom className', () => {
      render(<ActionButton {...defaultProps} className="w-full my-4" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('font-bold', 'rounded-lg', 'shadow-lg', 'w-full', 'my-4');
    });
  });

  describe('Children Handling', () => {
    it('should render React element children', () => {
      render(
        <ActionButton {...defaultProps}>
          <span data-testid="child-element">Custom Element</span>
        </ActionButton>,
      );

      expect(screen.getByTestId('child-element')).toBeInTheDocument();
      expect(screen.getByText('Custom Element')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <ActionButton {...defaultProps}>
          <span>Text</span>
          <svg data-testid="icon">Icon</svg>
        </ActionButton>,
      );

      expect(screen.getByText('Text')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });

  describe('Form Integration', () => {
    it('should work correctly in form context', async () => {
      const mockSubmit = jest.fn();
      const user = userEvent.setup();

      render(
        <form onSubmit={mockSubmit}>
          <ActionButton type="submit">Submit Form</ActionButton>
        </form>,
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockSubmit).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper focus management', async () => {
      const user = userEvent.setup();
      render(<ActionButton {...defaultProps} />);

      const button = screen.getByRole('button');

      await user.tab();
      expect(button).toHaveFocus();
    });

    it('should maintain accessibility when disabled', () => {
      render(<ActionButton {...defaultProps} disabled />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('disabled');
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle all props together correctly', () => {
      const mockOnClick = jest.fn();

      render(
        <ActionButton
          onClick={mockOnClick}
          type="submit"
          variant="success"
          size="lg"
          isLoading={false}
          disabled={false}
          className="w-full"
          loadingText="Processing..."
        >
          <span>Submit Data</span>
        </ActionButton>,
      );

      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveClass(
        // Success variant classes
        'bg-gradient-to-r',
        'from-green-500',
        'to-emerald-600',
        // Large size classes
        'py-4',
        'px-8',
        'text-lg',
        // Custom class
        'w-full',
      );
      expect(button).not.toBeDisabled();
      expect(screen.getByText('Submit Data')).toBeInTheDocument();
    });

    it('should handle state transitions correctly', () => {
      const { rerender } = render(<ActionButton {...defaultProps} isLoading={false} />);

      expect(screen.getByText('Click me')).toBeInTheDocument();
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();

      rerender(<ActionButton {...defaultProps} isLoading />);

      expect(screen.queryByText('Click me')).not.toBeInTheDocument();
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
});
