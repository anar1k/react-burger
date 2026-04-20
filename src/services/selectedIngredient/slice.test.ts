import { describe, expect, it } from 'vitest';

import { selectedIngredientSlice, setSelectedIngredient } from './reducer';

import type { TIngredient } from '@/utils/types';

const ingredient: TIngredient = {
  _id: 'ingredient-id',
  name: 'Соус',
  type: 'sauce',
  proteins: 1,
  fat: 2,
  carbohydrates: 3,
  calories: 20,
  price: 10,
  image: 'image',
  image_large: 'image-large',
  image_mobile: 'image-mobile',
  __v: 0,
};

describe('selectedIngredientSlice reducer', () => {
  it('возвращает initial state', () => {
    expect(selectedIngredientSlice.reducer(undefined, { type: '' })).toEqual({
      ingredient: null,
    });
  });

  it('обрабатывает setSelectedIngredient', () => {
    expect(
      selectedIngredientSlice.reducer(undefined, setSelectedIngredient(ingredient))
    ).toEqual({
      ingredient,
    });
  });
});
