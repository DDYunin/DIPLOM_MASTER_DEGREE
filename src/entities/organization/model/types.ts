// Факультеты
export interface FacultyDTO {
  id: number
  name: string
  shortName: string
}

// Кафедры
export interface DepartmentDTO {
  id: number
  name: string
  facultyId: number
}

// Направления подготовки
export interface FieldOfStudyDTO {
  id: number
  code: string
  name: string
  facultyId: number
}

// Группы студентов
export interface StudentGroupDTO {
  id: number
  name: string
  facultyId: number
  fieldOfStudyId: number
}

export type OrgUnitType = 'faculty' | 'department' | 'fieldOfStudy' | 'group'

export interface OrgTreeNode {
  key: string
  label: string
  type: OrgUnitType
  leaf: boolean
  loading?: boolean
  data?: any
  children?: OrgTreeNode[]
}

export type TreeHierarchyType = 'academic' | 'administrative'

export interface HierarchyListQueryParams {
  page?: number
  size?: number
  sort?: string
}

export interface PageResponse<T> {
  items: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}
