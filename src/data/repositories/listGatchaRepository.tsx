import { BuyStarterpack } from '@data/datasources/buyStarterpackDataSource';
import { DetailDigimonEntity } from '@/core/entities/digimon.d';

export class ListGatchaImpl {
  private readonly datasource: BuyStarterpack;

  constructor() {
    this.datasource = new BuyStarterpack();
  }

  async getListGacha(select: string): Promise<DetailDigimonEntity[]> {
    return this.datasource.getListGacha(select);
  }
}
