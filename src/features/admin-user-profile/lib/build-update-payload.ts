import type { UpdateUserByAdminRequest } from '@/entities/user'
import type { User } from '@/entities/user'

const normalizeOptionalText = (value?: string): string | undefined => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

export const buildUpdateUserByAdminPayload = (
  current: User,
  original: User
): UpdateUserByAdminRequest => {
  const payload: UpdateUserByAdminRequest = {}

  if (current.email.trim() !== original.email.trim()) {
    payload.email = current.email.trim()
  }

  if (current.firstName.trim() !== original.firstName.trim()) {
    payload.firstName = current.firstName.trim()
  }

  if (current.lastName.trim() !== original.lastName.trim()) {
    payload.lastName = current.lastName.trim()
  }

  const currentMiddleName = normalizeOptionalText(current.patronymic)
  const originalMiddleName = normalizeOptionalText(original.patronymic)

  if (currentMiddleName !== originalMiddleName) {
    payload.middleName = currentMiddleName ?? ''
  }

  if (current.role === 'Teacher' && current.departmentId !== original.departmentId) {
    if (current.departmentId != null) {
      payload.departmentId = current.departmentId
    }
  }

  if (current.role === 'Student' && current.groupId !== original.groupId) {
    if (current.groupId != null) {
      payload.groupId = current.groupId
    }
  }

  return payload
}

export const hasUpdateUserByAdminChanges = (payload: UpdateUserByAdminRequest): boolean => {
  return Object.keys(payload).length > 0
}
