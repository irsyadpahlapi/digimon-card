import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FormInput from '../FormInput';

describe('FormInput Component', () => {
  const defaultProps = {
    id: 'test-input',
    name: 'testName',
    value: '',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render input with required props', () => {
      render(<FormInput {...defaultProps} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('id', 'test-input');
      expect(input).toHaveAttribute('name', 'testName');
    });

    it('should render with default input type', () => {
      render(<FormInput {...defaultProps} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should apply proper base classes', () => {
      render(<FormInput {...defaultProps} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass(
        'w-full',
        'pl-4',
        'pr-4',
        'py-3.5',
        'bg-gray-50',
        'border',
        'border-gray-200',
        'rounded-lg',
        'text-gray-900',
        'placeholder-gray-400',
        'focus:outline-none',
        'focus:border-orange-500',
        'focus:ring-2',
        'focus:ring-orange-500/20',
        'transition-all',
        'duration-200',
      );
    });
  });

  describe('Input Types', () => {
    it('should render email type correctly', () => {
      render(<FormInput {...defaultProps} type="email" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should render password type correctly', () => {
      render(<FormInput {...defaultProps} type="password" />);

      const input = screen.getByDisplayValue('');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('should render number type correctly', () => {
      render(<FormInput {...defaultProps} type="number" />);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });
  });

  describe('Label Functionality', () => {
    it('should render label when provided', () => {
      render(<FormInput {...defaultProps} label="Username" />);

      const label = screen.getByText('Username');
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute('for', 'test-input');
    });

    it('should not render label when not provided', () => {
      render(<FormInput {...defaultProps} />);

      const label = screen.queryByText('Username');
      expect(label).not.toBeInTheDocument();
    });

    it('should apply proper label classes', () => {
      render(<FormInput {...defaultProps} label="Test Label" />);

      const label = screen.getByText('Test Label');
      expect(label).toHaveClass('block', 'text-sm', 'font-semibold', 'text-gray-700', 'ml-1');
    });
  });

  describe('Icon Functionality', () => {
    const testIcon = <svg data-testid="test-icon">Icon</svg>;

    it('should render icon when provided', () => {
      render(<FormInput {...defaultProps} icon={testIcon} />);

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should adjust padding when icon is present', () => {
      render(<FormInput {...defaultProps} icon={testIcon} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pl-12');
    });

    it('should use default padding when no icon', () => {
      render(<FormInput {...defaultProps} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pl-4');
      expect(input).not.toHaveClass('pl-12');
    });

    it('should position icon container correctly', () => {
      const { container } = render(<FormInput {...defaultProps} icon={testIcon} />);

      const iconContainer = container.querySelector('.absolute.inset-y-0.left-0.pl-4');
      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer).toHaveClass('flex', 'items-center', 'pointer-events-none');
    });
  });

  describe('Placeholder', () => {
    it('should render placeholder text', () => {
      render(<FormInput {...defaultProps} placeholder="Enter your text" />);

      const input = screen.getByPlaceholderText('Enter your text');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Required Functionality', () => {
    it('should set required attribute when required is true', () => {
      render(<FormInput {...defaultProps} required />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('required');
    });

    it('should not set required attribute when required is false', () => {
      render(<FormInput {...defaultProps} required={false} />);

      const input = screen.getByRole('textbox');
      expect(input).not.toHaveAttribute('required');
    });
  });

  describe('Disabled State', () => {
    it('should disable input when disabled is true', () => {
      render(<FormInput {...defaultProps} disabled />);

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
      expect(input).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });

    it('should enable input when disabled is false', () => {
      render(<FormInput {...defaultProps} disabled={false} />);

      const input = screen.getByRole('textbox');
      expect(input).not.toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('should render error message when error is provided', () => {
      render(<FormInput {...defaultProps} error="This field is required" />);

      const errorMessage = screen.getByText('This field is required');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass('text-sm', 'text-red-600', 'ml-1');
    });

    it('should apply error styling to input when error exists', () => {
      render(<FormInput {...defaultProps} error="Error message" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-300', 'focus:border-red-500', 'focus:ring-red-500/20');
    });

    it('should set aria-invalid when error exists', () => {
      render(<FormInput {...defaultProps} error="Error message" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should link input to error message with aria-describedby', () => {
      render(<FormInput {...defaultProps} error="Error message" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'test-input-error');

      const errorMessage = screen.getByText('Error message');
      expect(errorMessage).toHaveAttribute('id', 'test-input-error');
    });

    it('should not render error message when no error', () => {
      render(<FormInput {...defaultProps} />);

      const errorMessage = screen.queryByText('This field is required');
      expect(errorMessage).not.toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle onChange events', async () => {
      const mockOnChange = jest.fn();
      const user = userEvent.setup();

      render(<FormInput {...defaultProps} onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(mockOnChange).toHaveBeenCalledTimes(4); // One for each character
    });

    it('should handle focus and blur events', async () => {
      const user = userEvent.setup();
      render(<FormInput {...defaultProps} />);

      const input = screen.getByRole('textbox');

      await user.click(input);
      expect(input).toHaveFocus();

      await user.tab();
      expect(input).not.toHaveFocus();
    });

    it('should update value correctly', () => {
      render(<FormInput {...defaultProps} value="test value" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('test value');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className to container', () => {
      const { container } = render(<FormInput {...defaultProps} className="custom-class" />);

      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toHaveClass('custom-class');
    });

    it('should maintain base classes with custom className', () => {
      const { container } = render(<FormInput {...defaultProps} className="custom-class" />);

      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toHaveClass('space-y-2', 'custom-class');
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility structure', () => {
      render(<FormInput {...defaultProps} label="Username" error="Username is required" />);

      const input = screen.getByRole('textbox');
      const label = screen.getByText('Username');
      const error = screen.getByText('Username is required');

      expect(label).toHaveAttribute('for', 'test-input');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'test-input-error');
      expect(error).toHaveAttribute('id', 'test-input-error');
    });

    it('should not have aria-describedby when no error', () => {
      render(<FormInput {...defaultProps} label="Username" />);

      const input = screen.getByRole('textbox');
      expect(input).not.toHaveAttribute('aria-describedby');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle all props together correctly', () => {
      const mockOnChange = jest.fn();
      const testIcon = <svg data-testid="complex-icon">Icon</svg>;

      render(
        <FormInput
          id="complex-input"
          name="complexName"
          type="email"
          value="test@example.com"
          onChange={mockOnChange}
          placeholder="Enter email"
          label="Email Address"
          icon={testIcon}
          required
          disabled={false}
          error=""
          className="my-custom-class"
        />,
      );

      const input = screen.getByRole('textbox');
      const label = screen.getByText('Email Address');
      const icon = screen.getByTestId('complex-icon');

      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('id', 'complex-input');
      expect(input).toHaveAttribute('name', 'complexName');
      expect(input).toHaveValue('test@example.com');
      expect(input).toHaveAttribute('placeholder', 'Enter email');
      expect(input).toHaveAttribute('required');
      expect(input).not.toBeDisabled();
      expect(input).toHaveClass('pl-12'); // Icon padding
      expect(label).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
    });
  });
});
