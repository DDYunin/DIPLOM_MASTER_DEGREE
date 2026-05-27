import { describe, expect, it } from 'vitest'

import {
  buildCreateDepartmentPayload,
  buildCreateFacultyPayload,
  buildCreateFieldOfStudyPayload,
  buildCreateStudentGroupPayload
} from './buildPayload'

describe('organization buildPayload', () => {
  it('builds faculty create payload', () => {
    expect(
      buildCreateFacultyPayload({
        name: ' Faculty of IT ',
        shortName: ' IT '
      })
    ).toEqual({
      name: 'Faculty of IT',
      shortName: 'IT'
    })
  })

  it('builds department create payload', () => {
    expect(
      buildCreateDepartmentPayload(
        {
          name: ' Applied Math ',
          shortName: ''
        },
        12
      )
    ).toEqual({
      name: 'Applied Math',
      facultyId: 12
    })
  })

  it('builds field of study create payload', () => {
    expect(
      buildCreateFieldOfStudyPayload(
        {
          name: ' Software Engineering ',
          shortName: ''
        },
        3
      )
    ).toEqual({
      name: 'Software Engineering',
      facultyId: 3
    })
  })

  it('builds student group create payload with faculty and field ids', () => {
    expect(
      buildCreateStudentGroupPayload(
        {
          name: ' SE-23-01 ',
          shortName: ''
        },
        1,
        15
      )
    ).toEqual({
      name: 'SE-23-01',
      facultyId: 1,
      fieldOfStudyId: 15
    })
  })
})
