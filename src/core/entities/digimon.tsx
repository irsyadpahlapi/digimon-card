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
