import { z } from 'zod'

import type { UserRole } from '@/entities/user'

export type AdminUserProfileFormValues = {
  email: string
  firstName: string
  lastName: string
  middleName: string
  departmentId: number | null
  groupId: number | null
}

export const mapUserToAdminProfileFormValues = (user: {
  email: string
  firstName: string
  lastName: string
  patronymic?: string
  departmentId?: number | null
  groupId?: number | null
}): AdminUserProfileFormValues => ({
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  middleName: user.patronymic ?? '',
  departmentId: user.departmentId ?? null,
  groupId: user.groupId ?? null
})

export const applyAdminProfileFormValuesToUser = (
  user: AdminUserProfileFormValues,
  target: {
    email: string
    firstName: string
    lastName: string
    patronymic?: string
    departmentId?: number | null
    groupId?: number | null
    fullName: string
  }
) => {
  target.email = user.email.trim()
  target.firstName = user.firstName.trim()
  target.lastName = user.lastName.trim()
  target.patronymic = user.middleName.trim() || undefined
  target.departmentId = user.departmentId
  target.groupId = user.groupId
  target.fullName = [target.lastName, target.firstName, target.patronymic].filter(Boolean).join(' ')
}

export const createAdminUserProfileSchema = (
  t: (key: string) => string,
  role: UserRole
) =>
  z
    .object({
      email: z
        .string()
        .trim()
        .min(1, t('addUser.errors.required'))
        .email(t('addUser.errors.invalidEmail')),
      firstName: z.string().trim().min(1, t('addUser.errors.required')),
      lastName: z.string().trim().min(1, t('addUser.errors.required')),
      middleName: z.string().trim(),
      departmentId: z.number().nullable(),
      groupId: z.number().nullable()
    })
    .superRefine((data, ctx) => {
      if (role === 'Teacher' && data.departmentId == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['departmentId'],
          message: t('addUser.errors.departmentRequired')
        })
      }

      if (role === 'Student' && data.groupId == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['groupId'],
          message: t('addUser.errors.groupRequired')
        })
      }
    })
