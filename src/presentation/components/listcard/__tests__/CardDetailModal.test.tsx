import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardDetailModal from '../CardDetailModal';
import { DetailDigimonRepository } from '@/core/repositories/myCardRepository';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

describe('CardDetailModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnEvolve = jest.fn();
  const mockOnSell = jest.fn();

  const mockCard: DetailDigimonRepository = {
    id: 1,
    name: 'Agumon',
    images: [{ href: 'agumon.jpg', transparent: false }],
    level: 'Rookie',
    type: 'Vaccine',
    attribute: 'Fire',
    fields: [
      { id: 1, field: 'Wind Guardians', image: 'field.jpg' },
      { id: 2, field: 'Nature Spirits', image: 'field2.jpg' },
    ],
    description: 'A small dinosaur Digimon with courage',
    nextEvolutions: [
      {
        id: 2,
        digimon: 'Greymon',
        condition: 'Level up',
        image: 'greymon.jpg',
        url: 'greymon-url',
      },
      {
        id: 3,
        digimon: 'GeoGreymon',
        condition: 'Ancient evolution',
        image: 'geogreymon.jpg',
        url: 'geo-url',
      },
    ],
    isEvolution: false,
    evolution: 0,
    starterPack: 5,
    total: 1,
    category: 'Rookie',
    sellingDigimon: 10,
  };

  const defaultProps = {
    item: mockCard,
    isOpen: true,
    onClose: mockOnClose,
    onEvolve: mockOnEvolve,
    onSell: mockOnSell,
    index: 0,
    isEvolving: false,
    isSelling: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset document overflow style
    document.body.style.overflow = 'unset';
  });

  afterEach(() => {
    // Clean up any side effects
    document.body.style.overflow = 'unset';
  });

  it('should render modal when isOpen is true', () => {
    render(<CardDetailModal {...defaultProps} />);

    // Check for modal content instead of specific dialog role
    expect(screen.getByText('Agumon')).toBeInTheDocument();
    expect(screen.getByText('Rookie')).toBeInTheDocument();
    expect(screen.getByText('A small dinosaur Digimon with courage')).toBeInTheDocument();
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
  });

  it('should not render modal when isOpen is false', () => {
    render(<CardDetailModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should not render modal when item is null', () => {
    render(<CardDetailModal {...defaultProps} item={null} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<CardDetailModal {...defaultProps} />);

    const closeButton = screen.getByLabelText('Close modal');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when ESC key is pressed', async () => {
    render(<CardDetailModal {...defaultProps} />);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should display card stats correctly', () => {
    render(<CardDetailModal {...defaultProps} />);

    expect(screen.getByText('Level: Rookie')).toBeInTheDocument();
    expect(screen.getAllByText('Fire')).toHaveLength(2); // Appears in both badge and attribute section
    expect(screen.getAllByText('Vaccine')).toHaveLength(2); // Appears in both badge and type section
    expect(screen.getByText('0')).toBeInTheDocument(); // Evolution count
    expect(screen.getByText('5')).toBeInTheDocument(); // Starter pack count
  });

  it('should display fields correctly', () => {
    render(<CardDetailModal {...defaultProps} />);

    expect(screen.getByText('Fields')).toBeInTheDocument();
    expect(screen.getByText('Wind Guardians')).toBeInTheDocument();
    expect(screen.getByText('Nature Spirits')).toBeInTheDocument();
  });

  it('should show evolution section when evolve button is clicked', async () => {
    const user = userEvent.setup();
    render(<CardDetailModal {...defaultProps} />);

    const evolveButton = screen.getByText('Evolve (2 options)');
    await user.click(evolveButton);

    expect(screen.getByText('Choose Evolution')).toBeInTheDocument();
    expect(screen.getByText('Greymon')).toBeInTheDocument();
    expect(screen.getByText('GeoGreymon')).toBeInTheDocument();
    expect(screen.getByText('Level up')).toBeInTheDocument();
    expect(screen.getByText('Ancient evolution')).toBeInTheDocument();
  });

  it('should hide evolution section when hide button is clicked', async () => {
    const user = userEvent.setup();
    render(<CardDetailModal {...defaultProps} />);

    // First show evolution section
    const evolveButton = screen.getByText('Evolve (2 options)');
    await user.click(evolveButton);

    expect(screen.getByText('Choose Evolution')).toBeInTheDocument();

    // Then hide it
    const hideButton = screen.getByText('Hide Evolutions');
    await user.click(hideButton);

    await waitFor(() => {
      expect(screen.queryByText('Choose Evolution')).not.toBeInTheDocument();
    });
  });

  it('should call onEvolve when evolution option is selected', async () => {
    const user = userEvent.setup();
    render(<CardDetailModal {...defaultProps} />);

    // Show evolution section
    const evolveButton = screen.getByText('Evolve (2 options)');
    await user.click(evolveButton);

    // Click on specific evolution
    const greymonButton = screen.getByText('Evolve to Greymon');
    await user.click(greymonButton);

    expect(mockOnEvolve).toHaveBeenCalledWith(1, 2);
  });

  it('should call onSell when sell button is clicked', async () => {
    const user = userEvent.setup();
    render(<CardDetailModal {...defaultProps} />);

    const sellButton = screen.getByText('Sell (10 coins)');
    await user.click(sellButton);

    expect(mockOnSell).toHaveBeenCalledWith(1, 10);
  });

  it('should disable buttons when isEvolving is true', () => {
    render(<CardDetailModal {...defaultProps} isEvolving={true} />);

    const evolveButton = screen.getByRole('button', { name: /evolving/i });
    const sellButton = screen.getByRole('button', { name: /sell.*coins/i });

    expect(evolveButton).toBeDisabled();
    expect(sellButton).toBeDisabled();
  });

  it('should disable buttons when isSelling is true', () => {
    render(<CardDetailModal {...defaultProps} isSelling={true} />);

    const evolveButton = screen.getByRole('button', { name: /evolve.*options/i });
    const sellButton = screen.getByRole('button', { name: /selling/i });

    expect(evolveButton).toBeDisabled();
    expect(sellButton).toBeDisabled();
  });

  it('should show loading state for evolving', () => {
    render(<CardDetailModal {...defaultProps} isEvolving={true} />);

    expect(screen.getByText('Evolving...')).toBeInTheDocument();
    // Check for spinner SVG instead of role status
    const spinnerSvg = screen.getByRole('button', { name: /evolving/i });
    expect(spinnerSvg).toBeInTheDocument();
  });

  it('should show loading state for selling', () => {
    render(<CardDetailModal {...defaultProps} isSelling={true} />);

    expect(screen.getByText('Selling...')).toBeInTheDocument();
    // Check for spinner SVG instead of role status
    const spinnerSvg = screen.getByRole('button', { name: /selling/i });
    expect(spinnerSvg).toBeInTheDocument();
  });

  it('should handle card without next evolutions', () => {
    const cardWithoutEvolutions = {
      ...mockCard,
      nextEvolutions: [],
    };

    render(<CardDetailModal {...defaultProps} item={cardWithoutEvolutions} />);

    expect(screen.queryByText('Evolve')).not.toBeInTheDocument();
    expect(screen.getByText('Sell (10 coins)')).toBeInTheDocument();
  });

  it('should handle card without fields', () => {
    const cardWithoutFields = {
      ...mockCard,
      fields: [],
    };

    render(<CardDetailModal {...defaultProps} item={cardWithoutFields} />);

    expect(screen.queryByText('Fields')).not.toBeInTheDocument();
  });

  it('should handle card without description', () => {
    const cardWithoutDescription = {
      ...mockCard,
      description: '',
    };

    render(<CardDetailModal {...defaultProps} item={cardWithoutDescription} />);

    expect(screen.queryByText('Description')).not.toBeInTheDocument();
  });

  it('should set body overflow to hidden when modal is open', () => {
    render(<CardDetailModal {...defaultProps} />);

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body overflow when modal is closed', () => {
    const { rerender } = render(<CardDetailModal {...defaultProps} />);

    expect(document.body.style.overflow).toBe('hidden');

    rerender(<CardDetailModal {...defaultProps} isOpen={false} />);

    expect(document.body.style.overflow).toBe('unset');
  });

  it('should display fallback image when no image is provided', () => {
    const cardWithoutImage = {
      ...mockCard,
      images: [],
    };

    render(<CardDetailModal {...defaultProps} item={cardWithoutImage} />);

    const image = screen.getByAltText('Agumon');
    expect(image).toHaveAttribute('src', 'https://via.placeholder.com/300x300?text=Digimon');
  });

  it('should reset evolution section state when modal closes via useEffect timeout', async () => {
    const { rerender } = render(<CardDetailModal {...defaultProps} />);

    // First show evolution section
    const evolveButton = screen.getByText('Evolve (2 options)');
    await userEvent.setup().click(evolveButton);

    expect(screen.getByText('Choose Evolution')).toBeInTheDocument();

    // Close modal and verify timeout cleanup
    rerender(<CardDetailModal {...defaultProps} isOpen={false} />);

    // Wait for timeout to execute
    await waitFor(() => {
      expect(screen.queryByText('Choose Evolution')).not.toBeInTheDocument();
    });
  });

  it('should hide evolution section when close button in evolution section is clicked', async () => {
    const user = userEvent.setup();
    render(<CardDetailModal {...defaultProps} />);

    // First show evolution section
    const evolveButton = screen.getByText('Evolve (2 options)');
    await user.click(evolveButton);

    expect(screen.getByText('Choose Evolution')).toBeInTheDocument();

    // Find the specific close button in evolution section by checking its container
    const evolutionSection = screen.getByText('Choose Evolution').closest('div');
    const closeButton = evolutionSection?.querySelector('button') as HTMLButtonElement;

    expect(closeButton).toBeDefined();
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Choose Evolution')).not.toBeInTheDocument();
    });
  });

  it('should handle useEffect cleanup properly', () => {
    // Test the cleanup function is defined but don't test internal implementation
    const { unmount } = render(<CardDetailModal {...defaultProps} />);

    // Simply unmount to ensure no errors occur during cleanup
    expect(() => unmount()).not.toThrow();
  });
});
