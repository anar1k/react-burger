import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { Modal } from '@components/modal';
import { OrderInfo } from '@components/order-info';
import { useResolvedOrder } from '@hooks/use-resolved-order';

import type { TOrder } from '@/utils/types';

import styles from './order-detail-page.module.css';

type OrderDetailPageProps = {
  knownOrders: TOrder[];
  backPath: string;
  backLabel: string;
  /** Режим попапа: как у `/ingredients/:id` на главной — закрытие через `navigate(-1)` или `backPath`. */
  modal?: boolean;
};

export const OrderDetailPage = ({
  knownOrders,
  backPath,
  backLabel,
  modal = false,
}: OrderDetailPageProps): React.JSX.Element | null => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isNewPage = location.key === 'default';
  const { order, isLoading } = useResolvedOrder(id, knownOrders);

  useEffect(() => {
    if (!id || isLoading) return;
    if (!order) {
      void navigate(backPath, { replace: true });
    }
  }, [backPath, id, isLoading, navigate, order]);

  const handleCloseModal = (): void => {
    if (!isNewPage) {
      void navigate(-1);
    } else {
      void navigate(backPath);
    }
  };

  if (!id) return null;
  if (isLoading) {
    return (
      <div className={styles.loader}>
        <Preloader />
      </div>
    );
  }
  if (!order) return null;

  if (modal) {
    return (
      <Modal header="Детали заказа" onClose={handleCloseModal}>
        <div className={styles.card}>
          <OrderInfo order={order} />
        </div>
      </Modal>
    );
  }

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
