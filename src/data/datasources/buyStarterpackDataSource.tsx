import DigimonAPI from '@data/datasources/digimonDataSource';
import { DetailDigimonEntity } from '@entities/digimon';

export class BuyStarterpack {
  // Get Random Rookies Digimon
  async getListDigimon(type: string): Promise<DetailDigimonEntity> {
    const { getListDigimon, getDigimonById } = new DigimonAPI();
    const ListDataChild = await getListDigimon(type, 100);

    // Using Math.random for game mechanics (card selection) is acceptable for non-cryptographic purposes
    // This is not used for security-critical operations, only for game randomness
    const randomIndex = Math.floor(Math.random() * ListDataChild.content.length); // NOSONAR
    const data = await getDigimonById(ListDataChild.content[randomIndex].id);

    return data;
  }

  // Get Random Champion Digimon
  async getListChampion(): Promise<DetailDigimonEntity> {
    const { getListDigimon, getDigimonById } = new DigimonAPI();
    const ListDataAdult = await getListDigimon('Adult', 50);
    const ListDataArmor = await getListDigimon('Armor', 50);
    const ListDataUnknown = await getListDigimon('Unknown', 50);
    const ListDataHybrid = await getListDigimon('Hybrid', 50);

    const ListDataAll = [
      ...ListDataAdult.content,
      ...ListDataArmor.content,
      ...ListDataUnknown.content,
      ...ListDataHybrid.content,
    ];

    // Using Math.random for game mechanics (card selection) is acceptable for non-cryptographic purposes
    // This is not used for security-critical operations, only for game randomness
    const randomIndex = Math.floor(Math.random() * ListDataAll.length); // NOSONAR
    const data = await getDigimonById(ListDataAll[randomIndex].id);

    return data;
  }

  async getListGacha(select: string): Promise<DetailDigimonEntity[]> {
    const MyCardSelection: Promise<DetailDigimonEntity>[] = [];
    switch (select) {
      // Starterpack C
      case 'C': {
        for (let i = 0; i < 4; i++) {
          MyCardSelection.push(this.getListDigimon('Child'));
        }
        MyCardSelection.push(this.getListChampion());
        break;
      }
      // Starterpack B
      case 'B':
        for (let i = 0; i < 2; i++) {
          MyCardSelection.push(this.getListDigimon('Child'));
        }
        for (let i = 0; i < 2; i++) {
          MyCardSelection.push(this.getListChampion());
        }
        MyCardSelection.push(this.getListDigimon('Ultimate'));
        break;
      // Starterpack A
      case 'A':
        MyCardSelection.push(this.getListDigimon('Child'));
        for (let i = 0; i < 2; i++) {
          MyCardSelection.push(this.getListChampion());
        }
        for (let i = 0; i < 2; i++) {
          MyCardSelection.push(this.getListDigimon('Ultimate'));
        }
        break;
      case 'R':
        MyCardSelection.push(this.getListChampion());
        for (let i = 0; i < 2; i++) {
          MyCardSelection.push(this.getListDigimon('Ultimate'));
        }
        MyCardSelection.push(this.getListDigimon('Perfect'));
        break;
      default:
        // Starterpack Not Found - return empty array
        break;
    }

    return Promise.all(MyCardSelection);
  }

  async getDigimonById(id: number): Promise<DetailDigimonEntity> {
    const { getDigimonById } = new DigimonAPI();
    const data = await getDigimonById(id);
    return data;
  }
}
