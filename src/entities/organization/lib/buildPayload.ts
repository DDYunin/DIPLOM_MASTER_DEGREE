import type {
  CreateDepartmentRequest,
  CreateFacultyRequest,
  CreateFieldOfStudyRequest,
  CreateStudentGroupRequest,
  UpdateDepartmentRequest,
  UpdateFacultyRequest,
  UpdateFieldOfStudyRequest,
  UpdateStudentGroupRequest
} from '../api/types'
import type { OrgTreeNode } from '../model/types'

export interface CreateOrgUnitFormValues {
  name: string
  shortName: string
}

export const buildCreateFacultyPayload = (form: CreateOrgUnitFormValues): CreateFacultyRequest => ({
  name: form.name.trim(),
  shortName: form.shortName.trim()
})

export const buildCreateDepartmentPayload = (
  form: CreateOrgUnitFormValues,
  facultyId: number
): CreateDepartmentRequest => ({
  name: form.name.trim(),
  facultyId
})

export const buildCreateFieldOfStudyPayload = (
  form: CreateOrgUnitFormValues,
  facultyId: number
): CreateFieldOfStudyRequest => ({
  name: form.name.trim(),
  facultyId
})

export const buildCreateStudentGroupPayload = (
  form: CreateOrgUnitFormValues,
  facultyId: number,
  fieldOfStudyId: number
): CreateStudentGroupRequest => ({
  name: form.name.trim(),
  facultyId,
  fieldOfStudyId
})

export const buildUpdateFacultyPayload = (node: OrgTreeNode): UpdateFacultyRequest => ({
  name: node.label.trim(),
  shortName: node.data?.shortName?.trim()
})

export const buildUpdateDepartmentPayload = (node: OrgTreeNode): UpdateDepartmentRequest => ({
  name: node.label.trim()
})

export const buildUpdateFieldOfStudyPayload = (node: OrgTreeNode): UpdateFieldOfStudyRequest => ({
  name: node.label.trim()
})

export const buildUpdateStudentGroupPayload = (node: OrgTreeNode): UpdateStudentGroupRequest => ({
  name: node.label.trim()
})
