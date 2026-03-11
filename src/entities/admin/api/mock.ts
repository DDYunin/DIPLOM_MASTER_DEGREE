import type { AdminProfile } from '../model/types'

export const mockAdminProfile: AdminProfile = {
  id: 'admin-1',
  fullName: 'Thomas Anderson',
  email: 'admin@university.edu',
  phone: '+1 (555) 019-2834',
  role: 'Super Admin',
  avatar: '' // Оставляем пустым для генерации инициалов
}
