import { useMutation } from '@tanstack/vue-query'

import {
  buildCreateDepartmentPayload,
  buildCreateFacultyPayload,
  buildCreateFieldOfStudyPayload,
  buildCreateStudentGroupPayload,
  mapDepartmentToNode,
  mapFacultyToNode,
  mapFieldOfStudyToNode,
  mapStudentGroupToNode,
  organizationApi,
  parseOrgNodeDbId,
  type OrgTreeNode,
  type OrgUnitType
} from '@/entities/organization'

import type { AddOrgUnitFormValues } from '../lib/schema'

export interface CreateOrgUnitVariables {
  childType: OrgUnitType
  form: AddOrgUnitFormValues
  parentNode: OrgTreeNode | null
}

export const useCreateOrgUnit = () =>
  useMutation({
    mutationFn: async ({ childType, form, parentNode }: CreateOrgUnitVariables) => {
      if (childType === 'faculty') {
        const dto = await organizationApi.createFaculty(buildCreateFacultyPayload(form))
        return mapFacultyToNode(dto)
      }

      if (!parentNode) {
        throw new Error('Parent node is required')
      }

      const parentDbId = parseOrgNodeDbId(parentNode.key)

      if (childType === 'department') {
        const dto = await organizationApi.createDepartment(
          buildCreateDepartmentPayload(form, parentDbId)
        )
        return mapDepartmentToNode(dto)
      }

      if (childType === 'fieldOfStudy') {
        const dto = await organizationApi.createFieldOfStudy(
          buildCreateFieldOfStudyPayload(form, parentDbId)
        )
        return mapFieldOfStudyToNode(dto)
      }

      if (childType === 'group') {
        const facultyId = parentNode.data?.facultyId ?? parentNode.data?.parentId
        if (facultyId == null) {
          throw new Error('Faculty id is required to create a student group')
        }

        const dto = await organizationApi.createStudentGroup(
          buildCreateStudentGroupPayload(form, facultyId, parentDbId)
        )
        return mapStudentGroupToNode(dto)
      }

      throw new Error(`Unsupported organization unit type: ${childType}`)
    }
  })
