import { useGetIngredientsQuery } from '@/services/ingredient/api';
import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import type { TOrder } from '@/utils/types';

import styles from './order-card.module.css';

const STATUS_LABEL: Record<string, string> = {
  done: 'Выполнен',
  pending: 'Готовится',
  created: 'Создан',
  canceled: 'Отменён',
};

/** Пять превью + при переполнении шестой кружок «+N» (как в макете). */
const MAX_PREVIEW_ICONS = 5;

type OrderCardProps = {
  order: TOrder;
  to: string;
  showStatus?: boolean;
};

type PreviewItem = { kind: 'ingredient'; id: string } | { kind: 'more'; count: number };

export const OrderCard = ({
  order,
  to,
  showStatus = false,
}: OrderCardProps): React.JSX.Element => {
  const { data: ingredients = [] } = useGetIngredientsQuery();

  const { total, previewItems } = useMemo(() => {
    let sum = 0;
    for (const ingId of order.ingredients) {
      const ing = ingredients.find((i) => i._id === ingId);
      if (ing) sum += ing.price;
    }
    const seen = new Set<string>();
    const uniqueRev: string[] = [];
    for (let i = order.ingredients.length - 1; i >= 0; i -= 1) {
      const ingId = order.ingredients[i];
      if (!seen.has(ingId)) {
        seen.add(ingId);
        uniqueRev.push(ingId);
      }
    }
    const items: PreviewItem[] = [];
    if (uniqueRev.length <= MAX_PREVIEW_ICONS) {
      for (const id of uniqueRev) items.push({ kind: 'ingredient', id });
    } else {
      for (let i = 0; i < MAX_PREVIEW_ICONS; i += 1) {
        items.push({ kind: 'ingredient', id: uniqueRev[i] });
      }
      items.push({ kind: 'more', count: uniqueRev.length - MAX_PREVIEW_ICONS });
    }
    return { total: sum, previewItems: items };
  }, [order.ingredients, ingredients]);

  const statusLabel = STATUS_LABEL[order.status] ?? order.status;

  return (
    <Link to={to} className={styles.link}>
      <div className={styles.row}>
        <span className={`text text_type_digits-default ${styles.number}`}>
          {`#${String(order.number).padStart(6, '0')}`}
        </span>
        <span className={`text text_type_main-default ${styles.date}`}>
          <FormattedDate
            date={new Date(order.createdAt)}
            className="text text_type_main-default"
          />
        </span>
      </div>

      <div
        className={`text text_type_main-medium ${styles.name} ${
          !showStatus ? styles.name_spacing_feed : ''
        }`}
      >
        {order.name ?? 'Без названия'}
      </div>

      {showStatus && (
        <div
          className={`text text_type_main-default ${styles.status} ${
            order.status === 'done' ? styles.status_done : ''
          }`}
        >
          {statusLabel}
        </div>
      )}

      <div className={styles.footer}>
        <ul className={styles.icons}>
          {previewItems.map((item, index) => {
            if (item.kind === 'more') {
              return (
                <li key="more" className={`${styles.iconWrap} ${styles.icon_more}`}>
                  <span className={`text text_type_digits-default ${styles.more_text}`}>
                    {`+${item.count}`}
                  </span>
                </li>
              );
            }
            const ing = ingredients.find((i) => i._id === item.id);
            if (!ing) return null;
            return (
              <li key={`${item.id}-${index}`} className={styles.iconWrap}>
                <img className={styles.thumb} src={ing.image} alt="" />
              </li>
            );
          })}
        </ul>

        <div className={styles.price}>
          <span className="text text_type_digits-default">{total}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;
