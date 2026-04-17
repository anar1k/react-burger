import { OrderDetailPage } from '@/components/order-detail-page';
import { useSubscribeAllOrdersFeedQuery } from '@/services/order/api';

export const FeedOrderPage = (): React.JSX.Element => {
  const { data } = useSubscribeAllOrdersFeedQuery();
  const knownOrders = data?.orders ?? [];
  return (
    <OrderDetailPage
      knownOrders={knownOrders}
      backPath="/feed"
      backLabel="← К ленте заказов"
    />
  );
};

export default FeedOrderPage;
