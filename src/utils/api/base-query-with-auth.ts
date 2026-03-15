import { fetchBaseQuery } from '@reduxjs/toolkit/query';

import { getAccessToken, refreshToken } from './auth-tokens';
import { API_BASE_URL, DEFAULT_HEADERS } from './index';

import type { BaseQueryFn } from '@reduxjs/toolkit/query';

type BaseQueryArgs = Parameters<ReturnType<typeof fetchBaseQuery>>[0];

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    Object.assign(headers, DEFAULT_HEADERS);
    const token = getAccessToken();
    if (token) headers.set('authorization', token);
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<BaseQueryArgs, unknown, unknown> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
