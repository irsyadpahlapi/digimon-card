import { render, screen, fireEvent } from '@testing-library/react';
import FilterSection from '../FilterSection';

describe('FilterSection Component', () => {
  const mockOnFilterChange = jest.fn();
  const mockOnToggleCategory = jest.fn();
  const mockOnToggleType = jest.fn();

  const defaultProps = {
    filterBy: {
      none: 'Active',
      category: '',
      type: '',
    },
    isDropdownCategory: false,
    isDropdownType: false,
    categories: ['Vaccine', 'Virus', 'Data', 'Free'],
    types: ['All Categories', 'Rookie', 'Champion', 'Ultimate'],
    onFilterChange: mockOnFilterChange,
    onToggleCategory: mockOnToggleCategory,
    onToggleType: mockOnToggleType,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders filter section with title', () => {
      render(<FilterSection {...defaultProps} />);

      expect(screen.getByText('Filter By')).toBeInTheDocument();
    });

    it('renders None button', () => {
      render(<FilterSection {...defaultProps} />);

      expect(screen.getByRole('button', { name: 'None' })).toBeInTheDocument();
    });

    it('renders Categories button', () => {
      render(<FilterSection {...defaultProps} />);

      expect(screen.getByRole('button', { name: /Categories/i })).toBeInTheDocument();
    });

    it('renders Types button', () => {
      render(<FilterSection {...defaultProps} />);

      expect(screen.getByRole('button', { name: /Types/i })).toBeInTheDocument();
    });
  });

  describe('None Filter Button', () => {
    it('applies active styles when none filter is active', () => {
      render(<FilterSection {...defaultProps} />);

      const noneButton = screen.getByRole('button', { name: 'None' });
      expect(noneButton).toHaveClass('bg-blue-700', 'text-white');
    });

    it('applies inactive styles when none filter is not active', () => {
      const props = {
        ...defaultProps,
        filterBy: { none: '', category: 'Vaccine', type: '' },
      };
      render(<FilterSection {...props} />);

      const noneButton = screen.getByRole('button', { name: 'None' });
      expect(noneButton).toHaveClass('bg-white');
    });

    it('calls onFilterChange when None button is clicked', () => {
      render(<FilterSection {...defaultProps} />);

      const noneButton = screen.getByRole('button', { name: 'None' });
      fireEvent.click(noneButton);

      expect(mockOnFilterChange).toHaveBeenCalledWith('none', 'Active');
    });
  });

  describe('Category Dropdown', () => {
    it('applies active styles when category filter is selected', () => {
      const props = {
        ...defaultProps,
        filterBy: { none: '', category: 'Vaccine', type: '' },
      };
      render(<FilterSection {...props} />);

      const categoryButton = screen.getByRole('button', { name: /Categories/i });
      expect(categoryButton).toHaveClass('bg-blue-700', 'text-white');
    });

    it('toggles category dropdown when Categories button is clicked', () => {
      render(<FilterSection {...defaultProps} />);

      const categoryButton = screen.getByRole('button', { name: /Categories/i });
      fireEvent.click(categoryButton);

      expect(mockOnToggleCategory).toHaveBeenCalled();
    });

    it('renders category options when dropdown is open', () => {
      const props = { ...defaultProps, isDropdownCategory: true };
      render(<FilterSection {...props} />);

      expect(screen.getByText('Vaccine')).toBeInTheDocument();
      expect(screen.getByText('Virus')).toBeInTheDocument();
      expect(screen.getByText('Data')).toBeInTheDocument();
      expect(screen.getByText('Free')).toBeInTheDocument();
    });

    it('does not render category options when dropdown is closed', () => {
      render(<FilterSection {...defaultProps} />);

      expect(screen.queryByText('Vaccine')).not.toBeInTheDocument();
      expect(screen.queryByText('Virus')).not.toBeInTheDocument();
    });

    it('calls onFilterChange and toggles dropdown when category is selected', () => {
      const props = { ...defaultProps, isDropdownCategory: true };
      render(<FilterSection {...props} />);

      const vaccineOption = screen.getByText('Vaccine');
      fireEvent.click(vaccineOption);

      expect(mockOnFilterChange).toHaveBeenCalledWith('category', 'Vaccine');
      expect(mockOnToggleCategory).toHaveBeenCalled();
    });
  });

  describe('Type Dropdown', () => {
    it('applies active styles when type filter is selected', () => {
      const props = {
        ...defaultProps,
        filterBy: { none: '', category: '', type: 'Rookie' },
      };
      render(<FilterSection {...props} />);

      const typeButton = screen.getByRole('button', { name: /Types/i });
      expect(typeButton).toHaveClass('bg-blue-700', 'text-white');
    });

    it('toggles type dropdown when Types button is clicked', () => {
      render(<FilterSection {...defaultProps} />);

      const typeButton = screen.getByRole('button', { name: /Types/i });
      fireEvent.click(typeButton);

      expect(mockOnToggleType).toHaveBeenCalled();
    });

    it('renders type options when dropdown is open', () => {
      const props = { ...defaultProps, isDropdownType: true };
      render(<FilterSection {...props} />);

      expect(screen.getByText('All Categories')).toBeInTheDocument();
      expect(screen.getByText('Rookie')).toBeInTheDocument();
      expect(screen.getByText('Champion')).toBeInTheDocument();
      expect(screen.getByText('Ultimate')).toBeInTheDocument();
    });

    it('does not render type options when dropdown is closed', () => {
      render(<FilterSection {...defaultProps} />);

      expect(screen.queryByText('All Categories')).not.toBeInTheDocument();
      expect(screen.queryByText('Rookie')).not.toBeInTheDocument();
    });

    it('calls onFilterChange and toggles dropdown when type is selected', () => {
      const props = { ...defaultProps, isDropdownType: true };
      render(<FilterSection {...props} />);

      const rookieOption = screen.getByText('Rookie');
      fireEvent.click(rookieOption);

      expect(mockOnFilterChange).toHaveBeenCalledWith('type', 'Rookie');
      expect(mockOnToggleType).toHaveBeenCalled();
    });
  });

  describe('Multiple Filters', () => {
    it('handles all filters being inactive', () => {
      const props = {
        ...defaultProps,
        filterBy: { none: '', category: '', type: '' },
      };
      render(<FilterSection {...props} />);

      const noneButton = screen.getByRole('button', { name: 'None' });
      const categoryButton = screen.getByRole('button', { name: /Categories/i });
      const typeButton = screen.getByRole('button', { name: /Types/i });

      expect(noneButton).toHaveClass('bg-white');
      expect(categoryButton).toHaveClass('bg-white');
      expect(typeButton).toHaveClass('bg-white');
    });

    it('handles multiple active filters', () => {
      const props = {
        ...defaultProps,
        filterBy: { none: '', category: 'Vaccine', type: 'Rookie' },
      };
      render(<FilterSection {...props} />);

      const categoryButton = screen.getByRole('button', { name: /Categories/i });
      const typeButton = screen.getByRole('button', { name: /Types/i });

      expect(categoryButton).toHaveClass('bg-blue-700', 'text-white');
      expect(typeButton).toHaveClass('bg-blue-700', 'text-white');
    });
  });

  describe('Dropdown Icons', () => {
    it('renders dropdown icons for Categories button', () => {
      const { container } = render(<FilterSection {...defaultProps} />);

      const categoryButton = screen.getByRole('button', { name: /Categories/i });
      const svg = categoryButton.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('w-2.5', 'h-2.5', 'ms-3');
    });

    it('renders dropdown icons for Types button', () => {
      const { container } = render(<FilterSection {...defaultProps} />);

      const typeButton = screen.getByRole('button', { name: /Types/i });
      const svg = typeButton.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('w-2.5', 'h-2.5', 'ms-3');
    });
  });

  describe('Accessibility', () => {
    it('renders buttons with correct type attribute', () => {
      render(<FilterSection {...defaultProps} />);

      const noneButton = screen.getByRole('button', { name: 'None' });
      expect(noneButton).toHaveAttribute('type', 'button');
    });

    it('renders dropdown buttons with correct type attribute', () => {
      render(<FilterSection {...defaultProps} />);

      const categoryButton = screen.getByRole('button', { name: /Categories/i });
      const typeButton = screen.getByRole('button', { name: /Types/i });

      expect(categoryButton).toHaveAttribute('type', 'button');
      expect(typeButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Dynamic Content', () => {
    it('renders all provided categories', () => {
      const props = { ...defaultProps, isDropdownCategory: true };
      render(<FilterSection {...props} />);

      defaultProps.categories.forEach((category) => {
        expect(screen.getByText(category)).toBeInTheDocument();
      });
    });

    it('renders all provided types', () => {
      const props = { ...defaultProps, isDropdownType: true };
      render(<FilterSection {...props} />);

      defaultProps.types.forEach((type) => {
        expect(screen.getByText(type)).toBeInTheDocument();
      });
    });

    it('handles empty categories array', () => {
      const props = {
        ...defaultProps,
        categories: [],
        isDropdownCategory: true,
      };
      render(<FilterSection {...props} />);

      const dropdown = screen
        .getByRole('button', { name: /Categories/i })
        .parentElement?.querySelector('ul');
      expect(dropdown?.children).toHaveLength(0);
    });

    it('handles empty types array', () => {
      const props = {
        ...defaultProps,
        types: [],
        isDropdownType: true,
      };
      render(<FilterSection {...props} />);

      const dropdown = screen
        .getByRole('button', { name: /Types/i })
        .parentElement?.querySelector('ul');
      expect(dropdown?.children).toHaveLength(0);
    });
  });
});
