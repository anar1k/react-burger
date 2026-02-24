import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

import type { TIngredient, TIngredientWithUniqueId } from '@/utils/types';

type IBurgerState = {
  bun: TIngredient | null;
  ingredients: TIngredientWithUniqueId[];
};

const initialState: IBurgerState = {
  bun: null,
  ingredients: [],
};

export const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    setBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },

    addIngredient: {
      reducer: (state, action: PayloadAction<TIngredientWithUniqueId>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          uniqueId: nanoid(),
        },
      }),
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.uniqueId !== action.payload
      );
    },
  },
});

export const { addIngredient, removeIngredient, setBun } = burgerSlice.actions;
