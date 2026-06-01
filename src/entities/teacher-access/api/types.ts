export type TeacherScopeType = 'STUDENT_GROUP' | 'FIELD_OF_STUDY' | 'FACULTY'

export interface TeacherGroupAccessScopeDto {
  scopeType: TeacherScopeType
  scopeId: number
}

export interface TeacherGroupAccessScopeRequest {
  scopeType: TeacherScopeType
  scopeId: number
}

export interface TeacherGroupAccessListQueryParams {
  page?: number
  size?: number
  sort?: string
}

export interface TeacherGroupAccessPageDto {
  items: TeacherGroupAccessScopeDto[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}

export interface TeacherGroupAccessScopeDetailsDto {
  scopeType: TeacherScopeType
  scopeId: number
  scopeName: string
}

export interface TeacherAccessScopeDisplay extends TeacherGroupAccessScopeDto {
  label: string
}

export interface TeacherStudentGroupDto {
  id: number
  name: string
  facultyId: number
  fieldOfStudyId: number
}

export interface TeacherStudentGroupsQueryParams {
  query?: string
  page?: number
  size?: number
  sort?: string
}

export interface TeacherStudentGroupsPageDto {
  items: TeacherStudentGroupDto[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}
