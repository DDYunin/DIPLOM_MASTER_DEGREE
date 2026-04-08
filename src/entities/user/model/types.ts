// TODO: замечания и предложения по интерфейсу:
// 1. Может быть стоит поделить на конкретные роли пользователей, но думаю это можно потом, расширить интерфейс пользователя и указать конкретные значения для полей
// 2. Роль модератора не нужна

// TODO: вынести в другую сущность, но судя по всему нужно будет вынести на уровень shared,
// Так как нельзя допускать пересечения сущностей на одном уровне
// Или же есть второй вариант, чтобы сделать интерфейс-пустышку, так как все поля навряд ли тут понадобятся
// Можно использовать только нужные и принцип "Interface Segregation"
export interface Course {
  code: string
  name: string
  semester: string
  status: 'Active' | 'Upcoming' | 'Completed'
}

export type UserRole = 'Student' | 'Teacher' | 'Super Admin' | 'Moderator';
export type UserStatus = 'Active' | 'Offline' | 'Blocked' | 'Inactive';

export interface UserPermissions {
  publishGrades?: boolean;
  manageUsers?: boolean;
}

export interface User {
  // === ОБЩИЕ ПОЛЯ (Базовые для всех) ===
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  avatarInitials?: string; // Не надо
  lastLogin?: string; // Не надо

  // === БЕЗОПАСНОСТЬ ===
  twoFactorEnabled?: boolean; // ?

  // === СПЕЦИФИЧНЫЕ ПОЛЯ: АДМИН ===
  phone?: string; // Не надо

  // === СПЕЦИФИЧНЫЕ ПОЛЯ: СТУДЕНТ / ПРЕПОДАВАТЕЛЬ ===
  identifier?: string; // Универсальное поле для Student ID или Employee ID
  department?: string;
  subDepartment?: string;

  // === СПЕЦИФИЧНЫЕ ПОЛЯ: СТУДЕНТ ===
  cohort?: string;
  notes?: string;

  // === СПЕЦИФИЧНЫЕ ПОЛЯ: ПРЕПОДАВАТЕЛЬ ===
  groups?: string[];
  permissions?: UserPermissions;
  courses?: Course[];
}
