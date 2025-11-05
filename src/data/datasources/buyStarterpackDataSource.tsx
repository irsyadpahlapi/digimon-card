import DigimonAPI from '@data/datasources/digimonDataSource';
import { DetailDigimonEntity } from '@entities/digimon';

export class BuyStarterpack {
  // Get Random Rookies Digimon
  async getListDigimon(type: string): Promise<DetailDigimonEntity> {
    const { getListDigimon, getDigimonById } = new DigimonAPI();
    const ListDataChild = await getListDigimon(type, 100);

    const randomIndex = Math.floor(Math.random() * ListDataChild.content.length);
    let data = await getDigimonById(ListDataChild.content[randomIndex].id);

    return data;
  }

  // Get Random Champion Digimon
  async getListChampion(): Promise<DetailDigimonEntity> {
    const { getListDigimon, getDigimonById } = new DigimonAPI();
    const ListDataAdult = await getListDigimon('Adult', 50);
    const ListDataArmor = await getListDigimon('Armor', 50);
    const ListDataUnknown = await getListDigimon('Unknown', 50);
    const ListDataHybrid = await getListDigimon('Hybrid', 50);

    let ListDataAll = [
      ...ListDataAdult.content,
      ...ListDataArmor.content,
      ...ListDataUnknown.content,
      ...ListDataHybrid.content,
    ];

    const randomIndex = Math.floor(Math.random() * ListDataAll.length);
    let data = await getDigimonById(ListDataAll[randomIndex].id);

    return data;
  }

  async getListGacha(select: string): Promise<DetailDigimonEntity[]> {
    const MyCardSelection: Promise<DetailDigimonEntity>[] = [];
    switch (select) {
      // Starterpack C
      case 'C': {
        [...Array(4)].forEach(() => {
          MyCardSelection.push(this.getListDigimon('Child'));
        });
        MyCardSelection.push(this.getListChampion());
        break;
      }
      // Starterpack B
      case 'B':
        [...Array(2)].forEach(() => {
          MyCardSelection.push(this.getListDigimon('Child'));
        });
        [...Array(2)].forEach(() => {
          MyCardSelection.push(this.getListChampion());
        });
        MyCardSelection.push(this.getListDigimon('Ultimate'));
        break;
      // Starterpack A
      case 'A':
        MyCardSelection.push(this.getListDigimon('Child'));
        [...Array(2)].forEach(() => {
          MyCardSelection.push(this.getListChampion());
        });
        [...Array(2)].forEach(() => {
          MyCardSelection.push(this.getListDigimon('Ultimate'));
        });
        break;
      case 'R':
        MyCardSelection.push(this.getListChampion());
        [...Array(2)].forEach(() => {
          MyCardSelection.push(this.getListDigimon('Ultimate'));
        });
        MyCardSelection.push(this.getListDigimon('Perfect'));
        break;
      default:
        console.log('Starterpack Not Found');
    }

    return Promise.all(MyCardSelection);
  }

  async getDigimonById(id: number): Promise<DetailDigimonEntity> {
    const { getDigimonById } = new DigimonAPI();
    let data = await getDigimonById(id);
    return data;
  }
}
