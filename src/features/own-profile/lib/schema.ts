import { z } from 'zod'

export type OwnProfileSettingsFormValues = {
  newEmail: string
  confirmNewEmail: string
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export type ChangePasswordFormValues = {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export type OwnProfileEmailFormValues = {
  email: string
}

export const getOwnProfileSettingsInitialValues = (): OwnProfileSettingsFormValues => ({
  newEmail: '',
  confirmNewEmail: '',
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

export const getChangePasswordInitialValues = (): ChangePasswordFormValues => ({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

const hasEmailChange = (data: Pick<OwnProfileSettingsFormValues, 'newEmail' | 'confirmNewEmail'>) => {
  return data.newEmail.trim().length > 0 || data.confirmNewEmail.trim().length > 0
}

const hasPasswordChange = (
  data: Pick<
    OwnProfileSettingsFormValues,
    'currentPassword' | 'newPassword' | 'confirmNewPassword'
  >
) => {
  return (
    data.currentPassword.length > 0 ||
    data.newPassword.length > 0 ||
    data.confirmNewPassword.length > 0
  )
}

export const createOwnProfileSettingsSchema = (
  t: (key: string) => string,
  currentEmail?: string
) =>
  z
    .object({
      newEmail: z.string(),
      confirmNewEmail: z.string(),
      currentPassword: z.string(),
      newPassword: z.string(),
      confirmNewPassword: z.string()
    })
    .superRefine((data, ctx) => {
      if (hasEmailChange(data)) {
        const newEmail = data.newEmail.trim()
        const confirmNewEmail = data.confirmNewEmail.trim()

        if (!newEmail) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['newEmail'],
            message: t('teacherProfile.emailRequired')
          })
        }

        if (!confirmNewEmail) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['confirmNewEmail'],
            message: t('teacherProfile.emailRequired')
          })
        }

        if (newEmail && !z.string().email().safeParse(newEmail).success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['newEmail'],
            message: t('addUser.errors.invalidEmail')
          })
        }

        if (newEmail && confirmNewEmail && newEmail !== confirmNewEmail) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['confirmNewEmail'],
            message: t('teacherProfile.emailMismatch')
          })
        }

        if (currentEmail && newEmail && newEmail === currentEmail) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['newEmail'],
            message: t('teacherProfile.emailSameAsCurrent')
          })
        }
      }

      if (hasPasswordChange(data)) {
        if (!data.currentPassword) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['currentPassword'],
            message: t('teacherProfile.passwordRequired')
          })
        }

        if (!data.newPassword) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['newPassword'],
            message: t('teacherProfile.passwordRequired')
          })
        } else if (data.newPassword.length < 8) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['newPassword'],
            message: t('securityCard.passwordMinLength')
          })
        }

        if (!data.confirmNewPassword) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['confirmNewPassword'],
            message: t('teacherProfile.passwordRequired')
          })
        }

        if (
          data.newPassword &&
          data.confirmNewPassword &&
          data.newPassword !== data.confirmNewPassword
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['confirmNewPassword'],
            message: t('teacherProfile.passwordMismatch')
          })
        }
      }
    })

export const createChangePasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      currentPassword: z.string().min(1, t('securityCard.passwordRequired')),
      newPassword: z
        .string()
        .min(1, t('securityCard.passwordRequired'))
        .min(8, t('securityCard.passwordMinLength')),
      confirmNewPassword: z.string().min(1, t('securityCard.passwordRequired'))
    })
    .superRefine((data, ctx) => {
      if (data.newPassword !== data.confirmNewPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirmNewPassword'],
          message: t('securityCard.passwordMismatch')
        })
      }
    })

export const createOwnProfileEmailSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, t('addUser.errors.required'))
      .email(t('addUser.errors.invalidEmail'))
  })

export const hasOwnProfileSettingsChanges = (values: OwnProfileSettingsFormValues): boolean => {
  return hasEmailChange(values) || hasPasswordChange(values)
}
