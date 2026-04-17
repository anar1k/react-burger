import { OrderInfo } from '@components/order-info';
import { useResolvedOrder } from '@hooks/use-resolved-order';
import type { TOrder } from '@/utils/types';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import styles from './order-detail-page.module.css';

type OrderDetailPageProps = {
  knownOrders: TOrder[];
  backPath: string;
  backLabel: string;
};

export const OrderDetailPage = ({
  knownOrders,
  backPath,
  backLabel,
}: OrderDetailPageProps): React.JSX.Element | null => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { order, isLoading } = useResolvedOrder(id, knownOrders);

  useEffect(() => {
    if (!id || isLoading) return;
    if (!order) {
      void navigate(backPath, { replace: true });
    }
  }, [backPath, id, isLoading, navigate, order]);

  if (!id) return null;
  if (isLoading) {
    return (
      <div className={styles.loader}>
        <Preloader />
      </div>
    );
  }
  if (!order) return null;

  return (
    <div className={styles.root}>
      <Link to={backPath} className={`text text_type_main-default ${styles.back}`}>
        {backLabel}
      </Link>
      <div className={styles.card}>
        <OrderInfo order={order} />
      </div>
    </div>
  );
};

export default OrderDetailPage;
