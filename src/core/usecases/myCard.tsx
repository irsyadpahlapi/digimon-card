import { DetailDigimonRepository } from '@/core/repositories/myCardRepository.d';
import { DigimonImpl } from '@/data/repositories/digimonRepository';
import { Category, sellingDigimonPrice, highestLevelFromLevels } from '@/presentation/hooks/utils';

export class ListMyCard {
  private readonly dataImpl: DigimonImpl;

  constructor() {
    this.dataImpl = new DigimonImpl();
  }
  getListMyCard(
    datas: DetailDigimonRepository[],
    filterCategory?: string,
    filterType?: string,
  ): DetailDigimonRepository[] {
    const filtered = this.filterDigimons(datas, filterCategory, filterType);
    const groupedMap = this.groupDigimons(filtered);
    return Array.from(groupedMap.values()).reverse();
  }

  private filterDigimons(
    datas: DetailDigimonRepository[],
    filterCategory?: string,
    filterType?: string,
  ): DetailDigimonRepository[] {
    return datas.filter((data) => {
      if (filterCategory && data.category !== filterCategory) return false;
      if (filterType && data.type?.toLowerCase() !== filterType.toLowerCase()) return false;
      return true;
    });
  }

  private groupDigimons(datas: DetailDigimonRepository[]): Map<number, DetailDigimonRepository> {
    const groupedMap = new Map<number, DetailDigimonRepository>();

    for (const data of datas) {
      const existing = groupedMap.get(data.id);
      this.updateGroupedDigimon(groupedMap, data, existing);
    }

    return groupedMap;
  }

  private updateGroupedDigimon(
    groupedMap: Map<number, DetailDigimonRepository>,
    data: DetailDigimonRepository,
    existing?: DetailDigimonRepository,
  ): void {
    const addEvolution = data.isEvolution ? 1 : 0;
    const addStarter = data.isEvolution ? 0 : 1;

    if (existing) {
      groupedMap.set(data.id, {
        ...existing,
        total: (existing.total ?? 0) + 1,
        evolution: (existing.evolution ?? 0) + addEvolution,
        starterPack: (existing.starterPack ?? 0) + addStarter,
      });
    } else {
      groupedMap.set(data.id, {
        ...data,
        total: 1,
        evolution: (data.evolution ?? 0) + addEvolution,
        starterPack: (data.starterPack ?? 0) + addStarter,
      });
    }
  }

  sellDigimon(listDigimons: DetailDigimonRepository[], id: number) {
    let hasRemoved = false;
    return listDigimons.filter((item) => {
      // Jika ID cocok dan belum ada yang dihapus, hapus item ini
      if (item.id === id && !hasRemoved) {
        hasRemoved = true;
        return false; // hapus item
      }
      return true; // simpan item
    });
  }

  async digimonEvolution(
    listDigimons: DetailDigimonRepository[],
    id: number,
    NextEvolution: number,
  ): Promise<DetailDigimonRepository[]> {
    let removedCount = 0;
    const listCard = listDigimons.filter((item) => {
      if (item.id === id && removedCount < 3) {
        removedCount++;
        return false; // hapus item
      }
      return true; // simpan item
    });
    const dataEvolution = await this.dataImpl.getDigimonById(NextEvolution);

    const levelName = highestLevelFromLevels(dataEvolution.levels);
    const category = Category(levelName || '');
    const sortedTypes = dataEvolution.types.toSorted((a, b) => b.id - a.id);
    const sortedAttributes = dataEvolution.attributes.toSorted((a, b) => b.id - a.id);

    listCard.push({
      id: dataEvolution.id,
      name: dataEvolution.name,
      images: dataEvolution.images,
      type: sortedTypes[0]?.type || '',
      attribute: sortedAttributes[0]?.attribute || '',
      fields: dataEvolution.fields,
      description: dataEvolution.descriptions.at(-1)?.description || '',
      nextEvolutions: dataEvolution.nextEvolutions,
      level: levelName || '',
      isEvolution: true,
      category: category,
      evolution: 0,
      starterPack: 0,
      total: 0,
      sellingDigimon: sellingDigimonPrice(category, dataEvolution.nextEvolutions.length > 0),
    });

    return listCard;
  }
}
