import { ProfileWrapper } from '@/components/profile-wrapper';
import { useGetCurrentUserQuery } from '@/services/user/api';
import { clearTokens, getAccessToken } from '@/utils/api/auth-tokens';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const ProtectedRoute = (): React.JSX.Element | null => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = getAccessToken();
  const { data, isLoading, isError } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (!token) {
      void navigate('/login', { state: { from: location }, replace: true });
      return;
    }
    if (isError) {
      clearTokens();
      void navigate('/login', { state: { from: location }, replace: true });
    }
  }, [token, isError, navigate, location]);

  if (!token || isError) {
    return null;
  }
  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center p-20">
        <p className="text text_type_main-default">Загрузка...</p>
      </div>
    );
  }

  return <ProfileWrapper />;
};
