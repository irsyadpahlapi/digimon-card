import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GradientBackground from '../gradientBackground';

describe('GradientBackground Component', () => {
  describe('Basic Rendering', () => {
    it('should render children correctly', () => {
      render(
        <GradientBackground variant="homepage">
          <div data-testid="test-child">Test Content</div>
        </GradientBackground>,
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should apply min-height class', () => {
      const { container } = render(
        <GradientBackground variant="homepage">
          <div>Content</div>
        </GradientBackground>,
      );

      const backgroundDiv = container.firstChild as HTMLElement;
      expect(backgroundDiv).toHaveClass('min-h-screen');
    });
  });

  describe('Homepage Variant', () => {
    it('should apply homepage gradient classes', () => {
      const { container } = render(
        <GradientBackground variant="homepage">
          <div>Homepage Content</div>
        </GradientBackground>,
      );

      const backgroundDiv = container.firstChild as HTMLElement;
      expect(backgroundDiv).toHaveClass(
        'bg-gradient-to-br',
        'from-[#443c70]',
        'via-[#a76050]',
        'to-[#f1ba63]',
      );
    });

    it('should not render decoration elements for homepage', () => {
      const { container } = render(
        <GradientBackground variant="homepage">
          <div>Homepage Content</div>
        </GradientBackground>,
      );

      // Should not have decoration divs (only for login)
      const decorationElements = container.querySelectorAll('.absolute');
      expect(decorationElements).toHaveLength(0);
    });
  });

  describe('Login Variant', () => {
    it('should apply login gradient classes', () => {
      const { container } = render(
        <GradientBackground variant="login">
          <div>Login Content</div>
        </GradientBackground>,
      );

      const backgroundDiv = container.firstChild as HTMLElement;
      expect(backgroundDiv).toHaveClass(
        'bg-gradient-to-br',
        'from-amber-50',
        'via-yellow-50',
        'to-orange-50',
      );
    });

    it('should render decoration elements for login variant', () => {
      const { container } = render(
        <GradientBackground variant="login">
          <div>Login Content</div>
        </GradientBackground>,
      );

      const decorationElements = container.querySelectorAll('.absolute');
      expect(decorationElements).toHaveLength(2);

      // Check first decoration
      expect(decorationElements[0]).toHaveClass(
        'top-20',
        'left-10',
        'w-96',
        'h-96',
        'bg-yellow-200/30',
        'rounded-full',
        'filter',
        'blur-3xl',
        'opacity-50',
      );

      // Check second decoration
      expect(decorationElements[1]).toHaveClass(
        'bottom-20',
        'right-10',
        'w-96',
        'h-96',
        'bg-orange-300/30',
        'rounded-full',
        'filter',
        'blur-3xl',
        'opacity-50',
      );
    });
  });

  describe('Custom Props', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <GradientBackground variant="homepage" className="custom-class">
          <div>Content</div>
        </GradientBackground>,
      );

      const backgroundDiv = container.firstChild as HTMLElement;
      expect(backgroundDiv).toHaveClass('custom-class');
    });

    it('should maintain base classes with custom className', () => {
      const { container } = render(
        <GradientBackground variant="login" className="relative overflow-hidden">
          <div>Content</div>
        </GradientBackground>,
      );

      const backgroundDiv = container.firstChild as HTMLElement;
      expect(backgroundDiv).toHaveClass(
        'min-h-screen',
        'bg-gradient-to-br',
        'relative',
        'overflow-hidden',
      );
    });
  });

  describe('Children Handling', () => {
    it('should render multiple children', () => {
      render(
        <GradientBackground variant="homepage">
          <div data-testid="child1">First Child</div>
          <div data-testid="child2">Second Child</div>
          <span data-testid="child3">Third Child</span>
        </GradientBackground>,
      );

      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
      expect(screen.getByTestId('child3')).toBeInTheDocument();
    });

    it('should render complex children structures', () => {
      render(
        <GradientBackground variant="login">
          <header data-testid="header">
            <h1>Title</h1>
            <nav>Navigation</nav>
          </header>
          <main data-testid="main">
            <section>
              <article>Content</article>
            </section>
          </main>
        </GradientBackground>,
      );

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('main')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Navigation')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should render string children', () => {
      render(<GradientBackground variant="homepage">Simple text content</GradientBackground>);

      expect(screen.getByText('Simple text content')).toBeInTheDocument();
    });
  });

  describe('Decoration Positioning', () => {
    it('should position decorations correctly for login variant', () => {
      const { container } = render(
        <GradientBackground variant="login">
          <div>Content</div>
        </GradientBackground>,
      );

      const decorations = container.querySelectorAll('.absolute');

      // First decoration (top-left)
      expect(decorations[0]).toHaveClass('top-20', 'left-10');

      // Second decoration (bottom-right)
      expect(decorations[1]).toHaveClass('bottom-20', 'right-10');
    });
  });

  describe('Gradient Patterns', () => {
    it('should use correct gradient direction', () => {
      const { container: homepageContainer } = render(
        <GradientBackground variant="homepage">
          <div>Homepage</div>
        </GradientBackground>,
      );

      const { container: loginContainer } = render(
        <GradientBackground variant="login">
          <div>Login</div>
        </GradientBackground>,
      );

      const homepageDiv = homepageContainer.firstChild as HTMLElement;
      const loginDiv = loginContainer.firstChild as HTMLElement;

      // Both should use same gradient direction
      expect(homepageDiv).toHaveClass('bg-gradient-to-br');
      expect(loginDiv).toHaveClass('bg-gradient-to-br');
    });
  });

  describe('TypeScript Props', () => {
    it('should accept valid variant values', () => {
      // These should compile and render without errors
      expect(() => {
        render(
          <GradientBackground variant="homepage">
            <div>Content</div>
          </GradientBackground>,
        );
      }).not.toThrow();

      expect(() => {
        render(
          <GradientBackground variant="login">
            <div>Content</div>
          </GradientBackground>,
        );
      }).not.toThrow();
    });
  });
});
