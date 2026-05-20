import { ROLES } from '@/shared/config/roles'
import type { AdminUserListItemDto } from '../api/types'
import type { User, UserRole, UserStatus } from '../model/types'

const BACKEND_ROLE_TO_USER_ROLE: Record<string, UserRole> = {
  [ROLES.ADMIN]: 'Super Admin',
  ROLE_ADMIN: 'Super Admin',
  ADMIN: 'Super Admin',
  [ROLES.TEACHER]: 'Teacher',
  ROLE_TEACHER: 'Teacher',
  TEACHER: 'Teacher',
  Teacher: 'Teacher',
  [ROLES.STUDENT]: 'Student',
  ROLE_STUDENT: 'Student',
  STUDENT: 'Student',
  Student: 'Student',
  ROLE_MODERATOR: 'Moderator',
  MODERATOR: 'Moderator',
  Moderator: 'Moderator'
}

const ROLE_PRIORITY: string[] = [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]

const resolvePrimaryRole = (roles: string[]): UserRole => {
  const normalizedRole = ROLE_PRIORITY.find((priorityRole) => roles.includes(priorityRole))
  if (normalizedRole) {
    return BACKEND_ROLE_TO_USER_ROLE[normalizedRole]
  }

  const firstRole = roles[0]
  return (firstRole && BACKEND_ROLE_TO_USER_ROLE[firstRole]) || 'Student'
}

const buildFullName = (dto: AdminUserListItemDto): string => {
  const parts = [dto.lastName, dto.firstName, dto.middleName].filter(Boolean)
  return parts.join(' ') || dto.username
}

const buildAvatarInitials = (dto: AdminUserListItemDto): string => {
  const firstInitial = dto.firstName?.charAt(0) ?? ''
  const lastInitial = dto.lastName?.charAt(0) ?? ''
  return `${firstInitial}${lastInitial}`.toUpperCase()
}

export const mapAdminUserListItemToUser = (dto: AdminUserListItemDto): User => {
  const status: UserStatus = dto.active ? 'Active' : 'Inactive'

  return {
    id: dto.id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    patronymic: dto.middleName,
    fullName: buildFullName(dto),
    email: dto.email,
    role: resolvePrimaryRole(dto.roles),
    status,
    department: dto.department,
    avatarInitials: buildAvatarInitials(dto)
  }
}

export const mapAdminUserListItemsToUsers = (items: AdminUserListItemDto[]): User[] =>
  items.map(mapAdminUserListItemToUser)
