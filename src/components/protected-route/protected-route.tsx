import { getAccessToken } from '@/utils/api/auth-tokens';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import type React from 'react';

type ProtectedRouteProps = {
  children?: React.ReactNode;
  anonymous?: boolean;
};

export const ProtectedRoute = ({
  children,
  anonymous = false,
}: ProtectedRouteProps): React.JSX.Element => {
  const isLoggedIn = Boolean(getAccessToken());

  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from ?? '/';

  if (anonymous && isLoggedIn) {
    return <Navigate to={from} />;
  }

  if (!anonymous && !isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (children) {
    return <>{children}</>;
  }

  return <Outlet />;
};
