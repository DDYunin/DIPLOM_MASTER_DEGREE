import { ROLES, type AppRole } from '@/shared/config/roles'

export type usersTableFilters = AppRole | 'ALL'

export const USERS_TABLE_FILTERS = {
  ALL: 'ALL',
  ADMIN: ROLES.ADMIN,
  TEACHER: ROLES.TEACHER,
  STUDENT: ROLES.STUDENT
} as const
