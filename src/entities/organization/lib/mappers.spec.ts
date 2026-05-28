import { describe, expect, it } from 'vitest'

import {
  mapDepartmentToNode,
  mapFacultyToNode,
  mapFieldOfStudyToNode,
  mapStudentGroupToNode
} from './mappers'

describe('organization mappers', () => {
  it('maps faculty to expandable tree node', () => {
    const node = mapFacultyToNode({ id: 1, name: 'Факультет ИТ', shortName: 'ИТ' })

    expect(node).toEqual({
      key: 'faculty-1',
      label: 'Факультет ИТ',
      type: 'faculty',
      leaf: false,
      data: { originalId: 1, shortName: 'ИТ' }
    })
  })

  it('maps department to leaf node with parent reference', () => {
    const node = mapDepartmentToNode({ id: 10, name: 'Кафедра ПО', facultyId: 1 })

    expect(node).toEqual({
      key: 'dept-10',
      label: 'Кафедра ПО',
      type: 'department',
      leaf: true,
      data: { originalId: 10, parentId: 1, facultyId: 1 }
    })
  })

  it('maps field of study to expandable node', () => {
    const node = mapFieldOfStudyToNode({
      id: 5,
      name: 'Информатика',
      facultyId: 1
    })

    expect(node).toEqual({
      key: 'field-5',
      label: 'Информатика',
      type: 'fieldOfStudy',
      leaf: false,
      data: { originalId: 5, parentId: 1, facultyId: 1 }
    })
  })

  it('maps student group to leaf node', () => {
    const node = mapStudentGroupToNode({
      id: 42,
      name: 'ИВТ-401',
      facultyId: 1,
      fieldOfStudyId: 5
    })

    expect(node).toEqual({
      key: 'group-42',
      label: 'ИВТ-401',
      type: 'group',
      leaf: true,
      data: { originalId: 42, parentId: 5, facultyId: 1, fieldOfStudyId: 5 }
    })
  })
})
