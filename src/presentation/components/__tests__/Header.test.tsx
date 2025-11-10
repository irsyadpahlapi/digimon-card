import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header Component', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Header title="Starter Packs" />);

      expect(screen.getByText('Hi, User')).toBeInTheDocument();
      expect(screen.getByText('Starter Packs')).toBeInTheDocument();
      expect(screen.getByText('0 Coins')).toBeInTheDocument();
    });

    it('renders with custom userName', () => {
      render(<Header userName="John Doe" title="My Collection" />);

      expect(screen.getByText('Hi, John Doe')).toBeInTheDocument();
      expect(screen.getByText('My Collection')).toBeInTheDocument();
    });

    it('renders with custom title', () => {
      render(<Header title="Custom Title" />);

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('renders with custom coins', () => {
      render(<Header title="Starter Packs" coins={1000} />);

      expect(screen.getByText('1000 Coins')).toBeInTheDocument();
    });

    it('renders all props together', () => {
      render(<Header userName="Alice" title="Digimon Cards" coins={500} showCoins={true} />);

      expect(screen.getByText('Hi, Alice')).toBeInTheDocument();
      expect(screen.getByText('Digimon Cards')).toBeInTheDocument();
      expect(screen.getByText('500 Coins')).toBeInTheDocument();
    });
  });

  describe('Coins Display', () => {
    it('shows coins section when showCoins is true', () => {
      render(<Header title="Test" showCoins={true} coins={100} />);

      expect(screen.getByText('100 Coins')).toBeInTheDocument();
    });

    it('hides coins section when showCoins is false', () => {
      render(<Header title="Test" showCoins={false} coins={100} />);

      expect(screen.queryByText('100 Coins')).not.toBeInTheDocument();
    });

    it('shows coins by default when showCoins is not specified', () => {
      render(<Header title="Test" coins={250} />);

      expect(screen.getByText('250 Coins')).toBeInTheDocument();
    });

    it('renders coin icon SVG when showCoins is true', () => {
      const { container } = render(<Header title="Test" showCoins={true} />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('h-5', 'w-5', 'text-[#643c30]');
    });

    it('does not render coin icon SVG when showCoins is false', () => {
      const { container } = render(<Header title="Test" showCoins={false} />);

      const svg = container.querySelector('svg');
      expect(svg).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies gradient styling to userName', () => {
      render(<Header userName="TestUser" title="Test" />);

      const userNameElement = screen.getByText('Hi, TestUser');
      expect(userNameElement).toHaveClass(
        'text-2xl',
        'md:text-3xl',
        'font-bold',
        'bg-gradient-to-r',
        'from-[#443c70]',
        'to-[#a76050]',
        'bg-clip-text',
        'text-transparent',
      );
    });

    it('applies gradient styling to title', () => {
      render(<Header title="Test Title" />);

      const titleElement = screen.getByRole('heading', { name: 'Test Title' });
      expect(titleElement).toHaveClass(
        'text-2xl',
        'md:text-3xl',
        'font-bold',
        'bg-gradient-to-r',
        'from-[#443c70]',
        'to-[#a76050]',
        'bg-clip-text',
        'text-transparent',
      );
    });

    it('applies glass effect styling to container', () => {
      const { container } = render(<Header title="Test" />);

      const headerContainer = container.firstChild;
      expect(headerContainer).toHaveClass(
        'backdrop-blur-sm',
        'bg-white/80',
        'rounded-2xl',
        'p-6',
        'mb-8',
        'shadow-xl',
        'border',
        'border-white/20',
      );
    });

    it('applies gradient styling to coins badge', () => {
      const { container } = render(<Header title="Test" showCoins={true} />);

      const coinsBadge = container.querySelector('[class*="from-"]');
      expect(coinsBadge).toBeInTheDocument();
    });
  });

  describe('Semantic HTML', () => {
    it('renders title as h1 heading', () => {
      render(<Header title="Main Title" />);

      const heading = screen.getByRole('heading', { level: 1, name: 'Main Title' });
      expect(heading).toBeInTheDocument();
    });

    it('renders coins value as h2 heading', () => {
      render(<Header title="Test" coins={500} />);

      const coinsHeading = screen.getByRole('heading', { level: 2 });
      expect(coinsHeading).toHaveTextContent('500 Coins');
    });
  });

  describe('Edge Cases', () => {
    it('handles zero coins', () => {
      render(<Header title="Test" coins={0} />);

      expect(screen.getByText('0 Coins')).toBeInTheDocument();
    });

    it('handles large coin numbers', () => {
      render(<Header title="Test" coins={999999} />);

      expect(screen.getByText('999999 Coins')).toBeInTheDocument();
    });

    it('handles negative coin numbers', () => {
      render(<Header title="Test" coins={-100} />);

      expect(screen.getByText('-100 Coins')).toBeInTheDocument();
    });

    it('handles empty userName', () => {
      render(<Header userName="" title="Test" />);

      expect(screen.getByText('Hi,')).toBeInTheDocument();
    });

    it('handles long userName', () => {
      const longName = 'This is a very long username that should still render correctly';
      render(<Header userName={longName} title="Test" />);

      expect(screen.getByText(`Hi, ${longName}`)).toBeInTheDocument();
    });

    it('handles long title', () => {
      const longTitle = 'This is a very long title that should wrap correctly in responsive design';
      render(<Header title={longTitle} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('renders with responsive text classes for userName', () => {
      render(<Header userName="Test" title="Test" />);

      const userNameElement = screen.getByText('Hi, Test');
      expect(userNameElement).toHaveClass('text-2xl', 'md:text-3xl');
    });

    it('renders with responsive text classes for title', () => {
      render(<Header title="Test Title" />);

      const titleElement = screen.getByRole('heading', { name: 'Test Title' });
      expect(titleElement).toHaveClass('text-2xl', 'md:text-3xl');
    });

    it('renders with responsive text classes for coins', () => {
      render(<Header title="Test" coins={100} />);

      const coinsElement = screen.getByRole('heading', { level: 2 });
      expect(coinsElement).toHaveClass('text-xl', 'md:text-2xl');
    });
  });

  describe('SVG Icon', () => {
    it('renders coin icon with correct viewBox', () => {
      const { container } = render(<Header title="Test" showCoins={true} />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 20 20');
    });

    it('renders coin icon with correct fill', () => {
      const { container } = render(<Header title="Test" showCoins={true} />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('fill', 'currentColor');
    });

    it('renders coin icon paths', () => {
      const { container } = render(<Header title="Test" showCoins={true} />);

      const paths = container.querySelectorAll('svg path');
      expect(paths.length).toBeGreaterThan(0);
    });
  });
});
