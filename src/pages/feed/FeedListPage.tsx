import { OrderCard } from '@/components/order-card';
import { useSubscribeAllOrdersFeedQuery } from '@/services/order/api';
import type { TOrder } from '@/utils/types';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import styles from './Feed.module.css';

const BOARD_MAX_ROWS = 10;
const BOARD_MAX_COLS = 2;

function formatBoardNumber(n: number): string {
  return String(n).padStart(6, '0');
}

function formatStatDigits(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function orderNumbersByStatus(
  orders: TOrder[],
  statusMatch: (status: string) => boolean
): number[] {
  return orders
    .filter((o) => statusMatch(o.status) && o.number > 0)
    .map((o) => o.number);
}

/** Не более `BOARD_MAX_COLS` колонок по `BOARD_MAX_ROWS` номеров в каждой. */
function splitIntoColumns(numbers: number[]): number[][] {
  const cap = BOARD_MAX_ROWS * BOARD_MAX_COLS;
  const slice = numbers.slice(0, cap);
  const cols: number[][] = [];
  for (let c = 0; c < BOARD_MAX_COLS && c * BOARD_MAX_ROWS < slice.length; c += 1) {
    cols.push(slice.slice(c * BOARD_MAX_ROWS, (c + 1) * BOARD_MAX_ROWS));
  }
  return cols;
}

export const FeedListPage = (): React.JSX.Element => {
  const { data } = useSubscribeAllOrdersFeedQuery();
  const orders = data?.orders ?? [];
  const total = data?.total ?? 0;
  const totalToday = data?.totalToday ?? 0;
  const hasData = data?.hydrated ?? false;

  const readyColumns = useMemo(
    () => splitIntoColumns(orderNumbersByStatus(orders, (s) => s === 'done')),
    [orders]
  );

  const workColumns = useMemo(
    () =>
      splitIntoColumns(
        orderNumbersByStatus(orders, (s) => s === 'pending' || s === 'created')
      ),
    [orders]
  );

  return (
    <>
      <h1 className="text text_type_main-large mt-10 mb-5">Лента заказов</h1>

      <div className={styles.feed_grid}>
        <div className={`${styles.list} custom-scroll`}>
          {!hasData ? (
            <Preloader />
          ) : (
            orders.map((order) => (
              <OrderCard key={order._id} order={order} to={`/feed/${order._id}`} />
            ))
          )}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.boards}>
            <div className={styles.board_section}>
              <div className={`text text_type_main-medium ${styles.board_title}`}>
                Готовы:
              </div>
              <div className={styles.board_columns}>
                {readyColumns.length === 0 ? (
                  <span
                    className={`text text_type_digits-default text_color_inactive ${styles.board_placeholder}`}
                  >
                    —
                  </span>
                ) : (
                  readyColumns.map((col, colIdx) => (
                    <ul key={colIdx} className={styles.board_list}>
                      {col.map((n) => (
                        <li
                          key={`${colIdx}-${n}`}
                          className={`text text_type_digits-default ${styles.board_number_ready}`}
                        >
                          {formatBoardNumber(n)}
                        </li>
                      ))}
                    </ul>
                  ))
                )}
              </div>
            </div>

            <div className={styles.board_section}>
              <div className={`text text_type_main-medium ${styles.board_title}`}>
                В работе:
              </div>
              <div className={styles.board_columns}>
                {workColumns.length === 0 ? (
                  <span
                    className={`text text_type_digits-default text_color_inactive ${styles.board_placeholder}`}
                  >
                    —
                  </span>
                ) : (
                  workColumns.map((col, colIdx) => (
                    <ul key={colIdx} className={styles.board_list}>
                      {col.map((n) => (
                        <li
                          key={`${colIdx}-${n}`}
                          className={`text text_type_digits-default ${styles.board_number_work}`}
                        >
                          {formatBoardNumber(n)}
                        </li>
                      ))}
                    </ul>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className={styles.stat_block}>
            <div className={`text text_type_digits-large ${styles.stat_digits}`}>
              {formatStatDigits(total)}
            </div>
            <div className={`text text_type_main-default ${styles.stat_caption}`}>
              Выполнено за всё время
            </div>
          </div>
          <div className={styles.stat_block}>
            <div className={`text text_type_digits-large ${styles.stat_digits}`}>
              {formatStatDigits(totalToday)}
            </div>
            <div className={`text text_type_main-default ${styles.stat_caption}`}>
              Выполнено за сегодня
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default FeedListPage;
