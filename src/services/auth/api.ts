import { API_BASE_URL, DEFAULT_HEADERS } from '@/utils/api';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type TAuthUser = {
  email: string;
  name: string;
};

export type TRegisterRequest = {
  email: string;
  password: string;
  name: string;
};

export type TLoginRequest = {
  email: string;
  password: string;
};

export type TAuthSuccessResponse = {
  success: true;
  user: TAuthUser;
  accessToken: string;
  refreshToken: string;
};

export type TLoginSuccessResponse = {
  success: true;
  user: TAuthUser;
  accessToken: string;
  refreshToken: string;
};

export type TLogoutResponse = {
  success: boolean;
  message?: string;
};

export type TForgotPasswordRequest = { email: string };
export type TForgotPasswordResponse = { success: boolean; message?: string };

export type TResetPasswordRequest = { password: string; token: string };
export type TResetPasswordResponse = { success: boolean; message?: string };

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  headers: DEFAULT_HEADERS,
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    register: builder.mutation<TAuthSuccessResponse, TRegisterRequest>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation<TLoginSuccessResponse, TLoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation<TLogoutResponse, { token: string }>({
      query: (body) => ({
        url: '/auth/logout',
        method: 'POST',
        body,
      }),
    }),
    forgotPassword: builder.mutation<TForgotPasswordResponse, TForgotPasswordRequest>({
      query: (body) => ({
        url: '/password-reset',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<TResetPasswordResponse, TResetPasswordRequest>({
      query: (body) => ({
        url: '/password-reset/reset',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
