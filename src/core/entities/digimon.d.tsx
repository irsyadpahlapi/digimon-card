import { DetailDigimonRepository } from '@/core/repositories/myCardRepository.d';
import { ProfileRepository } from '@/core/repositories/profile.d';
export type Size = 'sm' | 'md' | 'lg';
export interface Content {
  id: number;
  name: string;
  href: string;
  image: string;
}

export interface Pageable {
  currentPage: number;
  elementsOnPage: number;
  totalElements: number;
  totalPages: number;
  previousPage: string;
  nextPage: string;
}

export interface Image {
  href: string;
  transparent: boolean;
}

export interface Level {
  id: number;
  level: string;
}

export interface Type {
  id: number;
  type: string;
}

export interface Attribute {
  id: number;
  attribute: string;
}

export interface Field {
  id: number;
  field: string;
  image: string;
}

export interface NextEvolution {
  id: number;
  digimon: string;
  condition: string;
  image: string;
  url: string;
}

export interface Description {
  origin: string;
  language: string;
  description: string;
}

export interface ListDigimonEntity {
  content: Content[];
  pageable: Pageable;
}

export interface DetailDigimonEntity {
  id: number;
  name: string;
  images: Image[];
  levels: Level[];
  types: Type[];
  attributes: Attribute[];
  fields: Field[];
  descriptions: Description[];
  nextEvolutions: NextEvolution[];
  level: Level;
}

export interface EmptyStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly actionText?: string;
  readonly totalPacks?: number;
  readonly cardsPerPack?: string;
  readonly userCoins?: number;
}

export interface FilterSectionProps {
  readonly filterBy: {
    readonly none: string;
    readonly category: string;
    readonly type: string;
  };
  readonly isDropdownCategory: boolean;
  readonly isDropdownType: boolean;
  readonly categories: readonly string[];
  readonly types: readonly string[];
  readonly onFilterChange: (key: string, value: string) => void;
  readonly onToggleCategory: () => void;
  readonly onToggleType: () => void;
}

export interface HeaderProps {
  readonly userName?: string;
  readonly title: string;
  readonly coins?: number;
  readonly showCoins?: boolean;
}

export interface ToastProps {
  readonly message: string;
  readonly type?: 'success' | 'error' | 'info';
  readonly isVisible: boolean;
  readonly onClose: () => void;
  readonly duration?: number;
}

export interface CardProps {
  readonly item: DetailDigimonRepository;
  readonly onClick?: () => void;
}

export interface CardDetailModalProps {
  item: DetailDigimonRepository | null;
  isOpen: boolean;
  onClose: () => void;
  onEvolve: (id: number, nextEvolution: number) => void;
  onSell: (index: number, coin: number) => void;
  evolvingToId?: number | null; // Track which specific evolution is loading
  isSelling?: boolean;
}

export interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: Size;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  loadingText?: string;
}

export interface AuthRedirectScreenProps {
  variant?: 'toHome' | 'toLogin';
  className?: string;
}

export interface FormInputProps {
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export interface GradientBackgroundProps {
  variant: 'homepage' | 'login';
  children: React.ReactNode;
  className?: string;
}

export interface LoadingSpinnerProps {
  size?: Size;
  color?: 'white' | 'primary' | 'orange';
  className?: string;
}

export interface LogoBrandProps {
  title?: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  size?: Size;
  className?: string;
}

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  profile: ProfileRepository | null;
}
