import { describe, expect, it } from 'vitest'

import { ROLES } from '@/shared/config/roles'

import type { AdminUserListItemDto } from '../api/types'
import { mapAdminUserListItemToUser, mapAdminUserListItemsToUsers } from './mappers'

const createDto = (overrides: Partial<AdminUserListItemDto> = {}): AdminUserListItemDto => ({
  id: '1',
  username: 'ivanov',
  email: 'ivanov@example.com',
  firstName: 'Иван',
  lastName: 'Иванов',
  middleName: 'Иванович',
  active: true,
  roles: [ROLES.STUDENT],
  department: 'Кафедра информатики',
  ...overrides
})

describe('mapAdminUserListItemToUser', () => {
  it('maps basic fields and builds fullName from FIO', () => {
    const user = mapAdminUserListItemToUser(createDto())

    expect(user).toMatchObject({
      id: '1',
      firstName: 'Иван',
      lastName: 'Иванов',
      patronymic: 'Иванович',
      fullName: 'Иванов Иван Иванович',
      email: 'ivanov@example.com',
      role: 'Student',
      status: 'Active',
      department: 'Кафедра информатики',
      avatarInitials: 'ИИ'
    })
  })

  it('falls back to username when name parts are empty', () => {
    const user = mapAdminUserListItemToUser(
      createDto({
        firstName: '',
        lastName: '',
        middleName: undefined,
        username: 'guest_user'
      })
    )

    expect(user.fullName).toBe('guest_user')
    expect(user.avatarInitials).toBe('')
  })

  it('maps inactive status', () => {
    const user = mapAdminUserListItemToUser(createDto({ active: false }))

    expect(user.status).toBe('Inactive')
  })

  it('resolves primary role by priority when multiple roles are present', () => {
    const teacherUser = mapAdminUserListItemToUser(
      createDto({ roles: [ROLES.STUDENT, ROLES.TEACHER] })
    )
    const adminUser = mapAdminUserListItemToUser(
      createDto({ roles: [ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN] })
    )

    expect(teacherUser.role).toBe('Teacher')
    expect(adminUser.role).toBe('Super Admin')
  })

  it('maps backend role aliases', () => {
    expect(mapAdminUserListItemToUser(createDto({ roles: ['TEACHER'] })).role).toBe('Teacher')
    expect(mapAdminUserListItemToUser(createDto({ roles: ['MODERATOR'] })).role).toBe('Moderator')
    expect(mapAdminUserListItemToUser(createDto({ roles: ['unknown'] })).role).toBe('Student')
  })
})

describe('mapAdminUserListItemsToUsers', () => {
  it('maps each item in the list', () => {
    const users = mapAdminUserListItemsToUsers([
      createDto({ id: '1' }),
      createDto({ id: '2', roles: [ROLES.TEACHER] })
    ])

    expect(users).toHaveLength(2)
    expect(users[0]?.id).toBe('1')
    expect(users[1]?.role).toBe('Teacher')
  })
})
