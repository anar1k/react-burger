import { createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from '@/utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

type ISelectedIngredientState = {
  ingredient: TIngredient | null;
};

const initialState: ISelectedIngredientState = {
  ingredient: null,
};

export const selectedIngredientSlice = createSlice({
  name: 'selectedIngredient',
  initialState,
  reducers: {
    setSelectedIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.ingredient = action.payload;
    },
    clearSelectedIngredient: (state) => {
      state.ingredient = null;
    },
  },
});

export const { setSelectedIngredient, clearSelectedIngredient } =
  selectedIngredientSlice.actions;
