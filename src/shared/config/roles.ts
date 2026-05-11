export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  TEACHER: 'ROLE_TEACHER',
  STUDENT: 'ROLE_STUDENT'
} as const;

export type AppRole = typeof ROLES[keyof typeof ROLES];
