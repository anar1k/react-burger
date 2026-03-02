import { API_BASE_URL, DEFAULT_HEADERS } from '@/utils/api';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { TGetFetchSuccess, TIngredient } from '@/utils/types';

export const ingredientApi = createApi({
  reducerPath: 'ingredientApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    headers: DEFAULT_HEADERS,
  }),
  endpoints: (builder) => ({
    getIngredients: builder.query<TIngredient[], void>({
      query: () => ({
        url: '/ingredients',
      }),
      transformResponse: (response: TGetFetchSuccess<TIngredient[]>) => response.data,
    }),
  }),
});

export const { useGetIngredientsQuery } = ingredientApi;
