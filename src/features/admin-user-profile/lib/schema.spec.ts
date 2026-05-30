import { describe, expect, it } from 'vitest'

import { createAdminUserProfileSchema } from './schema'

const t = (key: string) => key

describe('createAdminUserProfileSchema', () => {
  it('requires department for teacher', () => {
    const schema = createAdminUserProfileSchema(t, 'Teacher')
    const result = schema.safeParse({
      email: 'teacher@example.com',
      firstName: 'Ivan',
      lastName: 'Petrov',
      middleName: '',
      departmentId: null,
      groupId: null
    })

    expect(result.success).toBe(false)
  })

  it('requires group for student', () => {
    const schema = createAdminUserProfileSchema(t, 'Student')
    const result = schema.safeParse({
      email: 'student@example.com',
      firstName: 'Ivan',
      lastName: 'Petrov',
      middleName: '',
      departmentId: null,
      groupId: null
    })

    expect(result.success).toBe(false)
  })

  it('accepts valid teacher payload', () => {
    const schema = createAdminUserProfileSchema(t, 'Teacher')
    const result = schema.safeParse({
      email: 'teacher@example.com',
      firstName: 'Ivan',
      lastName: 'Petrov',
      middleName: '',
      departmentId: 3,
      groupId: null
    })

    expect(result.success).toBe(true)
  })
})
