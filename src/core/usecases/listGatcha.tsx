import { ListGatchaImpl } from '@data/repositories/listGatchaRepository';
import { DetailDigimonRepository } from '@core/repositories/myCardRepository';
import { Category, sellingDigimonPrice, highestLevelFromLevels } from '@/presentation/hooks/utils';

export class ListGatcha {
  private readonly dataImpl: ListGatchaImpl;

  constructor() {
    this.dataImpl = new ListGatchaImpl();
  }

  // Get List Gatcha Digimon
  async getListGacha(select: string): Promise<DetailDigimonRepository[]> {
    const data = await this.dataImpl.getListGacha(select);
    return data.map((item) => {
      const levelName = highestLevelFromLevels(item.levels);
      const category = Category(levelName || '');

      return {
        id: item.id,
        name: item.name,
        images: item.images,
        type: item.types.toSorted((a, b) => b.id - a.id)[0]?.type || '',
        attribute: item.attributes.toSorted((a, b) => b.id - a.id)[0]?.attribute || '',
        fields: item.fields,
        description: item.descriptions.pop()?.description || '',
        nextEvolutions: item.nextEvolutions,
        level: levelName || '',
        isEvolution: false,
        category,
        evolution: 0,
        starterPack: 0,
        total: 0,
        sellingDigimon: sellingDigimonPrice(category, item.nextEvolutions.length > 0),
      };
    });
  }
}
