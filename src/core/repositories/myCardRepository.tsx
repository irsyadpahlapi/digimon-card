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

export interface DetailDigimonRepository {
  id: number;
  name: string;
  images: Image[];
  level: string;
  type: string;
  attribute: string;
  fields: Field[];
  description: string;
  nextEvolutions: NextEvolution[];
  isEvolution: boolean;
  evolution: number;
  starterPack: number;
  total: number;
  category: string;
  sellingDigimon: number;
}
