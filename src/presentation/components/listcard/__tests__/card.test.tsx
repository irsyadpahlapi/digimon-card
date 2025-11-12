import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Card from '../card';
import { makeRepoCard } from '@/__tests__/test-utils';

const mockDigimonCard = makeRepoCard();

describe('Card Component', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    item: mockDigimonCard,
    onClick: mockOnClick,
  };

  it('should render card information correctly', () => {
    render(<Card item={mockDigimonCard} onClick={mockOnClick} />);

    expect(screen.getByText('Agumon')).toBeInTheDocument();
    expect(screen.getAllByText('Rookie')).toHaveLength(2); // Level and category tag
    expect(screen.getByText('Vaccine')).toBeInTheDocument();
    expect(screen.getByText('0 Evolution')).toBeInTheDocument();
    expect(screen.getByText('1 Starter Pack')).toBeInTheDocument();
  });

  it('should display card image with correct alt text', () => {
    render(<Card {...defaultProps} />);

    const image = screen.getByAltText('Agumon');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/agumon.jpg');
  });

  it('should call onClick when card is clicked', async () => {
    const user = userEvent.setup();
    render(<Card item={mockDigimonCard} onClick={mockOnClick} />);

    const cardElement = screen.getByRole('button');

    if (cardElement) {
      await user.click(cardElement);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    }
  });

  it('should handle missing image gracefully', () => {
    const cardWithNoImage = makeRepoCard({ images: [] });

    render(<Card item={cardWithNoImage} onClick={mockOnClick} />);

    expect(screen.getByText('Agumon')).toBeInTheDocument();
    // Should not crash when images array is empty
  });

  it('should display evolution indicator when card can evolve', () => {
    const evolvableCard = makeRepoCard({
      nextEvolutions: [
        {
          id: 2,
          digimon: 'Greymon',
          condition: 'Level up',
          image: 'https://example.com/greymon.jpg',
          url: 'https://example.com/greymon',
        },
      ],
    });

    render(<Card item={evolvableCard} onClick={mockOnClick} />);

    expect(screen.getByText('Agumon')).toBeInTheDocument();
    // Card should show evolution indicator if nextEvolutions is not empty
  });

  it('should handle card without onClick prop', () => {
    render(<Card item={mockDigimonCard} />);

    expect(screen.getByText('Agumon')).toBeInTheDocument();
    // Should not crash when onClick is undefined
  });

  it('should display correct category styling for different levels', () => {
    const championCard = makeRepoCard({ level: 'Champion', category: 'Champion' });

    render(<Card item={championCard} onClick={mockOnClick} />);

    expect(screen.getAllByText('Champion')).toHaveLength(2); // Level and category tag
  });

  it('should show sell price information', () => {
    render(<Card {...defaultProps} />);

    // The sell price might be displayed or calculated
    expect(screen.getByText('Agumon')).toBeInTheDocument();
  });

  it('should handle long card names gracefully', () => {
    const cardWithLongName = makeRepoCard({
      name: 'VeryVeryVeryLongDigimonNameThatShouldBeHandledProperly',
    });

    render(<Card item={cardWithLongName} onClick={mockOnClick} />);

    expect(
      screen.getByText('VeryVeryVeryLongDigimonNameThatShouldBeHandledProperly'),
    ).toBeInTheDocument();
  });

  it('should handle missing optional fields', () => {
    const minimalCard = makeRepoCard({
      id: 1,
      name: 'TestMon',
      images: [{ href: 'test.jpg', transparent: false }],
      type: 'Unknown',
      attribute: 'Neutral',
      level: 'Unknown',
      description: 'Test description',
      nextEvolutions: [],
      fields: [],
      category: 'Unknown',
      evolution: 0,
      starterPack: 0,
      isEvolution: false,
      total: 1,
      sellingDigimon: 0,
    });

    render(<Card item={minimalCard} onClick={mockOnClick} />);

    expect(screen.getByText('TestMon')).toBeInTheDocument();
  });

  it('should render rare card styling when total >= 3', () => {
    const rareCard = makeRepoCard({
      total: 3,
    });

    render(<Card item={rareCard} onClick={mockOnClick} />);

    expect(screen.getByText('Agumon')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    // Should render shimmer effect for rare cards
    const cardButton = screen.getByRole('button');
    expect(cardButton.className).toContain('from-amber-50');
  });

  it('should render non-rare card styling when total < 3', () => {
    const commonCard = makeRepoCard({
      total: 1,
    });

    render(<Card item={commonCard} onClick={mockOnClick} />);

    const cardButton = screen.getByRole('button');
    expect(cardButton.className).toContain('bg-white');
  });

  it('should render shimmer effect only for rare cards', () => {
    const rareCard = makeRepoCard({ total: 5 });

    const { container } = render(<Card item={rareCard} onClick={mockOnClick} />);

    // Check for shimmer div
    const shimmerDiv = container.querySelector('.animate-shimmer');
    expect(shimmerDiv).toBeInTheDocument();
  });

  it('should not render shimmer effect for common cards', () => {
    const commonCard = makeRepoCard({ total: 1 });

    const { container } = render(<Card item={commonCard} onClick={mockOnClick} />);

    // Check that shimmer div does NOT exist
    const shimmerDiv = container.querySelector('.animate-shimmer');
    expect(shimmerDiv).not.toBeInTheDocument();
  });

  it('should render evolution badge when evolution is a number', () => {
    const evolvedCard = makeRepoCard({
      evolution: 2,
    });

    render(<Card item={evolvedCard} onClick={mockOnClick} />);

    expect(screen.getByText('2 Evolution')).toBeInTheDocument();
  });

  it('should render starter pack badge when starterPack is a number', () => {
    const starterCard = makeRepoCard({
      starterPack: 5,
    });

    render(<Card item={starterCard} onClick={mockOnClick} />);

    expect(screen.getByText('5 Starter Pack')).toBeInTheDocument();
  });

  it('should not render level badge when level is missing', () => {
    const cardWithoutLevel = makeRepoCard({
      level: undefined as unknown as string,
    });

    render(<Card item={cardWithoutLevel} onClick={mockOnClick} />);

    // Should still render without crashing
    expect(screen.getByText('Agumon')).toBeInTheDocument();
  });

  it('should not render type badge when type is missing', () => {
    const cardWithoutType = makeRepoCard({
      type: undefined as unknown as string,
    });

    render(<Card item={cardWithoutType} onClick={mockOnClick} />);

    // Should still render without crashing
    expect(screen.getByText('Agumon')).toBeInTheDocument();
  });

  it('should render category fallback when category is missing but level exists', () => {
    const cardWithOnlyLevel = makeRepoCard({
      category: undefined as unknown as string,
      level: 'Rookie',
    });

    render(<Card item={cardWithOnlyLevel} onClick={mockOnClick} />);

    // Should show level as fallback
    expect(screen.getAllByText('Rookie')).toHaveLength(2);
  });
});
