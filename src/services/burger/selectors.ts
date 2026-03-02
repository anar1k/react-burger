import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { TIngredient, TIngredientWithUniqueId } from '@/utils/types';

export const getBurgerBun = (state: RootState): TIngredient | null => state.burger.bun;

export const getBurgerIngredients = (state: RootState): TIngredientWithUniqueId[] =>
  state.burger.ingredients;

export const getIngredientsCount = createSelector(
  [getBurgerBun, getBurgerIngredients],
  (bun, ingredients): Record<string, number> => {
    const counts: Record<string, number> = {};

    if (bun) counts[bun._id] = 2;

    ingredients.forEach((ingredient) => {
      counts[ingredient._id] = (counts[ingredient._id] || 0) + 1;
    });

    return counts;
  }
);
