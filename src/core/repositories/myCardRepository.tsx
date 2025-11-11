import type { Image, Field, NextEvolution } from '@/core/entities/digimon';

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
