import { describe, expect, it } from 'vitest'

import type { OrgTreeNode } from '@/entities/organization'

import { canAddOrgUnit, resolveChildType } from './resolveChildType'

const facultyNode: OrgTreeNode = {
  key: 'faculty-1',
  label: 'Faculty',
  type: 'faculty',
  leaf: false,
  data: { originalId: 1 }
}

const fieldNode: OrgTreeNode = {
  key: 'field-5',
  label: 'Field',
  type: 'fieldOfStudy',
  leaf: false,
  data: { originalId: 5, facultyId: 1 }
}

describe('resolveChildType', () => {
  it('returns faculty for root create', () => {
    expect(resolveChildType(null, 'academic')).toBe('faculty')
  })

  it('returns department under faculty in administrative tree', () => {
    expect(resolveChildType(facultyNode, 'administrative')).toBe('department')
  })

  it('returns field of study under faculty in academic tree', () => {
    expect(resolveChildType(facultyNode, 'academic')).toBe('fieldOfStudy')
  })

  it('returns group under field of study', () => {
    expect(resolveChildType(fieldNode, 'academic')).toBe('group')
  })
})

describe('canAddOrgUnit', () => {
  it('allows create at root', () => {
    expect(canAddOrgUnit(null, 'academic')).toBe(true)
  })

  it('allows department only under faculty in administrative tree', () => {
    expect(canAddOrgUnit(facultyNode, 'administrative')).toBe(true)
    expect(canAddOrgUnit(fieldNode, 'administrative')).toBe(false)
  })

  it('allows group only under field of study in academic tree', () => {
    expect(canAddOrgUnit(facultyNode, 'academic')).toBe(true)
    expect(canAddOrgUnit(fieldNode, 'academic')).toBe(true)
  })
})
