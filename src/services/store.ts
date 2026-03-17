import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { authApi } from './auth/api';
import { burgerSlice } from './burger/reducer';
import { ingredientApi } from './ingredient/api';
import { orderApi } from './order/api';
import { selectedIngredientSlice } from './selectedIngredient/reducer';
import { userApi } from './user/api';

const rootReducer = combineSlices(
  authApi,
  ingredientApi,
  selectedIngredientSlice,
  orderApi,
  burgerSlice,
  userApi
);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      ingredientApi.middleware,
      orderApi.middleware,
      userApi.middleware
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
