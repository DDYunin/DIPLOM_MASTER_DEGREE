import { tokenService } from './token.service';
import { baseFetch } from './base';
import { refreshTokenAndRetry } from './auth-interceptor';
import { useNotifications } from '@/shared/model';

export const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = tokenService.getAccessToken();
  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    return await baseFetch<T>(endpoint, { ...options, headers });

  } catch (error: any) {
    if (error.status === 401 && endpoint !== '/auth/refresh') {
      try {
        return await refreshTokenAndRetry<T>(endpoint, { ...options, headers });
      } catch (refreshError) {
        throw refreshError;
      }
    }

    const notifications = useNotifications();
    const errorMessage = error.message || 'Произошла непредвиденная ошибка';

    // Не показываем Toast для 401 ошибки (пользователя и так выкинет на /login)
    if (error.status !== 401) {
      notifications.showToast('error', 'Ошибка запроса', errorMessage);
    }

    throw error;
  }
};
