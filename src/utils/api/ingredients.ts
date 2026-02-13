import { fetchData } from '../fetchData';
import { getErrorMessage } from '../getErrorMessage';

import type { TIngredient } from '../types';

export const fetchIngredients = async (): Promise<TIngredient[]> => {
  try {
    return await fetchData<TIngredient[]>('/ingredients');
  } catch (err) {
    throw new Error(getErrorMessage(err, 'Не удалось получить ингридиенты'));
  }
};
