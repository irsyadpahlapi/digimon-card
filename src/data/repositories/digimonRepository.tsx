import { BuyStarterpack } from '@data/datasources/buyStarterpackDataSource';
import { DetailDigimonEntity } from '@entities/digimon';

export class DigimonImpl {
  private readonly datasource: BuyStarterpack;

  constructor() {
    this.datasource = new BuyStarterpack();
  }

  async getDigimonById(id: number): Promise<DetailDigimonEntity> {
    return this.datasource.getDigimonById(id);
  }
}
