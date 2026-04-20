import { describe, expect, it } from 'vitest';

import {
  addIngredient,
  burgerSlice,
  removeIngredient,
  reorderIngredients,
  resetBurger,
  setBun,
} from './reducer';

import type { TIngredient, TIngredientWithUniqueId } from '@/utils/types';

const createIngredient = (overrides: Partial<TIngredient> = {}): TIngredient => ({
  _id: 'ingredient-id',
  name: 'Булка',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 300,
  price: 100,
  image: 'image',
  image_large: 'image-large',
  image_mobile: 'image-mobile',
  __v: 0,
  ...overrides,
});

describe('burgerSlice reducer', () => {
  it('возвращает initial state', () => {
    expect(burgerSlice.reducer(undefined, { type: '' })).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('обрабатывает setBun', () => {
    const bun = createIngredient();

    expect(burgerSlice.reducer(undefined, setBun(bun))).toEqual({
      bun,
      ingredients: [],
    });
  });

  it('обрабатывает addIngredient и добавляет uniqueId', () => {
    const ingredient = createIngredient({ type: 'main', name: 'Котлета' });
    const nextState = burgerSlice.reducer(undefined, addIngredient(ingredient));

    expect(nextState.bun).toBeNull();
    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0]).toMatchObject(ingredient);
    expect(nextState.ingredients[0].uniqueId).toEqual(expect.any(String));
  });

  it('обрабатывает removeIngredient', () => {
    const ingredientA: TIngredientWithUniqueId = {
      ...createIngredient({ _id: 'a', name: 'A', type: 'main' }),
      uniqueId: 'uid-a',
    };
    const ingredientB: TIngredientWithUniqueId = {
      ...createIngredient({ _id: 'b', name: 'B', type: 'main' }),
      uniqueId: 'uid-b',
    };
    const state = {
      bun: null,
      ingredients: [ingredientA, ingredientB],
    };

    expect(burgerSlice.reducer(state, removeIngredient('uid-a'))).toEqual({
      bun: null,
      ingredients: [ingredientB],
    });
  });

  it('обрабатывает reorderIngredients', () => {
    const ingredientA: TIngredientWithUniqueId = {
      ...createIngredient({ _id: 'a', name: 'A', type: 'main' }),
      uniqueId: 'uid-a',
    };
    const ingredientB: TIngredientWithUniqueId = {
      ...createIngredient({ _id: 'b', name: 'B', type: 'main' }),
      uniqueId: 'uid-b',
    };
    const ingredientC: TIngredientWithUniqueId = {
      ...createIngredient({ _id: 'c', name: 'C', type: 'main' }),
      uniqueId: 'uid-c',
    };
    const state = {
      bun: null,
      ingredients: [ingredientA, ingredientB, ingredientC],
    };

    expect(
      burgerSlice.reducer(state, reorderIngredients({ fromIndex: 0, toIndex: 2 }))
    ).toEqual({
      bun: null,
      ingredients: [ingredientB, ingredientC, ingredientA],
    });
  });

  it('обрабатывает resetBurger', () => {
    const state = {
      bun: createIngredient(),
      ingredients: [
        {
          ...createIngredient({ _id: 'x', name: 'X', type: 'main' }),
          uniqueId: 'uid-x',
        },
      ],
    };

    expect(burgerSlice.reducer(state, resetBurger())).toEqual({
      bun: null,
      ingredients: [],
    });
  });
});
