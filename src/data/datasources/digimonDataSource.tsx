import { ListDigimonEntity, DetailDigimonEntity } from '@entities/digimon';

class DigimonAPI {
  /* Get List Digimon by level */
  async getListDigimon(level: string, pageSize?: number): Promise<ListDigimonEntity> {
    const params = new URLSearchParams();

    if (level) params.append('level', level);
    if (pageSize !== undefined) params.append('pageSize', pageSize.toString());

    const url = `https://digi-api.com/api/v1/digimon?${params.toString()}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  /* Get Digimon by id*/
  async getDigimonById(id: number): Promise<DetailDigimonEntity> {
    const url = `https://digi-api.com/api/v1/digimon/${id}`;
    const response = await fetch(url);
    const data = await response.json();
    delete data.priorEvolutions;
    return data;
  }
}

export default DigimonAPI;
