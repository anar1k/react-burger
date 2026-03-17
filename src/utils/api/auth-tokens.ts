import { API_BASE_URL, DEFAULT_HEADERS } from './index';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const RESET_PASSWORD_ALLOWED_KEY = 'resetPasswordAllowed';

export const getAccessToken = (): string | null =>
  localStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_TOKEN_KEY);

export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const setResetPasswordAllowed = (): void => {
  localStorage.setItem(RESET_PASSWORD_ALLOWED_KEY, '1');
};

export const isResetPasswordAllowed = (): boolean =>
  localStorage.getItem(RESET_PASSWORD_ALLOWED_KEY) === '1';

export const clearResetPasswordAllowed = (): void => {
  localStorage.removeItem(RESET_PASSWORD_ALLOWED_KEY);
};

type RefreshResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export const refreshToken = async (): Promise<boolean> => {
  const token = getRefreshToken();
  if (!token) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ token }),
    });
    const data = (await res.json()) as RefreshResponse;
    if (data.success && data.accessToken && data.refreshToken) {
      setTokens(data.accessToken, data.refreshToken);
      return true;
    }
  } catch {
    // ignore
  }
  clearTokens();
  return false;
};
