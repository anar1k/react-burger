import { useGetCurrentUserQuery } from '@/services/user/api';
import { getAccessToken } from '@/utils/api/auth-tokens';
import { useEffect } from 'react';
import { type Location, Outlet, useLocation, useNavigate } from 'react-router-dom';

export const GuestRoute = (): React.JSX.Element | null => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from ?? {
    pathname: '/profile',
  };
  const token = getAccessToken();
  const { data, isLoading, isError } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });

  const isAuth = Boolean(token && data?.success && !isError);

  useEffect(() => {
    if (isAuth) {
      void navigate(from, { replace: true });
    }
  }, [isAuth, from, navigate]);

  if (token && (isLoading || isAuth)) {
    return (
      <div className="flex items-center justify-center p-20">
        <p className="text text_type_main-default">Загрузка...</p>
      </div>
    );
  }

  return <Outlet />;
};
