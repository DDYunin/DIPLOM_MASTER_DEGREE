export type {
  DepartmentDto,
  FacultyDto,
  FieldOfStudyDto,
  HierarchyListQueryParams,
  PageResponse,
  StudentGroupDto
} from '../api/types'

export type OrgUnitType = 'faculty' | 'department' | 'fieldOfStudy' | 'group'

export interface OrgTreeNodeData {
  originalId: number
  shortName?: string
  parentId?: number
  facultyId?: number
  fieldOfStudyId?: number
}

export interface OrgTreeNode {
  key: string
  label: string
  type: OrgUnitType
  leaf: boolean
  loading?: boolean
  data?: OrgTreeNodeData
  children?: OrgTreeNode[]
}

export type TreeHierarchyType = 'academic' | 'administrative'

export const parseOrgNodeDbId = (key: string): number => {
  const [, rawId] = key.split('-')
  const id = Number(rawId)
  if (!Number.isFinite(id)) {
    throw new Error(`Invalid organization node key: ${key}`)
  }
  return id
}
