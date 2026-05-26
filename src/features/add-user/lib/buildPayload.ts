import type { CreateAdminUserRequest } from '@/entities/user'
import { ROLES } from '@/shared/config/roles'
import type { AddUserFormState } from './form'

export const buildCreateAdminUserPayload = (form: AddUserFormState): CreateAdminUserRequest => {
  const payload: CreateAdminUserRequest = {
    username: form.username.trim(),
    email: form.email.trim(),
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    role: form.role
  }

  const middleName = form.middleName.trim()
  if (middleName) {
    payload.middleName = middleName
  }

  if (form.role === ROLES.TEACHER && form.departmentId != null) {
    payload.departmentId = form.departmentId
  }

  if (form.role === ROLES.STUDENT) {
    if (form.groupId != null) {
      payload.groupId = form.groupId
    }
    if (form.departmentId != null) {
      payload.departmentId = form.departmentId
    }
  }

  return payload
}
