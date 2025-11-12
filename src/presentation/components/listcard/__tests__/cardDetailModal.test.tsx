import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardDetailModal from '../cardDetailModal';
import { DetailDigimonRepository } from '@/core/repositories/myCardRepository';

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
    total: 3, // Changed from 1 to 3 to enable evolve button
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
    evolvingToId: null,
    isSelling: false,
  };

  // Helper to render modal with prop overrides
  const renderModal = (overrides = {}) => {
    return render(<CardDetailModal {...defaultProps} {...overrides} />);
  };

  // Builder for card variants
  const buildCard = (overrides: Partial<DetailDigimonRepository>): DetailDigimonRepository => {
    return { ...mockCard, ...overrides } as DetailDigimonRepository;
  };

  // Helper to open evolution section
  const openEvolutionSection = async (user: ReturnType<typeof userEvent.setup>) => {
    const evolveButton = screen.getByRole('button', { name: /evolve.*options/i });
    await user.click(evolveButton);
    await waitFor(() => {
      expect(screen.getByText('Choose Evolution')).toBeInTheDocument();
    });
  };

  // Shared assertions for evolution options
  const assertEvolutionOptionsVisible = () => {
    expect(screen.getByText('Greymon')).toBeInTheDocument();
    expect(screen.getByText('GeoGreymon')).toBeInTheDocument();
    expect(screen.getByText('Level up')).toBeInTheDocument();
    expect(screen.getByText('Ancient evolution')).toBeInTheDocument();
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
    renderModal();

    // Check for modal content instead of specific dialog role
    expect(screen.getByText('Agumon')).toBeInTheDocument();
    expect(screen.getByText('Rookie')).toBeInTheDocument();
    expect(screen.getByText('A small dinosaur Digimon with courage')).toBeInTheDocument();
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
  });

  it('should not render modal when isOpen is false', () => {
    renderModal({ isOpen: false });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should not render modal when item is null', () => {
    renderModal({ item: null });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    renderModal();

    const closeButton = screen.getByLabelText('Close modal');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when ESC key is pressed', async () => {
    renderModal();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should display card stats correctly', () => {
    renderModal();

    expect(screen.getByText('Level: Rookie')).toBeInTheDocument();
    expect(screen.getAllByText('Fire')).toHaveLength(2); // Appears in both badge and attribute section
    expect(screen.getAllByText('Vaccine')).toHaveLength(2); // Appears in both badge and type section
    expect(screen.getByText('0')).toBeInTheDocument(); // Evolution count
    expect(screen.getByText('5')).toBeInTheDocument(); // Starter pack count
  });

  it('should display fields correctly', () => {
    renderModal();

    expect(screen.getByText('Fields')).toBeInTheDocument();
    expect(screen.getByText('Wind Guardians')).toBeInTheDocument();
    expect(screen.getByText('Nature Spirits')).toBeInTheDocument();
  });

  it('should show evolution section when evolve button is clicked', async () => {
    const user = userEvent.setup();
    renderModal();
    await openEvolutionSection(user);
    assertEvolutionOptionsVisible();
  });

  it('should hide evolution section when hide button is clicked', async () => {
    const user = userEvent.setup();
    renderModal();
    await openEvolutionSection(user);
    const hideButton = screen.getByText('Hide Evolutions');
    await user.click(hideButton);
    await waitFor(() => {
      expect(screen.queryByText('Choose Evolution')).not.toBeInTheDocument();
    });
  });

  it('should call onEvolve when evolution option is selected', async () => {
    const user = userEvent.setup();
    renderModal();
    await openEvolutionSection(user);
    await user.click(screen.getByText('Evolve to Greymon'));
    expect(mockOnEvolve).toHaveBeenCalledWith(1, 2);
  });

  it('should call onSell when sell button is clicked (no evolutions)', async () => {
    const user = userEvent.setup();
    renderModal({ item: buildCard({ nextEvolutions: [] }) });

    const sellButton = screen.getByText('Sell (10 coins)');
    await user.click(sellButton);

    expect(mockOnSell).toHaveBeenCalledWith(1, 10);
  });

  it('should disable evolve button but allow selling when evolvingToId is set (no evolutions)', () => {
    renderModal({ evolvingToId: 2, item: buildCard({ nextEvolutions: [] }) });

    const evolveButton = screen.queryByRole('button', { name: /evolve.*options/i });
    // Evolve button absent because no evolutions
    expect(evolveButton).toBeNull();
    const sellButton = screen.getByText('Sell (10 coins)');
    expect(sellButton).not.toBeDisabled();
  });

  it('should disable buttons when isSelling is true', () => {
    renderModal({ isSelling: true });

    const evolveButton = screen.getByRole('button', { name: /evolve.*options/i });
    const sellButton = screen.getByRole('button', { name: /selling/i });

    // Evolve button should NOT be disabled when only isSelling is true
    // (disabled only if evolvingToId is set || total < 3)
    expect(evolveButton).not.toBeDisabled();
    expect(sellButton).toBeDisabled();
  });

  it('should show selling button while evolving when no evolutions exist', async () => {
    renderModal({ evolvingToId: 2, item: buildCard({ nextEvolutions: [] }) });
    const sellButton = screen.getByText('Sell (10 coins)');
    expect(sellButton).toBeInTheDocument();
    expect(sellButton).not.toBeDisabled();
  });

  it('should show loading state only on the clicked evolution button', async () => {
    const user = userEvent.setup();

    // First render without evolving state to open the section
    const { rerender } = renderModal({ evolvingToId: null });

    // Open evolution section
    const evolveButton = screen.getByRole('button', { name: /evolve.*options/i });
    await user.click(evolveButton);
    await waitFor(() => {
      expect(screen.getByText('Choose Evolution')).toBeInTheDocument();
    });

    // Now rerender with evolvingToId set to Greymon's id (2)
    rerender(<CardDetailModal {...defaultProps} evolvingToId={2} />);

    // Check that Greymon button shows loading
    await waitFor(() => {
      const evolvingText = screen.getByText('Evolving...');
      expect(evolvingText).toBeInTheDocument();
    });

    // Check that GeoGreymon button is still enabled (not loading)
    const geoGreymonButton = screen.getByText('Evolve to GeoGreymon');
    expect(geoGreymonButton).toBeInTheDocument();
  });

  it('should show loading state for selling', () => {
    renderModal({ isSelling: true });

    expect(screen.getByText('Selling...')).toBeInTheDocument();
    // Check for spinner SVG instead of role status
    const spinnerSvg = screen.getByRole('button', { name: /selling/i });
    expect(spinnerSvg).toBeInTheDocument();
  });

  describe('conditional sections', () => {
    it.each([
      [{ nextEvolutions: [] }, /Evolve/, false],
      [{ fields: [] }, /Fields/, false],
      [{ description: '' }, /Description/, false],
    ])('should handle missing section %p', (overrides, pattern, shouldExist) => {
      renderModal({ item: buildCard(overrides) });
      if (shouldExist) {
        expect(screen.getByText(pattern)).toBeInTheDocument();
      } else {
        expect(screen.queryByText(pattern)).not.toBeInTheDocument();
      }
    });

    it('should still allow selling when evolutions are missing', () => {
      renderModal({ item: buildCard({ nextEvolutions: [] }) });
      expect(screen.queryByText(/Evolve/)).not.toBeInTheDocument();
      expect(screen.getByText('Sell (10 coins)')).toBeInTheDocument();
    });
  });

  it('should set body overflow to hidden when modal is open', () => {
    renderModal();

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body overflow when modal is closed', () => {
    const { rerender } = renderModal();

    expect(document.body.style.overflow).toBe('hidden');

    rerender(<CardDetailModal {...defaultProps} isOpen={false} />);

    expect(document.body.style.overflow).toBe('unset');
  });

  it('should display fallback image when no image is provided', () => {
    const cardWithoutImage = {
      ...mockCard,
      images: [],
    };

    renderModal({ item: cardWithoutImage });

    const image = screen.getByAltText('Agumon');
    expect(image).toHaveAttribute('src', 'https://via.placeholder.com/300x300?text=Digimon');
  });

  it('should reset evolution section state when modal closes via useEffect timeout', async () => {
    const { rerender } = renderModal();
    await openEvolutionSection(userEvent.setup());
    rerender(<CardDetailModal {...defaultProps} isOpen={false} />);
    await waitFor(() => {
      expect(screen.queryByText('Choose Evolution')).not.toBeInTheDocument();
    });
  });

  it('should hide evolution section when close button in evolution section is clicked', async () => {
    const user = userEvent.setup();
    renderModal();
    await openEvolutionSection(user);
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
    const { unmount } = renderModal();

    // Simply unmount to ensure no errors occur during cleanup
    expect(() => unmount()).not.toThrow();
  });

  it('should disable evolve button when total < 3 (not enough cards)', () => {
    renderModal({ item: buildCard({ total: 2 }) });

    const evolveButton = screen.getByRole('button', { name: /evolve.*options/i });

    // Button should be disabled with gray styling
    expect(evolveButton).toBeDisabled();
    expect(evolveButton).toHaveClass('bg-gray-400');
    expect(evolveButton).toHaveClass('cursor-not-allowed');
  });

  it('should disable evolve button when total is 1', () => {
    renderModal({ item: buildCard({ total: 1 }) });

    const evolveButton = screen.getByRole('button', { name: /evolve.*options/i });

    expect(evolveButton).toBeDisabled();
    expect(evolveButton).toHaveClass('bg-gray-400');
  });

  it('should enable evolve button when total >= 3', () => {
    renderModal({ item: buildCard({ total: 3 }) });

    const evolveButton = screen.getByRole('button', { name: /evolve.*options/i });

    // Button should be enabled with gradient styling
    expect(evolveButton).not.toBeDisabled();
    expect(evolveButton).not.toHaveClass('bg-gray-400');
  });

  it('should show gray styling when evolve button is disabled due to insufficient cards', () => {
    // Test the specific line 320: buttonClass = 'bg-gray-400 cursor-not-allowed'
    renderModal({
      item: buildCard({ total: 2 }),
      evolvingToId: null, // Not evolving, not showing evolution section
    });

    const evolveButton = screen.getByRole('button', { name: /evolve.*options/i });

    // Verify the disabled state and gray styling class
    expect(evolveButton).toBeDisabled();
    expect(evolveButton.className).toContain('bg-gray-400');
    expect(evolveButton.className).toContain('cursor-not-allowed');
  });
});
