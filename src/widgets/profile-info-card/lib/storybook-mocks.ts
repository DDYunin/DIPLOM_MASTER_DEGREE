import type { User } from '@/entities/user'

export const mockTeacherUser: User = {
  id: 'u-1',
  firstName: 'Анна',
  lastName: 'Петрова',
  patronymic: 'Сергеевна',
  fullName: 'Петрова Анна Сергеевна',
  email: 'petrova@university.edu',
  role: 'Teacher',
  status: 'Active',
  identifier: 'EMP-4421',
  departmentId: 1,
  department: 'Кафедра информатики'
}

export const mockStudentUser: User = {
  id: 'u-2',
  firstName: 'Иван',
  lastName: 'Смирнов',
  patronymic: 'Алексеевич',
  fullName: 'Смирнов Иван Алексеевич',
  email: 'smirnov.i@university.edu',
  role: 'Student',
  status: 'Active',
  studentId: 'STU-2024-007',
  institute: 'Институт информационных технологий',
  major: 'Программная инженерия',
  group: 'ПИ-401',
  groupId: 12
}

export const mockAdminUser: User = {
  id: 'u-3',
  firstName: 'Михаил',
  lastName: 'Орлов',
  patronymic: 'Дмитриевич',
  fullName: 'Орлов Михаил Дмитриевич',
  email: 'orlov@university.edu',
  role: 'Super Admin',
  status: 'Active',
  phone: '+7 (999) 123-45-67'
}

export const mockDepartments = [
  { id: 1, name: 'Кафедра информатики' },
  { id: 2, name: 'Кафедра математики' },
  { id: 3, name: 'Кафедра физики' }
]

export const mockGroups = [
  { id: 12, name: 'ПИ-401' },
  { id: 13, name: 'ПИ-402' },
  { id: 14, name: 'ИС-301' }
]
