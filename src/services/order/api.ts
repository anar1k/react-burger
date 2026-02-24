import { API_BASE_URL, DEFAULT_HEADERS } from '@/utils/api';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type OrderResponse = {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
};

type OrderRequest = {
  ingredients: string[];
};

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    headers: DEFAULT_HEADERS,
  }),
  endpoints: (builder) => ({
    createOrder: builder.mutation<OrderResponse, OrderRequest>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
    }),
  }),
});

export const { useCreateOrderMutation } = orderApi;
