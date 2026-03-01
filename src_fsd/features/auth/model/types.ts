// Почему может быть null (так как на старте может не быть роли)
export type UserRole = 'admin' | 'student' | 'teacher' | null;

// Разве не стоит вынести это на уровень entities? (зарефакторить позднее)
export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  // Дополнительные поля пользователя
}

export interface AuthResponse {
  token: string; // В реальном приложении это был бы JWT или другой токен
  user: User;
  role: UserRole;
}
