import { describe, expect, it } from 'vitest'

import { ROLES } from '@/shared/config/roles'

import { createAddUserFormSchema, getAddUserInitialValues } from './schema'

const t = (key: string) => key

const validBase = {
  username: 'ivanov',
  email: 'ivanov@example.com',
  firstName: 'Иван',
  lastName: 'Иванов',
  middleName: '',
  role: ROLES.STUDENT,
  departmentId: 1,
  groupId: 10
}

describe('getAddUserInitialValues', () => {
  it('returns empty form with student role by default', () => {
    expect(getAddUserInitialValues()).toEqual({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      middleName: '',
      role: ROLES.STUDENT,
      departmentId: null,
      groupId: null
    })
  })
})

describe('createAddUserFormSchema', () => {
  const schema = createAddUserFormSchema(t)

  it('accepts valid student payload', () => {
    const result = schema.safeParse(validBase)

    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = schema.safeParse({ ...validBase, email: 'not-an-email' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === 'email')).toBe(true)
    }
  })

  it('requires department for teacher', () => {
    const result = schema.safeParse({
      ...validBase,
      role: ROLES.TEACHER,
      departmentId: null,
      groupId: null
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === 'departmentId')).toBe(true)
    }
  })

  it('requires group for student', () => {
    const result = schema.safeParse({
      ...validBase,
      groupId: null
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === 'groupId')).toBe(true)
    }
  })

  it('does not require department or group for admin', () => {
    const result = schema.safeParse({
      ...validBase,
      role: ROLES.ADMIN,
      departmentId: null,
      groupId: null
    })

    expect(result.success).toBe(true)
  })
})
