import { useNotifications } from '@/shared/model/useNotifications'

// In-memory кэш для сохранения мутаций (POST/PATCH) во время работы SPA
const dbCache: Record<string, any> = {}

export const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const method = options.method || 'GET'

  try {
    // 1. Имитация задержки реальной сети
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // ==============================================================
    // 🛑 MOCK-ПЕРЕХВАТЧИК (Удалить, когда появится реальный бэкенд)
    // ==============================================================
    if (endpoint.startsWith('/users')) {
      // GET: Запрашиваем реальный JSON-файл через HTTP!
      if (method === 'GET') {
        if (!dbCache.users) {
          const res = await fetch('/mock-data/users.json')
          if (!res.ok) throw new Error(`Failed to load mock data: ${res.status}`)
          dbCache.users = await res.json()
        }
        return dbCache.users as T
      }

      // POST: Имитация сохранения
      if (method === 'POST' && options.body) {
        const newUser = JSON.parse(options.body as string)
        dbCache.users = dbCache.users || []
        dbCache.users.unshift(newUser)
        return newUser as T // Возвращаем результат
      }

      // PATCH: Имитация обновления
      if (method === 'PATCH' && options.body) {
        const id = endpoint.split('/')[2]
        const updates = JSON.parse(options.body as string)
        const index = dbCache.users.findIndex((u: any) => u.id === id)

        if (index > -1) {
          dbCache.users[index] = { ...dbCache.users[index], ...updates }
          return dbCache.users[index] as T
        }
        throw new Error('User not found')
      }
    }
    // --- БЛОК /organization ---
    if (endpoint.startsWith('/organization/tree')) {
      // Запрашиваем дерево
      if (method === 'GET') {
        if (!dbCache.orgTree) {
          const res = await fetch('/mock-data/organization.json');
          if (!res.ok) throw new Error(`Failed to load mock data`);
          dbCache.orgTree = await res.json();
        }
        return dbCache.orgTree as T;
      }
      
      // Имитация сохранения всего дерева
      if (method === 'PUT' && options.body) {
        dbCache.orgTree = JSON.parse(options.body as string);
        return dbCache.orgTree as T;
      }
    }
    // ==============================================================

    // ✅ БЛОК ДЛЯ РЕАЛЬНОГО БЭКЕНДА (Сейчас закомментирован)
    /*
    const baseUrl = 'https://api.university.com/v1';
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        ...options.headers,
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    // Читаем ответ как текст, чтобы безопасно распарсить
    const text = await response.text();
    if (!text) return {} as T; // Обработка пустых ответов (204 No Content)

    try {
      return JSON.parse(text) as T;
    } catch (e) {
      throw new Error('Некорректный формат ответа от сервера (Ожидался JSON)');
    }
    */

    throw new Error(`Endpoint not found or not mocked: ${endpoint}`)
  } catch (error: any) {
    const notifications = useNotifications()
    // ГЛОБАЛЬНАЯ ОБРАБОТКА ОШИБОК
    // Показываем красивый Toast пользователю
    notifications.showToast(
      'error',
      'Ошибка сети',
      error.message || 'Произошла непредвиденная ошибка'
    )
    // Пробрасываем ошибку дальше, чтобы стор (Pinia) мог остановить лоадер
    throw error
  }
}
