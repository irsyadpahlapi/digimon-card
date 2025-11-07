import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import StarterPack from '../staterPack';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

const mockStarterPack = {
  id: 1,
  name: 'Common',
  type: 'C',
  price: 5,
  image: '/images/common.png',
  description: 'Perfect for beginners! Get 4 Rookie cards to start your collection.',
};

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

    it('should execute component function with different prop combinations', () => {
      // Test all possible function paths
      const { rerender } = render(<StarterPack {...defaultProps} />);
      expect(screen.getByText('Buy Now')).toBeInTheDocument();

      rerender(<StarterPack {...defaultProps} isLoading={true} />);
      expect(screen.getByText('Buying...')).toBeInTheDocument();

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
  });

  it('should display correct pack contents for Common pack (type C)', () => {
    render(<StarterPack {...defaultProps} />);

    expect(screen.getByText('4 Rookie Cards')).toBeInTheDocument();
    expect(screen.getByText('1 Champion Card')).toBeInTheDocument();
  });

  it('should display correct pack contents for Balance pack (type B)', () => {
    const balancePack = {
      ...mockStarterPack,
      type: 'B',
      name: 'Balance',
    };

    render(<StarterPack item={balancePack} onBuy={mockOnBuy} />);

    expect(screen.getByText('2 Rookie Cards')).toBeInTheDocument();
    expect(screen.getByText('2 Champion Cards')).toBeInTheDocument();
    expect(screen.getByText('1 Ultimate Card')).toBeInTheDocument();
  });

  it('should display correct pack contents for Advanced pack (type A)', () => {
    const advancedPack = {
      ...mockStarterPack,
      type: 'A',
      name: 'Advanced',
    };

    render(<StarterPack item={advancedPack} onBuy={mockOnBuy} />);

    expect(screen.getByText('1 Rookie Card')).toBeInTheDocument();
    expect(screen.getByText('2 Champion Cards')).toBeInTheDocument();
    expect(screen.getByText('2 Ultimate Cards')).toBeInTheDocument();
  });

  it('should display correct pack contents for Rare pack (type R)', () => {
    const rarePack = {
      ...mockStarterPack,
      type: 'R',
      name: 'Rare',
    };

    render(<StarterPack item={rarePack} onBuy={mockOnBuy} />);

    expect(screen.getByText('1 Champion Card')).toBeInTheDocument();
    expect(screen.getByText('3 Ultimate Cards')).toBeInTheDocument();
    expect(screen.getByText('1 Mega Card')).toBeInTheDocument();
  });

  it('should call onBuy when Buy Now button is clicked', async () => {
    const user = userEvent.setup();
    render(<StarterPack {...defaultProps} />);

    const buyButton = screen.getByText('Buy Now');
    await user.click(buyButton);

    expect(mockOnBuy).toHaveBeenCalledWith(mockStarterPack);
    expect(mockOnBuy).toHaveBeenCalledTimes(1);
  });

  it('should show loading state when isLoading is true', () => {
    render(<StarterPack {...defaultProps} isLoading={true} />);

    expect(screen.getByText('Buying...')).toBeInTheDocument();
    expect(screen.queryByText('Buy Now')).not.toBeInTheDocument();

    const buyButton = screen.getByRole('button');
    expect(buyButton).toBeDisabled();
    expect(buyButton).toHaveClass('bg-gray-400', 'cursor-not-allowed');
  });

  it('should not call onBuy when button is disabled (loading)', async () => {
    const user = userEvent.setup();
    render(<StarterPack {...defaultProps} isLoading={true} />);

    const buyButton = screen.getByRole('button');
    await user.click(buyButton);

    expect(mockOnBuy).not.toHaveBeenCalled();
  });

  it('should render image with correct src and alt', () => {
    render(<StarterPack {...defaultProps} />);

    const image = screen.getByAltText('Common');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/common.png');
  });

  it('should handle missing onBuy prop gracefully', async () => {
    const user = userEvent.setup();
    render(<StarterPack item={mockStarterPack} />);

    const buyButton = screen.getByText('Buy Now');

    // Should not throw error when onBuy is undefined
    await user.click(buyButton);

    expect(buyButton).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<StarterPack {...defaultProps} />);

    const buyButton = screen.getByRole('button', { name: /buy now/i });
    expect(buyButton).toHaveAttribute('type', 'button');

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', 'Common');
  });

  it('should show loading spinner when loading', () => {
    render(<StarterPack {...defaultProps} isLoading={true} />);

    // Check for SVG spinner (by checking for specific SVG elements)
    const spinner = screen.getByRole('button').querySelector('svg');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
  });

  it('should apply mobile-friendly classes for touch', () => {
    render(<StarterPack {...defaultProps} />);

    const buyButton = screen.getByRole('button');
    expect(buyButton).toHaveClass('touch-manipulation', 'min-h-[48px]', 'select-none');
  });

  it('should have proper button styling for different states', () => {
    const { rerender } = render(<StarterPack {...defaultProps} />);

    // Normal state
    let buyButton = screen.getByRole('button');
    expect(buyButton).toHaveClass('bg-gradient-to-r', 'from-[#443c70]', 'to-[#a76050]');

    // Loading state
    rerender(<StarterPack {...defaultProps} isLoading={true} />);
    buyButton = screen.getByRole('button');
    expect(buyButton).toHaveClass('bg-gray-400', 'cursor-not-allowed');
  });

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

  it('should test handleBuyClick function execution directly', () => {
    // Create a mock function to test the handleBuyClick logic
    const testOnBuy = jest.fn();

    render(<StarterPack {...defaultProps} onBuy={testOnBuy} />);

    const buyButton = screen.getByText('Buy Now');

    // Simulate the handleBuyClick function call
    buyButton.click();

    expect(testOnBuy).toHaveBeenCalledWith(mockStarterPack);
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
    expect(screen.getByText('Buying...')).toBeInTheDocument();

    // Test without onBuy prop
    rerender(<StarterPack item={mockStarterPack} />);
    expect(screen.getByText('Buy Now')).toBeInTheDocument();
  });
});
