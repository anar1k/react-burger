import { OrderDetailPage } from '@/components/order-detail-page';
import { useSubscribeUserOrdersFeedQuery } from '@/services/order/api';

export const ProfileOrderPage = (): React.JSX.Element => {
  const { data } = useSubscribeUserOrdersFeedQuery();
  const knownOrders = data?.orders ?? [];
  return (
    <OrderDetailPage
      knownOrders={knownOrders}
      backPath="/profile/orders"
      backLabel="← К истории заказов"
      modal
    />
  );
};

export default ProfileOrderPage;
