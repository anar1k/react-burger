import { useLazyGetCurrentUserQuery } from '@/services/user/api';
import { clearTokens, getAccessToken } from '@/utils/api/auth-tokens';
import { useEffect } from 'react';

export const AuthChecker = (): null => {
  const [getCurrentUser] = useLazyGetCurrentUserQuery();
  const token = getAccessToken();

  useEffect(() => {
    if (!token) return;
    void getCurrentUser()
      .unwrap()
      .catch(() => {
        clearTokens();
      });
  }, [getCurrentUser, token]);

  return null;
};
