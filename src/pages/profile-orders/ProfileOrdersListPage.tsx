import { OrderCard } from '@/components/order-card';
import { useSubscribeUserOrdersFeedQuery } from '@/services/order/api';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Outlet } from 'react-router-dom';

import styles from './ProfileOrders.module.css';

export const ProfileOrdersListPage = (): React.JSX.Element => {
  const { data } = useSubscribeUserOrdersFeedQuery();
  const orders = data?.orders ?? [];
  const hasData = data?.hydrated ?? false;

  return (
    <div className={`${styles.list} custom-scroll`}>
      {!hasData ? (
        <Preloader />
      ) : (
        orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            to={`/profile/orders/${order._id}`}
            showStatus
          />
        ))
      )}
      <Outlet />
    </div>
  );
};

export default ProfileOrdersListPage;
