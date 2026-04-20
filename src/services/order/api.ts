import { API_BASE_URL, DEFAULT_HEADERS } from '@/utils/api';
import { getAccessTokenPlainForWs, refreshToken } from '@/utils/api/auth-tokens';
import { baseQueryWithReauth } from '@/utils/api/base-query-with-auth';
import { normalizeOrderFromSocket } from '@/utils/normalize-ws-order';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { TOrder } from '@/utils/types';

const WS_ORDERS_ALL = 'wss://new-stellarburgers.education-services.ru/orders/all';
const WS_ORDERS_USER_BASE = 'wss://new-stellarburgers.education-services.ru/orders';

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

type TGetOrderByIdResponse = {
  success: boolean;
  order: TOrder;
};

type TGetAllOrdersResponse = {
  success: boolean;
  orders: TOrder[];
};

type WsOrdersPayload = {
  success?: boolean;
  message?: string;
  orders?: TOrder[];
  total?: number;
  totalToday?: number;
};

const publicOrderBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  headers: DEFAULT_HEADERS,
});

/** Снимок ленты из WebSocket: при каждом сообщении сервер присылает полный список заказов. */
export type OrdersFeedSnapshot = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  /** Первое успешное сообщение сокета (для прелоадера до прихода данных). */
  hydrated: boolean;
};

function emptyFeedSnapshot(): OrdersFeedSnapshot {
  return { orders: [], total: 0, totalToday: 0, hydrated: false };
}

function isInvalidUserTokenPayload(data: WsOrdersPayload): boolean {
  const msg = data.message;
  return typeof msg === 'string' && msg.includes('Invalid or missing token');
}

function applyWsPayloadToDraft(
  draft: OrdersFeedSnapshot,
  payload: WsOrdersPayload
): void {
  if (!payload.success || !Array.isArray(payload.orders)) return;
  draft.orders = payload.orders.map((o) => normalizeOrderFromSocket(o));
  draft.total = typeof payload.total === 'number' ? payload.total : 0;
  draft.totalToday = typeof payload.totalToday === 'number' ? payload.totalToday : 0;
  draft.hydrated = true;
}

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    /**
     * POST /orders: на стенде у бэкенда может быть задержка ~15 с (эмуляция приготовления);
     * актуальный статус заказа (created → pending → done) приходит в общую ленту по WebSocket.
     */
    createOrder: builder.mutation<OrderResponse, OrderRequest>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
    }),
    getOrderById: builder.query<TOrder, string>({
      queryFn: async (id, _api, _extraOptions, baseQuery) => {
        const result = await baseQuery({
          url: `/orders/${id}`,
        });
        if (result.error) return { error: result.error };
        const data = result.data as TGetOrderByIdResponse;
        if (!data?.success || !data.order) {
          return { error: { status: 404, data: 'Order not found' } };
        }
        return { data: data.order };
      },
    }),
    getAllOrders: builder.query<TOrder[], void>({
      queryFn: async (_arg, _api, _extraOptions) => {
        const result = await publicOrderBaseQuery(
          { url: '/orders/all', method: 'GET' },
          _api,
          _extraOptions
        );
        if (result.error) return { error: result.error };
        const data = result.data as TGetAllOrdersResponse;
        if (!data?.success || !Array.isArray(data.orders)) {
          return { error: { status: 500, data: 'Invalid response' } };
        }
        return { data: data.orders };
      },
    }),
    /** Потоковая подписка: полная замена списка при каждом сообщении сокета `/orders/all`. */
    subscribeAllOrdersFeed: builder.query<OrdersFeedSnapshot, void>({
      queryFn: () => ({ data: emptyFeedSnapshot() }),
      async onCacheEntryAdded(_arg, lifecycleApi) {
        const { cacheDataLoaded, cacheEntryRemoved, updateCachedData } = lifecycleApi;
        await cacheDataLoaded;

        let socket: WebSocket | null = null;
        let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
        let cancelled = false;

        const clearTimer = (): void => {
          if (reconnectTimer !== undefined) {
            clearTimeout(reconnectTimer);
            reconnectTimer = undefined;
          }
        };

        const closeSocket = (): void => {
          clearTimer();
          socket?.close();
          socket = null;
        };

        const connect = (): void => {
          if (cancelled) return;
          closeSocket();
          const ws = new WebSocket(WS_ORDERS_ALL);
          socket = ws;

          ws.onmessage = (event: MessageEvent<string>): void => {
            try {
              const data = JSON.parse(event.data) as WsOrdersPayload;
              updateCachedData((draft) => {
                applyWsPayloadToDraft(draft, data);
              });
            } catch {
              /* некорректное сообщение */
            }
          };

          ws.onclose = (): void => {
            socket = null;
            if (!cancelled) {
              reconnectTimer = setTimeout(connect, 3000);
            }
          };
        };

        connect();

        try {
          await cacheEntryRemoved;
        } finally {
          cancelled = true;
          closeSocket();
        }
      },
    }),
    /** Потоковая подписка: персональная лента `orders?token=` (токен без Bearer). */
    subscribeUserOrdersFeed: builder.query<OrdersFeedSnapshot, void>({
      queryFn: () => ({ data: emptyFeedSnapshot() }),
      async onCacheEntryAdded(_arg, lifecycleApi) {
        const { cacheDataLoaded, cacheEntryRemoved, updateCachedData } = lifecycleApi;
        await cacheDataLoaded;

        let socket: WebSocket | null = null;
        let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
        let cancelled = false;
        let reconnectImmediatelyAfterClose = false;

        const clearTimer = (): void => {
          if (reconnectTimer !== undefined) {
            clearTimeout(reconnectTimer);
            reconnectTimer = undefined;
          }
        };

        const closeSocket = (): void => {
          clearTimer();
          socket?.close();
          socket = null;
        };

        const connect = (): void => {
          if (cancelled) return;
          const token = getAccessTokenPlainForWs();
          if (!token) return;

          closeSocket();
          const url = `${WS_ORDERS_USER_BASE}?token=${encodeURIComponent(token)}`;
          const ws = new WebSocket(url);
          socket = ws;

          ws.onmessage = (event: MessageEvent<string>): void => {
            try {
              const data = JSON.parse(event.data) as WsOrdersPayload;

              if (isInvalidUserTokenPayload(data)) {
                void (async (): Promise<void> => {
                  const refreshed = await refreshToken();
                  if (refreshed && !cancelled) {
                    reconnectImmediatelyAfterClose = true;
                    closeSocket();
                  }
                })();
                return;
              }

              updateCachedData((draft) => {
                applyWsPayloadToDraft(draft, data);
              });
            } catch {
              /* некорректное сообщение */
            }
          };

          ws.onclose = (): void => {
            socket = null;
            if (cancelled) return;
            if (reconnectImmediatelyAfterClose) {
              reconnectImmediatelyAfterClose = false;
              reconnectTimer = setTimeout(connect, 0);
              return;
            }
            if (getAccessTokenPlainForWs()) {
              reconnectTimer = setTimeout(connect, 3000);
            }
          };
        };

        connect();

        try {
          await cacheEntryRemoved;
        } finally {
          cancelled = true;
          closeSocket();
        }
      },
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useGetAllOrdersQuery,
  useSubscribeAllOrdersFeedQuery,
  useSubscribeUserOrdersFeedQuery,
} = orderApi;
