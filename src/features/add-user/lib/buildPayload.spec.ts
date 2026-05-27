import { describe, expect, it } from 'vitest'

import { ROLES } from '@/shared/config/roles'

import { buildCreateAdminUserPayload } from './buildPayload'
import type { AddUserFormValues } from './schema'

const createForm = (overrides: Partial<AddUserFormValues> = {}): AddUserFormValues => ({
  username: '  ivanov  ',
  email: '  ivanov@example.com  ',
  firstName: '  Иван  ',
  lastName: '  Иванов  ',
  middleName: '  Иванович  ',
  role: ROLES.STUDENT,
  departmentId: 10,
  groupId: 42,
  ...overrides
})

describe('buildCreateAdminUserPayload', () => {
  it('trims string fields and maps base payload', () => {
    const payload = buildCreateAdminUserPayload(createForm())

    expect(payload).toEqual({
      username: 'ivanov',
      email: 'ivanov@example.com',
      firstName: 'Иван',
      lastName: 'Иванов',
      middleName: 'Иванович',
      role: ROLES.STUDENT,
      groupId: 42,
      departmentId: 10
    })
  })

  it('omits middleName when it is empty after trim', () => {
    const payload = buildCreateAdminUserPayload(createForm({ middleName: '   ' }))

    expect(payload.middleName).toBeUndefined()
  })

  it('includes departmentId for teacher', () => {
    const payload = buildCreateAdminUserPayload(
      createForm({
        role: ROLES.TEACHER,
        departmentId: 7,
        groupId: null
      })
    )

    expect(payload).toMatchObject({
      role: ROLES.TEACHER,
      departmentId: 7
    })
    expect(payload.groupId).toBeUndefined()
  })

  it('includes groupId and departmentId for student when provided', () => {
    const payload = buildCreateAdminUserPayload(
      createForm({
        role: ROLES.STUDENT,
        groupId: 99,
        departmentId: 3
      })
    )

    expect(payload.groupId).toBe(99)
    expect(payload.departmentId).toBe(3)
  })

  it('does not include departmentId for admin role', () => {
    const payload = buildCreateAdminUserPayload(
      createForm({
        role: ROLES.ADMIN,
        departmentId: 5,
        groupId: 99
      })
    )

    expect(payload.departmentId).toBeUndefined()
    expect(payload.groupId).toBeUndefined()
  })
})
