import type { RootState } from '../store';
import type { TIngredient } from '@/utils/types';

export const getBurgerBun = (state: RootState): TIngredient | null => state.burger.bun;

export const getBurgerIngredients = (state: RootState): TIngredient[] =>
  state.burger.ingredients;
