import { ListDigimonEntity, DetailDigimonEntity } from '@/core/entities/digimon.d';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://digi-api.com/api/v1/digimon';
const API_TIMEOUT = 10000; // 10 seconds timeout

class DigimonAPI {
  /**
   * Fetch with timeout and error handling
   */
  private async fetchWithTimeout(url: string, timeout = API_TIMEOUT): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please try again');
        }
        throw new Error(`Failed to fetch: ${error.message}`);
      }

      throw new Error('An unknown error occurred');
    }
  }

  /**
   * Validate and sanitize API response
   */
  private validateResponse(data: unknown): boolean {
    return data !== null && typeof data === 'object';
  }

  /* Get List Digimon by level */
  async getListDigimon(level: string, pageSize?: number): Promise<ListDigimonEntity> {
    const params = new URLSearchParams();

    if (level) params.append('level', level);
    if (pageSize !== undefined) params.append('pageSize', pageSize.toString());

    const url = `${API_BASE_URL}?${params.toString()}`;

    try {
      const response = await this.fetchWithTimeout(url);
      const data = await response.json();

      if (!this.validateResponse(data)) {
        throw new Error('Invalid response format');
      }

      return data;
    } catch (error) {
      console.error('Error fetching Digimon list:', error);
      throw error;
    }
  }

  /* Get Digimon by id*/
  async getDigimonById(id: number): Promise<DetailDigimonEntity> {
    // Validate ID is a positive integer
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid Digimon ID');
    }

    const url = `${API_BASE_URL}/${id}`;

    try {
      const response = await this.fetchWithTimeout(url);
      const data = await response.json();

      if (!this.validateResponse(data)) {
        throw new Error('Invalid response format');
      }

      delete data.priorEvolutions;
      return data;
    } catch (error) {
      console.error(`Error fetching Digimon #${id}:`, error);
      throw error;
    }
  }
}

export default DigimonAPI;
