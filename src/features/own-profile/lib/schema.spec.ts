import { describe, expect, it } from 'vitest'

import {
  createChangePasswordSchema,
  createOwnProfileEmailSchema,
  createOwnProfileSettingsSchema,
  getOwnProfileSettingsInitialValues,
  hasOwnProfileSettingsChanges
} from './schema'

const t = (key: string) => key

describe('getOwnProfileSettingsInitialValues', () => {
  it('returns empty settings form', () => {
    expect(getOwnProfileSettingsInitialValues()).toEqual({
      newEmail: '',
      confirmNewEmail: '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    })
  })
})

describe('hasOwnProfileSettingsChanges', () => {
  it('returns false for empty form', () => {
    expect(hasOwnProfileSettingsChanges(getOwnProfileSettingsInitialValues())).toBe(false)
  })

  it('returns true when email fields are filled', () => {
    expect(
      hasOwnProfileSettingsChanges({
        ...getOwnProfileSettingsInitialValues(),
        newEmail: 'new@example.com'
      })
    ).toBe(true)
  })
})

describe('createOwnProfileSettingsSchema', () => {
  const schema = createOwnProfileSettingsSchema(t, 'current@example.com')

  it('accepts empty form without changes', () => {
    expect(schema.safeParse(getOwnProfileSettingsInitialValues()).success).toBe(true)
  })

  it('requires matching email fields', () => {
    const result = schema.safeParse({
      ...getOwnProfileSettingsInitialValues(),
      newEmail: 'new@example.com',
      confirmNewEmail: 'other@example.com'
    })

    expect(result.success).toBe(false)
  })

  it('rejects email equal to current email', () => {
    const result = schema.safeParse({
      ...getOwnProfileSettingsInitialValues(),
      newEmail: 'current@example.com',
      confirmNewEmail: 'current@example.com'
    })

    expect(result.success).toBe(false)
  })

  it('requires all password fields when changing password', () => {
    const result = schema.safeParse({
      ...getOwnProfileSettingsInitialValues(),
      newPassword: 'new-password'
    })

    expect(result.success).toBe(false)
  })

  it('accepts valid email change', () => {
    const result = schema.safeParse({
      ...getOwnProfileSettingsInitialValues(),
      newEmail: 'new@example.com',
      confirmNewEmail: 'new@example.com'
    })

    expect(result.success).toBe(true)
  })
})

describe('createChangePasswordSchema', () => {
  const schema = createChangePasswordSchema(t)

  it('accepts valid password change', () => {
    const result = schema.safeParse({
      currentPassword: 'OldP@ssw0rd',
      newPassword: 'NewP@ssw0rd',
      confirmNewPassword: 'NewP@ssw0rd'
    })

    expect(result.success).toBe(true)
  })

  it('rejects short new password', () => {
    const result = schema.safeParse({
      currentPassword: 'OldP@ssw0rd',
      newPassword: 'short',
      confirmNewPassword: 'short'
    })

    expect(result.success).toBe(false)
  })
})

describe('createOwnProfileEmailSchema', () => {
  const schema = createOwnProfileEmailSchema(t)

  it('accepts valid email', () => {
    expect(schema.safeParse({ email: 'admin@example.com' }).success).toBe(true)
  })

  it('rejects invalid email', () => {
    expect(schema.safeParse({ email: 'not-an-email' }).success).toBe(false)
  })
})
