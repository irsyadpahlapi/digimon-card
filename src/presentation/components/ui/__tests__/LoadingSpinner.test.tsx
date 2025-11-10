import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner Component', () => {
  describe('Basic Rendering', () => {
    it('should render with default props', () => {
      render(<LoadingSpinner />);

      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('aria-label', 'Loading');
    });

    it('should render with proper structure and classes', () => {
      const { container } = render(<LoadingSpinner />);

      const spinnerDiv = container.firstChild as HTMLElement;
      expect(spinnerDiv).toHaveClass('border-4', 'rounded-full', 'animate-spin');
    });
  });

  describe('Size Variants', () => {
    it('should render small size correctly', () => {
      const { container } = render(<LoadingSpinner size="sm" />);

      const spinnerDiv = container.firstChild as HTMLElement;
      expect(spinnerDiv).toHaveClass('w-4', 'h-4');
    });

    it('should render medium size correctly (default)', () => {
      const { container } = render(<LoadingSpinner size="md" />);

      const spinnerDiv = container.firstChild as HTMLElement;
      expect(spinnerDiv).toHaveClass('w-16', 'h-16');
    });

    it('should render large size correctly', () => {
      const { container } = render(<LoadingSpinner size="lg" />);

      const spinnerDiv = container.firstChild as HTMLElement;
      expect(spinnerDiv).toHaveClass('w-24', 'h-24');
    });

    it('should default to medium size when no size prop provided', () => {
      const { container } = render(<LoadingSpinner />);

      const spinnerDiv = container.firstChild as HTMLElement;
      expect(spinnerDiv).toHaveClass('w-16', 'h-16');
    });
  });

  describe('Color Variants', () => {
    it('should render white color correctly (default)', () => {
      const { container } = render(<LoadingSpinner color="white" />);

      const spinnerDiv = container.firstChild as HTMLElement;
      expect(spinnerDiv).toHaveClass('border-white', 'border-t-transparent');
    });

    it('should render primary color correctly', () => {
      const { container } = render(<LoadingSpinner color="primary" />);

      const spinnerDiv = container.firstChild as HTMLElement;
      expect(spinnerDiv).toHaveClass('border-blue-500', 'border-t-transparent');
    });

    it('should render orange color correctly', () => {
      const { container } = render(<LoadingSpinner color="orange" />);

      const spinnerDiv = container.firstChild as HTMLElement;
      expect(spinnerDiv).toHaveClass('border-orange-500', 'border-t-transparent');
    });

    it('should default to white color when no color prop provided', () => {
      const { container } = render(<LoadingSpinner />);

      const spinnerDiv = container.firstChild as HTMLElement;
      expect(spinnerDiv).toHaveClass('border-white', 'border-t-transparent');
    });
  });

  describe('Custom Props', () => {
    it('should apply custom className', () => {
      const { container } = render(<LoadingSpinner className="custom-class mx-auto" />);

      const spinnerDiv = container.firstChild as HTMLElement;
      expect(spinnerDiv).toHaveClass('custom-class', 'mx-auto');
    });

    it('should maintain default classes with custom className', () => {
      const { container } = render(<LoadingSpinner className="custom-class" />);

      const spinnerDiv = container.firstChild as HTMLElement;
      expect(spinnerDiv).toHaveClass('custom-class', 'border-4', 'rounded-full', 'animate-spin');
    });
  });

  describe('Accessibility', () => {
    it('should have proper role attribute', () => {
      render(<LoadingSpinner />);

      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
    });

    it('should have proper aria-label', () => {
      render(<LoadingSpinner />);

      const spinner = screen.getByLabelText('Loading');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Props Combination', () => {
    it('should handle all props together correctly', () => {
      const { container } = render(
        <LoadingSpinner size="lg" color="primary" className="my-custom-class" />,
      );

      const spinnerDiv = container.firstChild as HTMLElement;
      expect(spinnerDiv).toHaveClass(
        'w-24',
        'h-24', // large size
        'border-blue-500',
        'border-t-transparent', // primary color
        'my-custom-class', // custom class
        'border-4',
        'rounded-full',
        'animate-spin', // base classes
      );
    });
  });

  describe('Animation', () => {
    it('should have spinning animation class', () => {
      const { container } = render(<LoadingSpinner />);

      const spinnerDiv = container.firstChild as HTMLElement;
      expect(spinnerDiv).toHaveClass('animate-spin');
    });
  });

  describe('Border Styling', () => {
    it('should have proper border width', () => {
      const { container } = render(<LoadingSpinner />);

      const spinnerDiv = container.firstChild as HTMLElement;
      expect(spinnerDiv).toHaveClass('border-4');
    });

    it('should be circular', () => {
      const { container } = render(<LoadingSpinner />);

      const spinnerDiv = container.firstChild as HTMLElement;
      expect(spinnerDiv).toHaveClass('rounded-full');
    });
  });
});
