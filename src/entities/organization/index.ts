import type {
  DepartmentDto,
  FacultyDto,
  FieldOfStudyDto,
  HierarchyListQueryParams,
  PageResponse,
  StudentGroupDto
} from './api/types'
import * as organizationApi from './api'
import {
  buildCreateDepartmentPayload,
  buildCreateFacultyPayload,
  buildCreateFieldOfStudyPayload,
  buildCreateStudentGroupPayload,
  buildUpdateDepartmentPayload,
  buildUpdateFacultyPayload,
  buildUpdateFieldOfStudyPayload,
  buildUpdateStudentGroupPayload,
  type CreateOrgUnitFormValues
} from './lib/buildPayload'
import {
  mapDepartmentToNode,
  mapFacultyToNode,
  mapFieldOfStudyToNode,
  mapStudentGroupToNode
} from './lib/mappers'
import { useOrgStore } from './model/store'
import {
  parseOrgNodeDbId,
  type OrgTreeNode,
  type OrgTreeNodeData,
  type OrgUnitType,
  type TreeHierarchyType
} from './model/types'

export {
  type DepartmentDto,
  type FacultyDto,
  type FieldOfStudyDto,
  type HierarchyListQueryParams,
  type PageResponse,
  type StudentGroupDto,
  type CreateOrgUnitFormValues,
  type OrgTreeNode,
  type OrgTreeNodeData,
  type OrgUnitType,
  type TreeHierarchyType,
  organizationApi,
  buildCreateDepartmentPayload,
  buildCreateFacultyPayload,
  buildCreateFieldOfStudyPayload,
  buildCreateStudentGroupPayload,
  buildUpdateDepartmentPayload,
  buildUpdateFacultyPayload,
  buildUpdateFieldOfStudyPayload,
  buildUpdateStudentGroupPayload,
  mapDepartmentToNode,
  mapFacultyToNode,
  mapFieldOfStudyToNode,
  mapStudentGroupToNode,
  parseOrgNodeDbId,
  useOrgStore
}
