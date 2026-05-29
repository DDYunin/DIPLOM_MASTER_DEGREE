import { ROLES } from '@/shared/config/roles'
import type {
  AdminUserDetailsResponse,
  AdminUserListItemDto,
  UserResponseDto
} from '../api/types'
import type { User, UserRole, UserStatus } from '../model/types'

const BACKEND_ROLE_TO_USER_ROLE: Record<string, UserRole> = {
  [ROLES.ADMIN]: 'Super Admin',
  [ROLES.TEACHER]: 'Teacher',
  [ROLES.STUDENT]: 'Student',
}

const ROLE_PRIORITY: string[] = [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]

const toUserRole = (backendRole: string | undefined): UserRole => {
  if (!backendRole) {
    return 'Student'
  }
  return BACKEND_ROLE_TO_USER_ROLE[backendRole] ?? 'Student'
}

const resolvePrimaryRole = (roles: string[]): UserRole => {
  const normalizedRole = ROLE_PRIORITY.find((priorityRole) => roles.includes(priorityRole))
  if (normalizedRole !== undefined) {
    return toUserRole(normalizedRole)
  }

  return toUserRole(roles[0])
}

const buildFullName = (parts: {
  lastName?: string
  firstName?: string
  middleName?: string
  username?: string
}): string => {
  const name = [parts.lastName, parts.firstName, parts.middleName].filter(Boolean).join(' ')
  return name || parts.username || ''
}

const buildAvatarInitials = (firstName?: string, lastName?: string): string => {
  const firstInitial = firstName?.charAt(0) ?? ''
  const lastInitial = lastName?.charAt(0) ?? ''
  return `${firstInitial}${lastInitial}`.toUpperCase()
}

const buildFullNameFromListItem = (dto: AdminUserListItemDto): string =>
  buildFullName({
    lastName: dto.lastName,
    firstName: dto.firstName,
    middleName: dto.middleName,
    username: dto.username
  })

const buildAvatarInitialsFromListItem = (dto: AdminUserListItemDto): string =>
  buildAvatarInitials(dto.firstName, dto.lastName)

export const mapUserResponseToUser = (dto: UserResponseDto): User => {
  const status: UserStatus = dto.active ? 'Active' : 'Inactive'

  return {
    id: dto.id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    patronymic: dto.middleName,
    fullName: buildFullName({
      lastName: dto.lastName,
      firstName: dto.firstName,
      middleName: dto.middleName,
      username: dto.username
    }),
    email: dto.email,
    role: resolvePrimaryRole(dto.roles),
    status,
    identifier: dto.username,
    avatarInitials: buildAvatarInitials(dto.firstName, dto.lastName)
  }
}

export const mapAdminUserDetailsToUser = (
  dto: AdminUserDetailsResponse,
  userId: string
): User => ({
  id: userId,
  firstName: dto.firstName,
  lastName: dto.lastName,
  patronymic: dto.middleName,
  fullName: buildFullName({
    lastName: dto.lastName,
    firstName: dto.firstName,
    middleName: dto.middleName,
    username: dto.username
  }),
  email: dto.email,
  role: resolvePrimaryRole(dto.roles),
  status: 'Active',
  identifier: dto.username,
  department: dto.department,
  avatarInitials: buildAvatarInitials(dto.firstName, dto.lastName)
})

export const mapAdminUserListItemToUser = (dto: AdminUserListItemDto): User => {
  const status: UserStatus = dto.active ? 'Active' : 'Inactive'

  return {
    id: dto.id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    patronymic: dto.middleName,
    fullName: buildFullNameFromListItem(dto),
    email: dto.email,
    role: resolvePrimaryRole(dto.roles),
    status,
    department: dto.department,
    avatarInitials: buildAvatarInitialsFromListItem(dto)
  }
}

export const mapAdminUserListItemsToUsers = (items: AdminUserListItemDto[]): User[] =>
  items.map(mapAdminUserListItemToUser)
