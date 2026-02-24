import type { RootState } from '../store';
import type { TIngredient } from '@/utils/types';

export const getSelectedIngredient = (state: RootState): TIngredient | null =>
  state.selectedIngredient.ingredient;

export const isIngredientSelected = (state: RootState): boolean =>
  state.selectedIngredient.ingredient !== null;
