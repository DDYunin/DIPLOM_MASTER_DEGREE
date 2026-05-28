export interface FacultyDto {
  id: number
  name: string
  shortName: string
}

export interface DepartmentDto {
  id: number
  name: string
  facultyId: number
}

export interface FieldOfStudyDto {
  id: number
  name: string
  facultyId: number
}

export interface StudentGroupDto {
  id: number
  name: string
  facultyId: number
  fieldOfStudyId: number
}

export interface CreateFacultyRequest {
  name: string
  shortName: string
}

export interface UpdateFacultyRequest {
  name?: string
  shortName?: string
}

export interface CreateDepartmentRequest {
  name: string
  facultyId: number
}

export interface UpdateDepartmentRequest {
  name?: string
  facultyId?: number
}

export interface CreateFieldOfStudyRequest {
  name: string
  facultyId: number
}

export interface UpdateFieldOfStudyRequest {
  name?: string
  facultyId?: number
}

export interface CreateStudentGroupRequest {
  name: string
  facultyId: number
  fieldOfStudyId: number
}

export interface UpdateStudentGroupRequest {
  name?: string
  facultyId?: number
  fieldOfStudyId?: number
}

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
