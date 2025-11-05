import { DetailDigimonRepository } from '@core/repositories/myCardRepository';
import { DigimonImpl } from '@/data/repositories/digimonRepository';
import { Category, sellingDigimonPrice } from '@/presentation/hooks/utils';

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
    const groupedMap = new Map<number, DetailDigimonRepository>();

    datas.forEach((data) => {
      if (filterCategory && data.category !== filterCategory) return;

      // Filter berdasarkan types (bisa lebih dari satu)
      if (filterType && data.type?.toLowerCase() !== filterType.toLowerCase()) return;

      const existing = groupedMap.get(data.id);

      if (existing) {
        // Jika sudah ada, tambahkan total
        groupedMap.set(data.id, {
          ...data,
          total: existing.total + 1,
          evolution: existing.isEvolution ? existing.evolution + 1 : existing.evolution,
          starterPack: !existing.isEvolution ? existing.starterPack + 1 : existing.starterPack,
        });
      } else {
        // Jika belum ada, buat data baru dengan total = 1
        groupedMap.set(data.id, {
          ...data,
          total: 1,
          evolution: data.isEvolution ? data.evolution + 1 : data.evolution,
          starterPack: !data.isEvolution ? data.starterPack + 1 : data.starterPack,
        });
      }
    });

    // Ubah hasil Map menjadi array
    return Array.from(groupedMap.values());
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
    let dataEvolution = await this.dataImpl.getDigimonById(NextEvolution);

    listCard.push({
      id: dataEvolution.id,
      name: dataEvolution.name,
      images: dataEvolution.images,
      type: dataEvolution.types.sort((a, b) => b.id - a.id)[0]?.type || '',
      attribute: dataEvolution.attributes.sort((a, b) => b.id - a.id)[0]?.attribute || '',
      fields: dataEvolution.fields,
      description:
        dataEvolution.descriptions[dataEvolution.descriptions.length - 1]?.description || '',
      nextEvolutions: dataEvolution.nextEvolutions,
      level: dataEvolution.levels.sort((a, b) => b.id - a.id)[0]?.level || '',
      isEvolution: true,
      category: Category(dataEvolution.levels.sort((a, b) => b.id - a.id)[0]?.level || ''),
      evolution: 0,
      starterPack: 0,
      total: 0,
      sellingDigimon: sellingDigimonPrice(
        Category(dataEvolution.levels.sort((a, b) => b.id - a.id)[0]?.level || ''),
        dataEvolution.nextEvolutions.length > 0,
      ),
    });

    return listCard;
  }
}
