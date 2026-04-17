import { useSubscribeUserOrdersFeedQuery } from '@/services/order/api';
import { Outlet } from 'react-router-dom';

import styles from './ProfileOrdersLayout.module.css';

export const ProfileOrdersLayout = (): React.JSX.Element => {
  useSubscribeUserOrdersFeedQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });
  return (
    <div className={styles.root}>
      <Outlet />
    </div>
  );
};

export default ProfileOrdersLayout;
