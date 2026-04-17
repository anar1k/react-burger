import type { TOrder } from '@/utils/types';

/** Нормализация заказа из WebSocket (общая для ленты и истории). */
export function normalizeOrderFromSocket(raw: TOrder): TOrder {
  return {
    ...raw,
    _id: raw._id?.trim() ? raw._id : `ws-${raw.number}-${raw.updatedAt}`,
    name: raw.name?.trim() ? raw.name : 'Без названия',
    ingredients: Array.isArray(raw.ingredients) ? raw.ingredients : [],
    status: raw.status ?? 'created',
    createdAt: raw.createdAt ?? '',
    updatedAt: raw.updatedAt ?? '',
    number: typeof raw.number === 'number' ? raw.number : Number(raw.number) || 0,
  };
}
