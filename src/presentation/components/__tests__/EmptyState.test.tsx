import { render, screen } from '@testing-library/react';
import EmptyState from '../EmptyState';

describe('EmptyState Component', () => {
  it('renders with default props', () => {
    render(<EmptyState />);

    expect(screen.getByText('No Cards Yet!')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Your collection is empty. Start your Digimon journey by purchasing a starter pack above!',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Scroll up to buy a pack')).toBeInTheDocument();
  });

  it('renders with custom title and description', () => {
    render(
      <EmptyState
        title="Custom Empty Title"
        description="Custom empty description text"
        actionText="Custom action text"
      />,
    );

    expect(screen.getByText('Custom Empty Title')).toBeInTheDocument();
    expect(screen.getByText('Custom empty description text')).toBeInTheDocument();
    expect(screen.getByText('Custom action text')).toBeInTheDocument();
  });

  it('displays correct stats', () => {
    render(<EmptyState totalPacks={5} cardsPerPack="10-15" userCoins={100} />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('10-15')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();

    expect(screen.getByText('Pack Types')).toBeInTheDocument();
    expect(screen.getByText('Cards per Pack')).toBeInTheDocument();
    expect(screen.getByText('Your Coins')).toBeInTheDocument();
  });

  it('renders SVG illustration', () => {
    const { container } = render(<EmptyState />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-64', 'h-64', 'mx-auto');
  });

  it('renders animated elements', () => {
    const { container } = render(<EmptyState />);

    // Check for animated circles (sparkles)
    const circles = container.querySelectorAll('circle.animate-ping');
    expect(circles.length).toBeGreaterThan(0);

    // Check for pulse animation
    const pulseElements = container.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(0);

    // Check for bounce animation
    const bounceElements = container.querySelectorAll('.animate-bounce');
    expect(bounceElements.length).toBeGreaterThan(0);
  });

  it('renders call-to-action with icon', () => {
    const { container } = render(<EmptyState actionText="Buy a pack now" />);

    expect(screen.getByText('Buy a pack now')).toBeInTheDocument();

    // Check for SVG icon
    const iconSvg = container.querySelector('svg[viewBox="0 0 24 24"]');
    expect(iconSvg).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const { container } = render(<EmptyState />);

    const mainContainer = container.querySelector('.backdrop-blur-sm');
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass('bg-white/90', 'rounded-3xl', 'shadow-2xl');
  });

  it('renders gradient definition for SVG', () => {
    const { container } = render(<EmptyState />);

    const gradient = container.querySelector('#emptyGradient');
    expect(gradient).toBeInTheDocument();

    const stops = gradient?.querySelectorAll('stop');
    expect(stops?.length).toBe(3);
  });

  it('displays zero coins when userCoins is 0', () => {
    render(<EmptyState userCoins={0} />);

    const coinsText = screen.getByText('0');
    expect(coinsText).toBeInTheDocument();
  });

  it('handles large numbers for stats', () => {
    render(<EmptyState totalPacks={999} cardsPerPack="100-200" userCoins={99999} />);

    expect(screen.getByText('999')).toBeInTheDocument();
    expect(screen.getByText('100-200')).toBeInTheDocument();
    expect(screen.getByText('99999')).toBeInTheDocument();
  });
});
