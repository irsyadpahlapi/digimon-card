import { ListGatchaImpl } from '@data/repositories/listGatchaRepository';
import { DetailDigimonRepository } from '@core/repositories/myCardRepository';
import { Category, sellingDigimonPrice } from '@/presentation/hooks/utils';

export class ListGatcha {
  private readonly dataImpl: ListGatchaImpl;

  constructor() {
    this.dataImpl = new ListGatchaImpl();
  }

  // Get List Gatcha Digimon
  async getListGacha(select: string): Promise<DetailDigimonRepository[]> {
    const data = await this.dataImpl.getListGacha(select);
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      images: item.images,
      type: item.types.sort((a, b) => b.id - a.id)[0]?.type || '',
      attribute: item.attributes.sort((a, b) => b.id - a.id)[0]?.attribute || '',
      fields: item.fields,
      description: item.descriptions.pop()?.description || '',
      nextEvolutions: item.nextEvolutions,
      level: item.levels.sort((a, b) => b.id - a.id)[0].level || '',
      isEvolution: false,
      category: Category(item.levels.sort((a, b) => b.id - a.id)[0]?.level || ''),
      evolution: 0,
      starterPack: 0,
      total: 0,
      sellingDigimon: sellingDigimonPrice(
        Category(item.levels.sort((a, b) => b.id - a.id)[0]?.level || ''),
        item.nextEvolutions.length > 0,
      ),
    }));
  }
}
