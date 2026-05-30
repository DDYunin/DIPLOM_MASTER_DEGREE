import { describe, expect, it } from 'vitest'

import type { User } from '@/entities/user'

import { buildUpdateUserByAdminPayload, hasUpdateUserByAdminChanges } from './build-update-payload'

const createUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-1',
  firstName: 'Ivan',
  lastName: 'Petrov',
  patronymic: 'Sergeevich',
  fullName: 'Petrov Ivan Sergeevich',
  email: 'ivan@example.com',
  role: 'Student',
  status: 'Active',
  groupId: 10,
  ...overrides
})

describe('buildUpdateUserByAdminPayload', () => {
  it('returns empty payload when nothing changed', () => {
    const user = createUser()
    expect(buildUpdateUserByAdminPayload(user, user)).toEqual({})
  })

  it('includes changed email and names', () => {
    const original = createUser()
    const current = createUser({
      email: 'new@example.com',
      firstName: 'Petr',
      lastName: 'Ivanov',
      patronymic: ''
    })

    expect(buildUpdateUserByAdminPayload(current, original)).toEqual({
      email: 'new@example.com',
      firstName: 'Petr',
      lastName: 'Ivanov',
      middleName: ''
    })
  })

  it('includes departmentId for teacher', () => {
    const original = createUser({ role: 'Teacher', departmentId: 1, groupId: null })
    const current = createUser({ role: 'Teacher', departmentId: 2, groupId: null })

    expect(buildUpdateUserByAdminPayload(current, original)).toEqual({
      departmentId: 2
    })
  })

  it('includes groupId for student', () => {
    const original = createUser({ groupId: 10 })
    const current = createUser({ groupId: 20 })

    expect(buildUpdateUserByAdminPayload(current, original)).toEqual({
      groupId: 20
    })
  })
})

describe('hasUpdateUserByAdminChanges', () => {
  it('detects non-empty payload', () => {
    expect(hasUpdateUserByAdminChanges({ email: 'a@b.com' })).toBe(true)
    expect(hasUpdateUserByAdminChanges({})).toBe(false)
  })
})
