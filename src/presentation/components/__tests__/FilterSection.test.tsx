import { render, screen, fireEvent } from '@testing-library/react';
import FilterSection from '../filterSection';

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

  // Helper to render with prop overrides
  const renderFilter = (overrides = {}) => {
    return render(<FilterSection {...defaultProps} {...overrides} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders filter section with title', () => {
      renderFilter();

      expect(screen.getByText('Filter By')).toBeInTheDocument();
    });

    it('renders None button', () => {
      renderFilter();

      expect(screen.getByRole('button', { name: 'None' })).toBeInTheDocument();
    });

    it('renders Categories button', () => {
      renderFilter();

      expect(screen.getByRole('button', { name: /Categories/i })).toBeInTheDocument();
    });

    it('renders Types button', () => {
      renderFilter();

      expect(screen.getByRole('button', { name: /Types/i })).toBeInTheDocument();
    });
  });

  describe('None Filter Button', () => {
    it('applies active styles when none filter is active', () => {
      renderFilter();

      const noneButton = screen.getByRole('button', { name: 'None' });
      expect(noneButton).toHaveClass('bg-blue-700', 'text-white');
    });

    it('applies inactive styles when none filter is not active', () => {
      renderFilter({ filterBy: { none: '', category: 'Vaccine', type: '' } });

      const noneButton = screen.getByRole('button', { name: 'None' });
      expect(noneButton).toHaveClass('bg-white');
    });

    it('calls onFilterChange when None button is clicked', () => {
      renderFilter();

      const noneButton = screen.getByRole('button', { name: 'None' });
      fireEvent.click(noneButton);

      expect(mockOnFilterChange).toHaveBeenCalledWith('none', 'Active');
    });
  });

  describe('Category Dropdown', () => {
    it('applies active styles when category filter is selected', () => {
      renderFilter({ filterBy: { none: '', category: 'Vaccine', type: '' } });

      const categoryButton = screen.getByRole('button', { name: /Categories/i });
      expect(categoryButton).toHaveClass('bg-blue-700', 'text-white');
    });

    it('toggles category dropdown when Categories button is clicked', () => {
      renderFilter();

      const categoryButton = screen.getByRole('button', { name: /Categories/i });
      fireEvent.click(categoryButton);

      expect(mockOnToggleCategory).toHaveBeenCalled();
    });

    it('renders category options when dropdown is open', () => {
      renderFilter({ isDropdownCategory: true });

      expect(screen.getByText('Vaccine')).toBeInTheDocument();
      expect(screen.getByText('Virus')).toBeInTheDocument();
      expect(screen.getByText('Data')).toBeInTheDocument();
      expect(screen.getByText('Free')).toBeInTheDocument();
    });

    it('does not render category options when dropdown is closed', () => {
      renderFilter();

      expect(screen.queryByText('Vaccine')).not.toBeInTheDocument();
      expect(screen.queryByText('Virus')).not.toBeInTheDocument();
    });

    it('calls onFilterChange and toggles dropdown when category is selected', () => {
      renderFilter({ isDropdownCategory: true });

      const vaccineOption = screen.getByText('Vaccine');
      fireEvent.click(vaccineOption);

      expect(mockOnFilterChange).toHaveBeenCalledWith('category', 'Vaccine');
      expect(mockOnToggleCategory).toHaveBeenCalled();
    });
  });

  describe('Type Dropdown', () => {
    it('applies active styles when type filter is selected', () => {
      renderFilter({ filterBy: { none: '', category: '', type: 'Rookie' } });

      const typeButton = screen.getByRole('button', { name: /Types/i });
      expect(typeButton).toHaveClass('bg-blue-700', 'text-white');
    });

    it('toggles type dropdown when Types button is clicked', () => {
      renderFilter();

      const typeButton = screen.getByRole('button', { name: /Types/i });
      fireEvent.click(typeButton);

      expect(mockOnToggleType).toHaveBeenCalled();
    });

    it('renders type options when dropdown is open', () => {
      renderFilter({ isDropdownType: true });

      expect(screen.getByText('All Categories')).toBeInTheDocument();
      expect(screen.getByText('Rookie')).toBeInTheDocument();
      expect(screen.getByText('Champion')).toBeInTheDocument();
      expect(screen.getByText('Ultimate')).toBeInTheDocument();
    });

    it('does not render type options when dropdown is closed', () => {
      renderFilter();

      expect(screen.queryByText('All Categories')).not.toBeInTheDocument();
      expect(screen.queryByText('Rookie')).not.toBeInTheDocument();
    });

    it('calls onFilterChange and toggles dropdown when type is selected', () => {
      renderFilter({ isDropdownType: true });

      const rookieOption = screen.getByText('Rookie');
      fireEvent.click(rookieOption);

      expect(mockOnFilterChange).toHaveBeenCalledWith('type', 'Rookie');
      expect(mockOnToggleType).toHaveBeenCalled();
    });
  });

  describe('Multiple Filters', () => {
    it('handles all filters being inactive', () => {
      renderFilter({ filterBy: { none: '', category: '', type: '' } });

      const noneButton = screen.getByRole('button', { name: 'None' });
      const categoryButton = screen.getByRole('button', { name: /Categories/i });
      const typeButton = screen.getByRole('button', { name: /Types/i });

      expect(noneButton).toHaveClass('bg-white');
      expect(categoryButton).toHaveClass('bg-white');
      expect(typeButton).toHaveClass('bg-white');
    });

    it('handles multiple active filters', () => {
      renderFilter({ filterBy: { none: '', category: 'Vaccine', type: 'Rookie' } });

      const categoryButton = screen.getByRole('button', { name: /Categories/i });
      const typeButton = screen.getByRole('button', { name: /Types/i });

      expect(categoryButton).toHaveClass('bg-blue-700', 'text-white');
      expect(typeButton).toHaveClass('bg-blue-700', 'text-white');
    });
  });

  describe('Dropdown Icons', () => {
    it('renders dropdown icons for Categories button', () => {
      renderFilter();

      const categoryButton = screen.getByRole('button', { name: /Categories/i });
      const svg = categoryButton.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('w-2.5', 'h-2.5', 'ms-3');
    });

    it('renders dropdown icons for Types button', () => {
      renderFilter();

      const typeButton = screen.getByRole('button', { name: /Types/i });
      const svg = typeButton.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('w-2.5', 'h-2.5', 'ms-3');
    });
  });

  describe('Accessibility', () => {
    it('renders buttons with correct type attribute', () => {
      renderFilter();

      const noneButton = screen.getByRole('button', { name: 'None' });
      expect(noneButton).toHaveAttribute('type', 'button');
    });

    it('renders dropdown buttons with correct type attribute', () => {
      renderFilter();

      const categoryButton = screen.getByRole('button', { name: /Categories/i });
      const typeButton = screen.getByRole('button', { name: /Types/i });

      expect(categoryButton).toHaveAttribute('type', 'button');
      expect(typeButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Dynamic Content', () => {
    it('renders all provided categories', () => {
      renderFilter({ isDropdownCategory: true });

      for (const category of defaultProps.categories) {
        expect(screen.getByText(category)).toBeInTheDocument();
      }
    });

    it('renders all provided types', () => {
      renderFilter({ isDropdownType: true });

      for (const type of defaultProps.types) {
        expect(screen.getByText(type)).toBeInTheDocument();
      }
    });

    it('handles empty categories array', () => {
      renderFilter({ categories: [], isDropdownCategory: true });

      const dropdown = screen
        .getByRole('button', { name: /Categories/i })
        .parentElement?.querySelector('ul');
      expect(dropdown?.children).toHaveLength(0);
    });

    it('handles empty types array', () => {
      renderFilter({ types: [], isDropdownType: true });

      const dropdown = screen
        .getByRole('button', { name: /Types/i })
        .parentElement?.querySelector('ul');
      expect(dropdown?.children).toHaveLength(0);
    });
  });
});
