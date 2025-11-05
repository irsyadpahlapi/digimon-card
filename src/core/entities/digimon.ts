export interface Content {
  id: number;
  name: string;
  href: string;
  image: string;
}

interface Pageable {
  currentPage: number;
  elementsOnPage: number;
  totalElements: number;
  totalPages: number;
  previousPage: string;
  nextPage: string;
}

interface Image {
  href: string;
  transparent: boolean;
}

interface Level {
  id: number;
  level: string;
}

interface Type {
  id: number;
  type: string;
}

interface Attribute {
  id: number;
  attribute: string;
}

interface Field {
  id: number;
  field: string;
  image: string;
}

interface NextEvolution {
  id: number;
  digimon: string;
  condition: string;
  image: string;
  url: string;
}

interface Description {
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
