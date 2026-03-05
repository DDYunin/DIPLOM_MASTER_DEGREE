// TODO: замечания и предложения по интерфейсу:
// 1. Может быть стоит поделить на конкретные роли пользователей, но думаю это можно потом, расширить интерфейс пользователя и указать конкретные значения для полей
// 2. Роль модератора не нужна

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: 'Admin' | 'Teacher' | 'Student' | 'Moderator'
  department: string
  subDepartment: string
  status: 'Active' | 'Offline' | 'Blocked'
}

export interface StudentProfile extends User {
  studentId: string
  lastLogin: string
  username: string
  cohort: string
  notes: string
}

// TODO: вынести в другую сущность, но судя по всему нужно будет вынести на уровень shared,
// Так как нельзя допускать пересечения сущностей на одном уровне
export interface Course {
  code: string
  name: string
  semester: string
  status: 'Active' | 'Upcoming' | 'Completed'
}

export interface TeacherProfile extends User {
  employeeId: string
  lastLogin: string
  groups: string[]
  permissions: {
    publishGrades: boolean
    manageUsers: boolean
  }
  courses: Course[]
  twoFactorEnabled: boolean
}
