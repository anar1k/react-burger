import { getErrorMessage } from './getErrorMessage';

const API_BASE_URL = 'https://new-stellarburgers.education-services.ru/api';

type ApiResponse<T = unknown> = {
  data: T;
  success: boolean;
};

export const fetchData = async <T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok)
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);

    const result = (await response.json()) as ApiResponse;

    return result.data as T;
  } catch (err) {
    throw new Error(getErrorMessage(err, 'Произошла неизвестная ошибка'));
  }
};
