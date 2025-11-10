import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Toast from '../Toast';

describe('Toast Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders when isVisible is true', () => {
      render(
        <Toast message="Test message" isVisible={true} onClose={mockOnClose} type="success" />,
      );

      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('does not render when isVisible is false', () => {
      render(
        <Toast message="Test message" isVisible={false} onClose={mockOnClose} type="success" />,
      );

      expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    });

    it('renders success type with correct styling', () => {
      const { container } = render(
        <Toast message="Success" isVisible={true} onClose={mockOnClose} type="success" />,
      );

      const toastElement = container.querySelector('.bg-gradient-to-r.from-green-500');
      expect(toastElement).toBeInTheDocument();
    });

    it('renders error type with correct styling', () => {
      const { container } = render(
        <Toast message="Error" isVisible={true} onClose={mockOnClose} type="error" />,
      );

      const toastElement = container.querySelector('.bg-gradient-to-r.from-red-500');
      expect(toastElement).toBeInTheDocument();
    });

    it('renders info type with correct styling', () => {
      const { container } = render(
        <Toast message="Info" isVisible={true} onClose={mockOnClose} type="info" />,
      );

      const toastElement = container.querySelector('.bg-gradient-to-r.from-blue-500');
      expect(toastElement).toBeInTheDocument();
    });

    it('renders with default success type when type is not specified', () => {
      const { container } = render(
        <Toast message="Default" isVisible={true} onClose={mockOnClose} />,
      );

      const toastElement = container.querySelector('.bg-gradient-to-r.from-green-500');
      expect(toastElement).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('renders success icon for success type', () => {
      const { container } = render(
        <Toast message="Success" isVisible={true} onClose={mockOnClose} type="success" />,
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders error icon for error type', () => {
      const { container } = render(
        <Toast message="Error" isVisible={true} onClose={mockOnClose} type="error" />,
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders info icon for info type', () => {
      const { container } = render(
        <Toast message="Info" isVisible={true} onClose={mockOnClose} type="info" />,
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    it('renders close button', () => {
      render(<Toast message="Test" isVisible={true} onClose={mockOnClose} type="success" />);

      const closeButton = screen.getByLabelText('Close notification');
      expect(closeButton).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
      render(<Toast message="Test" isVisible={true} onClose={mockOnClose} type="success" />);

      const closeButton = screen.getByLabelText('Close notification');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Auto-close Timer', () => {
    it('calls onClose after default duration (3000ms)', () => {
      render(<Toast message="Test" isVisible={true} onClose={mockOnClose} type="success" />);

      expect(mockOnClose).not.toHaveBeenCalled();

      jest.advanceTimersByTime(3000);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose after custom duration', () => {
      render(
        <Toast
          message="Test"
          isVisible={true}
          onClose={mockOnClose}
          type="success"
          duration={5000}
        />,
      );

      jest.advanceTimersByTime(4999);
      expect(mockOnClose).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not auto-close when duration is 0', () => {
      render(
        <Toast message="Test" isVisible={true} onClose={mockOnClose} type="success" duration={0} />,
      );

      jest.advanceTimersByTime(10000);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('does not auto-close when isVisible is false', () => {
      render(
        <Toast
          message="Test"
          isVisible={false}
          onClose={mockOnClose}
          type="success"
          duration={3000}
        />,
      );

      jest.advanceTimersByTime(3000);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('clears timer on unmount', () => {
      const { unmount } = render(
        <Toast message="Test" isVisible={true} onClose={mockOnClose} type="success" />,
      );

      unmount();
      jest.advanceTimersByTime(3000);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('resets timer when isVisible changes to true', () => {
      const { rerender } = render(
        <Toast message="Test" isVisible={false} onClose={mockOnClose} type="success" />,
      );

      jest.advanceTimersByTime(1000);

      rerender(<Toast message="Test" isVisible={true} onClose={mockOnClose} type="success" />);

      jest.advanceTimersByTime(2999);
      expect(mockOnClose).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Styling and Classes', () => {
    it('applies animation class', () => {
      const { container } = render(
        <Toast message="Test" isVisible={true} onClose={mockOnClose} type="success" />,
      );

      const animatedElement = container.querySelector('.animate-slideInRight');
      expect(animatedElement).toBeInTheDocument();
    });

    it('applies correct positioning classes', () => {
      const { container } = render(
        <Toast message="Test" isVisible={true} onClose={mockOnClose} type="success" />,
      );

      const positionedElement = container.querySelector('.fixed.top-4.right-4.z-50');
      expect(positionedElement).toBeInTheDocument();
    });

    it('applies text styling classes', () => {
      render(<Toast message="Test" isVisible={true} onClose={mockOnClose} type="success" />);

      const message = screen.getByText('Test');
      expect(message).toHaveClass('flex-1', 'font-medium', 'text-sm');
    });
  });

  describe('Message Content', () => {
    it('displays short message', () => {
      render(<Toast message="Short" isVisible={true} onClose={mockOnClose} type="success" />);

      expect(screen.getByText('Short')).toBeInTheDocument();
    });

    it('displays long message', () => {
      const longMessage = 'This is a very long message that should still be displayed correctly';
      render(<Toast message={longMessage} isVisible={true} onClose={mockOnClose} type="success" />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('displays message with special characters', () => {
      const specialMessage = "Success! You've earned 100 coins & unlocked a new card!";
      render(
        <Toast message={specialMessage} isVisible={true} onClose={mockOnClose} type="success" />,
      );

      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });
  });

  describe('Multiple Toast Scenarios', () => {
    it('can render multiple toasts with different types', () => {
      const { container } = render(
        <>
          <Toast message="Success 1" isVisible={true} onClose={jest.fn()} type="success" />
          <Toast message="Error 1" isVisible={true} onClose={jest.fn()} type="error" />
          <Toast message="Info 1" isVisible={true} onClose={jest.fn()} type="info" />
        </>,
      );

      expect(screen.getByText('Success 1')).toBeInTheDocument();
      expect(screen.getByText('Error 1')).toBeInTheDocument();
      expect(screen.getByText('Info 1')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('close button has proper aria-label', () => {
      render(<Toast message="Test" isVisible={true} onClose={mockOnClose} type="success" />);

      const closeButton = screen.getByLabelText('Close notification');
      expect(closeButton).toHaveAttribute('aria-label', 'Close notification');
    });

    it('close button is keyboard accessible', () => {
      render(<Toast message="Test" isVisible={true} onClose={mockOnClose} type="success" />);

      const closeButton = screen.getByLabelText('Close notification');
      closeButton.focus();

      expect(closeButton).toHaveFocus();
    });
  });
});
