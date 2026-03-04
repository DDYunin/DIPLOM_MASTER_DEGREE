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
