import type { AuthResponse, UserRole } from '../model/types'; // Импортируем типы

interface Credentials {
  username: string;
  password?: string; // Пароль может быть необязательным для некоторых заглушек
}

// Заглушка для имитации входа
export const loginMock = (credentials: Credentials): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => { // Имитируем задержку сети
      const { username, password } = credentials;

      // Захардкоженные пользователи для теста
      const users = [
        { id: '1', username: 'admin', password: '123', role: 'admin', name: 'Администратор' },
        { id: '2', username: 'student', password: '123', role: 'student', name: 'Студент Петров' },
        { id: '3', username: 'teacher', password: '123', role: 'teacher', name: 'Преподаватель Иванов' },
      ];

      const foundUser = users.find(u => u.username === username && u.password === password);

      if (foundUser) {
        // Генерируем "токен" (просто уникальная строка)
        const token = `mock-jwt-${foundUser.username}-${Math.random().toString(36).substring(2, 15)}`;
        resolve({
          token: token,
          user: {
            id: foundUser.id,
            username: foundUser.username,
            name: foundUser.name,
            role: foundUser.role as UserRole,
          },
          role: foundUser.role as UserRole,
        });
      } else {
        reject(new Error('Неверное имя пользователя или пароль'));
      }
    }, 1000); // 1 секунда задержки
  });
};
