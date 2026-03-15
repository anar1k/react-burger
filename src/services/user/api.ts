import { baseQueryWithReauth } from '@/utils/api/base-query-with-auth';
import { createApi } from '@reduxjs/toolkit/query/react';

import type { TAuthUser } from '@/services/auth/api';

export type TGetUserResponse = {
  success: boolean;
  user: TAuthUser;
};

export type TUpdateUserRequest = {
  name: string;
  email: string;
  password: string;
};

export type TUpdateUserResponse = {
  success: boolean;
  user: TAuthUser;
};

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getCurrentUser: builder.query<TGetUserResponse, void>({
      query: () => ({ url: '/auth/user' }),
      providesTags: [{ type: 'User', id: 'current' }],
    }),
    updateUser: builder.mutation<TUpdateUserResponse, TUpdateUserRequest>({
      query: (body) => ({
        url: '/auth/user',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result) => (result ? [{ type: 'User', id: 'current' }] : []),
    }),
  }),
  tagTypes: ['User'],
});

export const {
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useUpdateUserMutation,
} = userApi;
