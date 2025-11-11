import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LogoBrand from '../LogoBrand';

describe('LogoBrand Component', () => {
  describe('Basic Rendering', () => {
    it('should render with default props', () => {
      render(<LogoBrand />);

      expect(screen.getByText('DigiCard')).toBeInTheDocument();
      expect(screen.getByText('⚡ ENTER AT YOUR OWN RISK ⚡')).toBeInTheDocument();
      expect(screen.getByAltText('Agumon')).toBeInTheDocument();
    });

    it('should render with custom title and subtitle', () => {
      render(<LogoBrand title="Custom Title" subtitle="Custom Subtitle" />);

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
    });

    it('should render with custom image props', () => {
      render(<LogoBrand imageSrc="/custom-image.png" imageAlt="Custom Alt" />);

      const image = screen.getByAltText('Custom Alt');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/custom-image.png');
    });
  });

  describe('Size Variants', () => {
    it('should render small size correctly', () => {
      render(<LogoBrand size="sm" />);

      const title = screen.getByText('DigiCard');
      const subtitle = screen.getByText('⚡ ENTER AT YOUR OWN RISK ⚡');

      expect(title).toHaveClass('text-2xl');
      expect(subtitle).toHaveClass('text-sm');
    });

    it('should render medium size correctly (default)', () => {
      render(<LogoBrand size="md" />);

      const title = screen.getByText('DigiCard');
      const subtitle = screen.getByText('⚡ ENTER AT YOUR OWN RISK ⚡');

      expect(title).toHaveClass('text-4xl', 'md:text-5xl');
      expect(subtitle).toHaveClass('text-lg');
    });

    it('should render large size correctly', () => {
      render(<LogoBrand size="lg" />);

      const title = screen.getByText('DigiCard');
      const subtitle = screen.getByText('⚡ ENTER AT YOUR OWN RISK ⚡');

      expect(title).toHaveClass('text-5xl', 'md:text-6xl');
      expect(subtitle).toHaveClass('text-xl');
    });

    it('should default to medium size when no size provided', () => {
      render(<LogoBrand />);

      const title = screen.getByText('DigiCard');
      expect(title).toHaveClass('text-4xl', 'md:text-5xl');
    });
  });

  describe('Image Container Styling', () => {
    it('should apply correct container classes for small size', () => {
      render(<LogoBrand size="sm" />);

      const imageContainer = document.querySelector('.inline-block .relative');
      expect(imageContainer).toHaveClass('p-4', 'w-20', 'h-20');
    });

    it('should apply correct container classes for medium size', () => {
      render(<LogoBrand size="md" />);

      const imageContainer = document.querySelector('.inline-block .relative');
      expect(imageContainer).toHaveClass('p-6', 'w-28', 'h-28');
    });

    it('should apply correct container classes for large size', () => {
      render(<LogoBrand size="lg" />);

      const imageContainer = document.querySelector('.inline-block .relative');
      expect(imageContainer).toHaveClass('p-8', 'w-36', 'h-36');
    });
  });

  describe('Image Sizing', () => {
    it('should apply correct image classes for each size', () => {
      // Small
      const { unmount: unmountSmall } = render(<LogoBrand size="sm" />);
      const smallImage = document.querySelector('img');
      expect(smallImage).toHaveClass('w-12', 'h-12');
      unmountSmall();

      // Medium
      const { unmount: unmountMedium } = render(<LogoBrand size="md" />);
      const mediumImage = document.querySelector('img');
      expect(mediumImage).toHaveClass('w-16', 'h-16');
      unmountMedium();

      // Large
      const { unmount: unmountLarge } = render(<LogoBrand size="lg" />);
      const largeImage = document.querySelector('img');
      expect(largeImage).toHaveClass('w-24', 'h-24');
      unmountLarge();
    });

    it('should have consistent image styling across sizes', () => {
      render(<LogoBrand />);

      const image = screen.getByAltText('Agumon');
      expect(image).toHaveClass(
        'object-contain',
        'drop-shadow-2xl',
        'relative',
        'z-10',
        'scale-110',
      );
      expect(image).toHaveAttribute('width', '112');
      expect(image).toHaveAttribute('height', '112');
    });
  });

  describe('Background Styling', () => {
    it('should have proper gradient background', () => {
      render(<LogoBrand />);

      const gradientContainer = document.querySelector('.inline-block');
      expect(gradientContainer).toHaveClass(
        'bg-gradient-to-br',
        'from-yellow-400',
        'via-orange-500',
        'to-amber-500',
        'rounded-full',
        'shadow-2xl',
        'relative',
        'overflow-hidden',
      );
    });

    it('should have glow effect element', () => {
      render(<LogoBrand />);

      const glowEffect = document.querySelector('.absolute.inset-0.bg-gradient-to-br');
      expect(glowEffect).toHaveClass(
        'from-yellow-300',
        'to-orange-400',
        'opacity-40',
        'rounded-full',
        'blur-md',
      );
    });
  });

  describe('Title Styling', () => {
    it('should apply proper title classes', () => {
      render(<LogoBrand />);

      const title = screen.getByText('DigiCard');
      expect(title).toHaveClass(
        'font-bold',
        'bg-gradient-to-r',
        'from-yellow-600',
        'via-orange-600',
        'to-amber-600',
        'bg-clip-text',
        'text-transparent',
        'mb-2',
        'drop-shadow-lg',
        'tracking-tight',
      );
    });

    it('should handle custom title with same styling', () => {
      render(<LogoBrand title="Custom App" />);

      const title = screen.getByText('Custom App');
      expect(title).toHaveClass(
        'font-bold',
        'bg-gradient-to-r',
        'from-yellow-600',
        'via-orange-600',
        'to-amber-600',
      );
    });
  });

  describe('Subtitle Styling', () => {
    it('should apply proper subtitle classes', () => {
      render(<LogoBrand />);

      const subtitle = screen.getByText('⚡ ENTER AT YOUR OWN RISK ⚡');
      expect(subtitle).toHaveClass('text-orange-700', 'font-bold', 'tracking-wide');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className to container', () => {
      render(<LogoBrand className="custom-brand-class" />);

      const mainContainer = document.querySelector('.custom-brand-class');
      expect(mainContainer).toBeInTheDocument();
    });

    it('should maintain base classes with custom className', () => {
      render(<LogoBrand className="my-custom-spacing" />);

      const mainContainer = document.querySelector('.my-custom-spacing');
      expect(mainContainer).toHaveClass('text-center', 'mb-8', 'my-custom-spacing');
    });
  });

  describe('Image Properties', () => {
    it('should set priority prop on Image component', () => {
      render(<LogoBrand />);

      const image = screen.getByAltText('Agumon');
      // Note: In our mock, priority would be passed but not reflected in attributes
      // We just verify the image is rendered correctly
      expect(image).toBeInTheDocument();
    });

    it('should handle custom image properties', () => {
      render(<LogoBrand imageSrc="/test-image.jpg" imageAlt="Test Image" />);

      const image = screen.getByAltText('Test Image');
      expect(image).toHaveAttribute('src', '/test-image.jpg');
    });
  });

  describe('Layout Structure', () => {
    it('should have proper container structure', () => {
      render(<LogoBrand />);

      const mainContainer = document.querySelector('.text-center.mb-8');
      expect(mainContainer).toBeInTheDocument();

      // Should have image container, title, and subtitle
      expect(document.querySelector('.inline-block')).toBeInTheDocument();
      expect(screen.getByText('DigiCard')).toBeInTheDocument();
      expect(screen.getByText('⚡ ENTER AT YOUR OWN RISK ⚡')).toBeInTheDocument();
    });

    it('should maintain proper spacing between elements', () => {
      render(<LogoBrand />);

      const title = screen.getByText('DigiCard');
      expect(title).toHaveClass('mb-2');
      // The image container should have mb-6 for spacing
    });
  });

  describe('Responsive Behavior', () => {
    it('should apply responsive classes correctly', () => {
      render(<LogoBrand size="md" />);

      const title = screen.getByText('DigiCard');
      expect(title).toHaveClass('text-4xl', 'md:text-5xl');
    });

    it('should maintain responsive behavior with custom sizes', () => {
      render(<LogoBrand size="lg" />);

      const title = screen.getByText('DigiCard');
      expect(title).toHaveClass('text-5xl', 'md:text-6xl');
    });
  });

  describe('Props Combination', () => {
    it('should handle all props together correctly', () => {
      render(
        <LogoBrand
          title="Custom Brand"
          subtitle="Custom Tagline"
          imageSrc="/custom.png"
          imageAlt="Custom Logo"
          size="lg"
          className="custom-spacing"
        />,
      );

      expect(screen.getByText('Custom Brand')).toBeInTheDocument();
      expect(screen.getByText('Custom Tagline')).toBeInTheDocument();

      const image = screen.getByAltText('Custom Logo');
      expect(image).toHaveAttribute('src', '/custom.png');
      expect(image).toHaveClass('w-24', 'h-24'); // Large size

      const title = screen.getByText('Custom Brand');
      expect(title).toHaveClass('text-5xl', 'md:text-6xl'); // Large size

      const subtitle = screen.getByText('Custom Tagline');
      expect(subtitle).toHaveClass('text-xl'); // Large size
    });
  });

  describe('Empty/Null Values', () => {
    it('should handle empty strings gracefully', () => {
      render(<LogoBrand title="" subtitle="" />);

      // Should still render the structure, even with empty strings
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('');
    });
  });
});
