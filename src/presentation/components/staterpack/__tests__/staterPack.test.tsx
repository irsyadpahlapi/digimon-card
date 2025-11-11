import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import StarterPack from '../staterPack';
import { makeStarterPack, STARTER_PACKS } from '@/__tests__/test-utils';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock ActionButton component
jest.mock('@/presentation/components/ui/ActionButton', () => {
  return function MockActionButton({
    children,
    onClick,
    disabled,
    isLoading,
    variant,
    size,
    ...props
  }: any) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        data-loading={isLoading}
        data-variant={variant}
        data-size={size}
        {...props}
      >
        {isLoading ? 'Loading...' : children}
      </button>
    );
  };
});

const mockStarterPack = makeStarterPack();

describe('StarterPack Component', () => {
  const mockOnBuy = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    item: mockStarterPack,
    onBuy: mockOnBuy,
    isLoading: false,
  };

  describe('Component Function Coverage', () => {
    it('should execute main StarterPack component function', () => {
      const { container } = render(<StarterPack {...defaultProps} />);

      expect(container.firstChild).toBeDefined();
      expect(screen.getByText('Common Pack')).toBeInTheDocument();
    });

    it('should execute handleBuyClick function', async () => {
      const user = userEvent.setup();
      render(<StarterPack {...defaultProps} />);

      const buyButton = screen.getByText('Buy Now');
      await user.click(buyButton);

      expect(mockOnBuy).toHaveBeenCalledWith(mockStarterPack);
    });

    it('should use ActionButton with correct props', () => {
      render(<StarterPack {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'success');
      expect(button).toHaveAttribute('data-size', 'lg');
      expect(button).toHaveAttribute('data-loading', 'false');
    });

    it('should execute component function with different prop combinations', () => {
      // Test all possible function paths
      const { rerender } = render(<StarterPack {...defaultProps} />);
      expect(screen.getByText('Buy Now')).toBeInTheDocument();

      rerender(<StarterPack {...defaultProps} isLoading={true} />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveAttribute('data-loading', 'true');

      rerender(<StarterPack item={mockStarterPack} />);
      expect(screen.getByText('Buy Now')).toBeInTheDocument();
    });
  });

  describe('Rendering Tests', () => {
    it('should render starter pack information correctly', () => {
      render(<StarterPack {...defaultProps} />);

      expect(screen.getByText('Common Pack')).toBeInTheDocument();
      expect(
        screen.getByText('Perfect for beginners! Get 4 Rookie cards to start your collection.'),
      ).toBeInTheDocument();
      expect(screen.getByText('C')).toBeInTheDocument(); // Type badge
      expect(screen.getByText('5')).toBeInTheDocument(); // Price
      expect(screen.getByText('Buy Now')).toBeInTheDocument();
    });

    it('should display correct pack contents for Common pack (type C)', () => {
      render(<StarterPack {...defaultProps} />);

      expect(screen.getByText('4 Rookie Cards')).toBeInTheDocument();
      expect(screen.getByText('1 Champion Card')).toBeInTheDocument();
    });

    it('should display correct pack contents for Balance pack (type B)', () => {
      const balancePack = makeStarterPack({ type: 'B', name: 'Balance', price: 10 });

      render(<StarterPack item={balancePack} onBuy={mockOnBuy} />);

      expect(screen.getByText('2 Rookie Cards')).toBeInTheDocument();
      expect(screen.getByText('2 Champion Cards')).toBeInTheDocument();
      expect(screen.getByText('1 Ultimate Card')).toBeInTheDocument();
    });

    it('should display correct pack contents for Advanced pack (type A)', () => {
      const advancedPack = makeStarterPack({ type: 'A', name: 'Advanced', price: 15 });

      render(<StarterPack item={advancedPack} onBuy={mockOnBuy} />);

      expect(screen.getByText('1 Rookie Card')).toBeInTheDocument();
      expect(screen.getByText('2 Champion Cards')).toBeInTheDocument();
      expect(screen.getByText('2 Ultimate Cards')).toBeInTheDocument();
    });

    it('should display correct pack contents for Rare pack (type R)', () => {
      const rarePack = makeStarterPack({ type: 'R', name: 'Rare', price: 20 });

      render(<StarterPack item={rarePack} onBuy={mockOnBuy} />);

      expect(screen.getByText('1 Champion Card')).toBeInTheDocument();
      expect(screen.getByText('3 Ultimate Cards')).toBeInTheDocument();
      expect(screen.getByText('1 Mega Card')).toBeInTheDocument();
    });
  });

  describe('ActionButton Integration', () => {
    it('should call onBuy when ActionButton is clicked', async () => {
      const user = userEvent.setup();
      render(<StarterPack {...defaultProps} />);

      const buyButton = screen.getByText('Buy Now');
      await user.click(buyButton);

      expect(mockOnBuy).toHaveBeenCalledWith(mockStarterPack);
      expect(mockOnBuy).toHaveBeenCalledTimes(1);
    });

    it('should show loading state when isLoading is true', () => {
      render(<StarterPack {...defaultProps} isLoading={true} />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Buy Now')).not.toBeInTheDocument();

      const buyButton = screen.getByRole('button');
      expect(buyButton).toBeDisabled();
      expect(buyButton).toHaveAttribute('data-loading', 'true');
    });

    it('should not call onBuy when button is disabled (loading)', async () => {
      const user = userEvent.setup();
      render(<StarterPack {...defaultProps} isLoading={true} />);

      const buyButton = screen.getByRole('button');
      await user.click(buyButton);

      expect(mockOnBuy).not.toHaveBeenCalled();
    });

    it('should pass correct props to ActionButton', () => {
      render(<StarterPack {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'success');
      expect(button).toHaveAttribute('data-size', 'lg');
      expect(button).toHaveAttribute('data-loading', 'false');
      expect(button).not.toBeDisabled();
    });

    it('should pass loading state to ActionButton', () => {
      render(<StarterPack {...defaultProps} isLoading={true} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-loading', 'true');
      expect(button).toBeDisabled();
    });
  });

  describe('Image Rendering', () => {
    it('should render image with correct src and alt', () => {
      render(<StarterPack {...defaultProps} />);

      const image = screen.getByAltText('Common');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/images/common.png');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing onBuy prop gracefully', async () => {
      const user = userEvent.setup();
      render(<StarterPack item={mockStarterPack} />);

      const buyButton = screen.getByText('Buy Now');

      // Should not throw error when onBuy is undefined
      await user.click(buyButton);

      expect(buyButton).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility attributes', () => {
      render(<StarterPack {...defaultProps} />);

      const buyButton = screen.getByRole('button', { name: /buy now/i });
      expect(buyButton).toBeInTheDocument();

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Common');
    });
  });

  describe('Component Integration', () => {
    it('should call handleBuyClick function when button is clicked', async () => {
      const user = userEvent.setup();
      render(<StarterPack {...defaultProps} />);

      const buyButton = screen.getByText('Buy Now');
      await user.click(buyButton);

      // Verify that the internal handleBuyClick function executed correctly
      expect(mockOnBuy).toHaveBeenCalledWith(mockStarterPack);
      expect(mockOnBuy).toHaveBeenCalledTimes(1);
    });

    it('should execute handleBuyClick function internally without onBuy prop', async () => {
      const user = userEvent.setup();
      const { container } = render(<StarterPack item={mockStarterPack} />);

      const buyButton = screen.getByText('Buy Now');

      // Should not throw error even without onBuy prop
      await user.click(buyButton);

      expect(container).toBeInTheDocument();
    });

    it('should render and execute component function properly', () => {
      // Test the main component function execution
      const { container } = render(<StarterPack {...defaultProps} />);

      expect(container.firstChild).toBeDefined();
      expect(screen.getByText('Common Pack')).toBeInTheDocument();
    });

    it('should execute component function with all props', () => {
      // Test component function with different prop combinations
      const { rerender } = render(<StarterPack {...defaultProps} />);

      expect(screen.getByText('Buy Now')).toBeInTheDocument();

      // Test with loading state
      rerender(<StarterPack {...defaultProps} isLoading={true} />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Test without onBuy prop
      rerender(<StarterPack item={mockStarterPack} />);
      expect(screen.getByText('Buy Now')).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('should handle different pack types correctly', () => {
      const testPacks = STARTER_PACKS;

      for (const pack of testPacks) {
        const { rerender } = render(<StarterPack item={pack} onBuy={mockOnBuy} />);
        expect(screen.getByText(`${pack.name} Pack`)).toBeInTheDocument();
        expect(screen.getByText(pack.type)).toBeInTheDocument();
        rerender(<div />); // Clear for next render
      }
    });

    it('should handle loading state transitions', () => {
      const { rerender } = render(<StarterPack {...defaultProps} />);

      // Initially not loading
      expect(screen.getByText('Buy Now')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveAttribute('data-loading', 'false');

      // Transition to loading
      rerender(<StarterPack {...defaultProps} isLoading={true} />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveAttribute('data-loading', 'true');

      // Back to not loading
      rerender(<StarterPack {...defaultProps} isLoading={false} />);
      expect(screen.getByText('Buy Now')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveAttribute('data-loading', 'false');
    });
  });
});
