import { ROLES } from '@/shared/config/roles'
import type { AddUserFormState } from './form'

export type AddUserFieldErrors = Partial<Record<keyof AddUserFormState, boolean>>

export const validateAddUserForm = (form: AddUserFormState): AddUserFieldErrors => {
  const errors: AddUserFieldErrors = {}

  if (!form.username.trim()) {
    errors.username = true
  }
  if (!form.email.trim()) {
    errors.email = true
  }
  if (!form.firstName.trim()) {
    errors.firstName = true
  }
  if (!form.lastName.trim()) {
    errors.lastName = true
  }
  if (!form.role) {
    errors.role = true
  }

  if (form.role === ROLES.TEACHER && form.departmentId == null) {
    errors.departmentId = true
  }

  if (form.role === ROLES.STUDENT && form.groupId == null) {
    errors.groupId = true
  }

  return errors
}

export const hasFormErrors = (errors: AddUserFieldErrors): boolean => Object.keys(errors).length > 0
