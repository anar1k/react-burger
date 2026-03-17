import { baseQueryWithReauth } from '@/utils/api/base-query-with-auth';
import { createApi } from '@reduxjs/toolkit/query/react';

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
  baseQuery: baseQueryWithReauth,
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
