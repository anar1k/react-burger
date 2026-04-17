import { useGetIngredientsQuery } from '@/services/ingredient/api';
import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import type { TOrder } from '@/utils/types';

import styles from './order-info.module.css';

const STATUS_LABEL: Record<string, string> = {
  done: 'Выполнен',
  pending: 'Готовится',
  created: 'Создан',
  canceled: 'Отменён',
};

function getStatusLabel(status: string): string {
  return STATUS_LABEL[status] ?? status;
}

type OrderInfoProps = {
  order: TOrder;
};

export const OrderInfo = ({ order }: OrderInfoProps): React.JSX.Element => {
  const { data: ingredients = [] } = useGetIngredientsQuery();

  const { total, rows } = useMemo(() => {
    const map = new Map<string, number>();
    for (const ingId of order.ingredients) {
      map.set(ingId, (map.get(ingId) ?? 0) + 1);
    }
    let sum = 0;
    for (const [ingId, count] of map) {
      const ing = ingredients.find((i) => i._id === ingId);
      if (ing) sum += ing.price * count;
    }
    const orderedIds: string[] = [];
    const seen = new Set<string>();
    for (const ingId of order.ingredients) {
      if (!seen.has(ingId)) {
        seen.add(ingId);
        orderedIds.push(ingId);
      }
    }
    const lineRows = orderedIds.map((ingId) => ({
      ingId,
      count: map.get(ingId) ?? 0,
    }));
    return { total: sum, rows: lineRows };
  }, [order.ingredients, ingredients]);

  return (
    <div className={styles.wrap}>
      <div className={styles.center}>
        <div
          className={`text text_type_digits-default ${styles.number}`}
        >{`#${String(order.number).padStart(6, '0')}`}</div>

        <div className={`text text_type_main-medium ${styles.name}`}>
          {order.name ?? 'Без названия'}
        </div>

        <div
          className={`text text_type_main-default ${styles.status} ${
            order.status === 'done' ? styles.status_done : ''
          }`}
        >
          {getStatusLabel(order.status)}
        </div>
      </div>

      <div className={`text text_type_main-medium ${styles.composition_title}`}>Состав:</div>

      <ul className={`${styles.rows} custom-scroll`}>
        {rows.map(({ ingId, count }) => {
          const ing = ingredients.find((i) => i._id === ingId);
          if (!ing) return null;
          return (
            <li key={ingId} className={styles.row}>
              <img className={styles.thumb} src={ing.image} alt={ing.name} />
              <span className={`text text_type_main-default ${styles.row_name}`}>{ing.name}</span>
              <span className={`text text_type_digits-default ${styles.row_price}`}>
                {`${count} x ${ing.price}`}
                <CurrencyIcon type="primary" />
              </span>
            </li>
          );
        })}
      </ul>

      <div className={styles.footer}>
        <FormattedDate
          date={new Date(order.createdAt)}
          className="text text_type_main-default text_color_inactive"
        />
        <span className={`text text_type_digits-default ${styles.footer_total}`}>
          {total}
          <CurrencyIcon type="primary" />
        </span>
      </div>
    </div>
  );
};

export default OrderInfo;
