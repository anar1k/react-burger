import type { TOrder } from '@/utils/types';

/** Тестовые заказы ленты (до подключения WebSocket). */
export const MOCK_FEED_ORDERS: TOrder[] = [
  {
    _id: '69e2661f41cff5001b6e206b',
    ingredients: [
      '692889f16bf770001bfeb4cd',
      '692889f16bf770001bfeb4d2',
      '692889f16bf770001bfeb4cd',
    ],
    status: 'done',
    name: 'Флюоресцентный spicy бургер',
    createdAt: '2026-04-17T16:55:59.302Z',
    updatedAt: '2026-04-17T16:55:59.321Z',
    number: 617,
  },
  {
    _id: '69e260fe41cff5001b6e2069',
    ingredients: [
      '692889f16bf770001bfeb4cc',
      '692889f16bf770001bfeb4d3',
      '692889f16bf770001bfeb4cc',
    ],
    status: 'done',
    name: 'Краторный space бургер',
    createdAt: '2026-04-17T16:34:06.634Z',
    updatedAt: '2026-04-17T16:34:06.650Z',
    number: 616,
  },
  {
    _id: '69e260f041cff5001b6e2068',
    ingredients: [
      '692889f16bf770001bfeb4cd',
      '692889f16bf770001bfeb4d2',
      '692889f16bf770001bfeb4cd',
    ],
    status: 'pending',
    name: 'Флюоресцентный spicy бургер',
    createdAt: '2026-04-17T16:33:52.696Z',
    updatedAt: '2026-04-17T16:33:52.714Z',
    number: 615,
  },
];

/** История заказов в профиле (тестовые данные). */
export const MOCK_PROFILE_ORDERS: TOrder[] = [
  MOCK_FEED_ORDERS[0],
  MOCK_FEED_ORDERS[1],
  {
    _id: '69e21d7d41cff5001b6e205f',
    ingredients: [
      '692889f16bf770001bfeb4cd',
      '692889f16bf770001bfeb4d3',
      '692889f16bf770001bfeb4cd',
    ],
    status: 'done',
    name: 'Флюоресцентный space бургер',
    createdAt: '2026-04-17T11:46:05.418Z',
    updatedAt: '2026-04-17T11:46:05.439Z',
    number: 614,
  },
];
