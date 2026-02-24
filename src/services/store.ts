import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { ingredientsApi } from './ingredients/api';
import { selectedIngredientSlice } from './selectedIngredient/reducer';

const rootReducer = combineSlices(ingredientsApi, selectedIngredientSlice);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ingredientsApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
