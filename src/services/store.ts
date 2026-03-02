import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { burgerSlice } from './burger/reducer';
import { ingredientApi } from './ingredient/api';
import { orderApi } from './order/api';
import { selectedIngredientSlice } from './selectedIngredient/reducer';

const rootReducer = combineSlices(
  ingredientApi,
  selectedIngredientSlice,
  orderApi,
  burgerSlice
);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ingredientApi.middleware, orderApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
