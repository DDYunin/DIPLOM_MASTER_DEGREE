import { z } from 'zod'

import { ROLES, type AppRole } from '@/shared/config/roles'

export type AddUserFormValues = {
  username: string
  email: string
  firstName: string
  lastName: string
  middleName: string
  role: AppRole
  departmentId: number | null
  groupId: number | null
}

export const getAddUserInitialValues = (): AddUserFormValues => ({
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  middleName: '',
  role: ROLES.STUDENT,
  departmentId: null,
  groupId: null
})

export const createAddUserFormSchema = (t: (key: string) => string) =>
  z
    .object({
      username: z.string().trim().min(1, t('addUser.errors.required')),
      email: z
        .string()
        .trim()
        .min(1, t('addUser.errors.required'))
        .email(t('addUser.errors.invalidEmail')),
      firstName: z.string().trim().min(1, t('addUser.errors.required')),
      lastName: z.string().trim().min(1, t('addUser.errors.required')),
      middleName: z.string().trim(),
      role: z.enum([ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]),
      departmentId: z.number().nullable(),
      groupId: z.number().nullable()
    })
    .superRefine((data, ctx) => {
      if (data.role === ROLES.TEACHER && data.departmentId == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['departmentId'],
          message: t('addUser.errors.departmentRequired')
        })
      }

      if (data.role === ROLES.STUDENT && data.groupId == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['groupId'],
          message: t('addUser.errors.groupRequired')
        })
      }
    })
