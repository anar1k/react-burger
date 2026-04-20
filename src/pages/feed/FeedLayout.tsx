import { useSubscribeAllOrdersFeedQuery } from '@/services/order/api';
import { Outlet } from 'react-router-dom';

export const FeedLayout = (): React.JSX.Element => {
  useSubscribeAllOrdersFeedQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });
  return <Outlet />;
};

export default FeedLayout;
