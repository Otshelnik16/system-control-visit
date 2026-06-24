import { API_URL } from '../constants';

export const api = {
  get: async <T>(url: string): Promise<T> => {
    const response = await fetch(`${API_URL}${url}`);
    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status}`);
    }
    return response.json();
  },
};