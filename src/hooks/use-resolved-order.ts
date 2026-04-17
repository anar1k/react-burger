import { useGetAllOrdersQuery, useGetOrderByIdQuery } from '@/services/order/api';
import { useMemo } from 'react';

import type { TOrder } from '@/utils/types';

const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

function isObjectId(id: string): boolean {
  return OBJECT_ID_RE.test(id);
}

function isNumericId(id: string): boolean {
  return /^\d+$/.test(id);
}

/**
 * Заказ из локального списка (например, последние 50 с сокета) или запрос к API,
 * если по сокету заказ не пришёл.
 */
export function useResolvedOrder(
  id: string | undefined,
  knownOrders: TOrder[]
): {
  order: TOrder | undefined;
  isLoading: boolean;
} {
  const local = useMemo(() => {
    if (!id) return undefined;
    return knownOrders.find((o) => o._id === id || String(o.number) === id);
  }, [id, knownOrders]);

  const skipById = !id || !!local || !isObjectId(id);
  const byId = useGetOrderByIdQuery(id!, { skip: skipById });

  const needAllOrders = Boolean(id && !local && isNumericId(id));
  const allOrders = useGetAllOrdersQuery(undefined, {
    skip: !needAllOrders,
  });

  const fromAll = useMemo(() => {
    if (!needAllOrders || !allOrders.data || !id) return undefined;
    return allOrders.data.find((o) => String(o.number) === id);
  }, [needAllOrders, allOrders.data, id]);

  const order = local ?? byId.data ?? fromAll;

  const isLoading =
    Boolean(!local && id && isObjectId(id) && (byId.isLoading || byId.isFetching)) ||
    Boolean(needAllOrders && (allOrders.isLoading || allOrders.isFetching));

  return { order, isLoading };
}
