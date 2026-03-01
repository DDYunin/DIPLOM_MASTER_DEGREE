import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { loginMock } from '../api/auth'; // Будем использовать заглушку
import { setToken, getToken, removeToken } from '@shared/lib/localStorage'; // Утилиты для localStorage
import type { User, AuthResponse, UserRole } from './types'; // Типы данных

export const useAuthStore = defineStore('auth', () => {
  // Пробуем загрузить токен и данные пользователя из localStorage при инициализации
  const storedToken = getToken();
  const storedUserJson = localStorage.getItem('user'); // Сохраним пользователя тоже
  const storedRoleJson = localStorage.getItem('userRole');

  const token = ref<string | null>(storedToken);
  const user = ref<User | null>(storedUserJson ? JSON.parse(storedUserJson) : null);
  const role = ref<UserRole | null>(storedRoleJson ? JSON.parse(storedRoleJson) : null);

  const isAuthenticated = computed(() => !!token.value && !!user.value && !!role.value);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const login = async (credentials: { username: string; password: string }) => {
    isLoading.value = true;
    error.value = null;
    try {
      // Имитируем API-запрос к заглушке
      const response: AuthResponse = await loginMock(credentials);

      token.value = response.token;
      user.value = response.user;
      role.value = response.role;

      // Сохраняем в localStorage
      setToken(response.token);
      // Сохраняем в LS, чтобы потом проверять по роли
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('userRole', JSON.stringify(response.role));

      isLoading.value = false;
      return true; // Успешная авторизация
    } catch (err: any) {
      error.value = err.message || 'Ошибка авторизации';
      isLoading.value = false;
      return false; // Ошибка авторизации
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    role.value = null;
    removeToken();
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    // В реальном приложении здесь можно перенаправить на страницу входа
  };

  return {
    token,
    user,
    role,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
});
