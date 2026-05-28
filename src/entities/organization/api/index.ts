import { api } from '@/shared/api'

import type {
  CreateDepartmentRequest,
  CreateFacultyRequest,
  CreateFieldOfStudyRequest,
  CreateStudentGroupRequest,
  DepartmentDto,
  FacultyDto,
  FieldOfStudyDto,
  HierarchyListQueryParams,
  PageResponse,
  StudentGroupDto,
  UpdateDepartmentRequest,
  UpdateFacultyRequest,
  UpdateFieldOfStudyRequest,
  UpdateStudentGroupRequest
} from './types'

export const DEFAULT_HIERARCHY_LIST_PARAMS: HierarchyListQueryParams = {
  page: 0,
  size: 500,
  sort: 'name,ASC'
}

const withQueryParams = (queryParams: HierarchyListQueryParams = DEFAULT_HIERARCHY_LIST_PARAMS) =>
  queryParams as Record<string, string | number | boolean | null | undefined>

// === GET (lists) ===

export const fetchFaculties = (queryParams: HierarchyListQueryParams = DEFAULT_HIERARCHY_LIST_PARAMS) =>
  api<PageResponse<FacultyDto>>('/hierarchy/faculties', { queryParams: withQueryParams(queryParams) })

export const fetchFacultiesList = fetchFaculties

export const fetchDepartmentsByFaculty = (
  facultyId: number,
  queryParams: HierarchyListQueryParams = DEFAULT_HIERARCHY_LIST_PARAMS
) =>
  api<PageResponse<DepartmentDto>>(`/hierarchy/departments/by-faculty/${facultyId}`, {
    queryParams: withQueryParams(queryParams)
  })

export const fetchDepartmentsList = (queryParams: HierarchyListQueryParams = DEFAULT_HIERARCHY_LIST_PARAMS) =>
  api<PageResponse<DepartmentDto>>('/hierarchy/departments', {
    queryParams: withQueryParams(queryParams)
  })

export const fetchFieldsOfStudyByFaculty = (
  facultyId: number,
  queryParams: HierarchyListQueryParams = DEFAULT_HIERARCHY_LIST_PARAMS
) =>
  api<PageResponse<FieldOfStudyDto>>(`/hierarchy/fields-of-study/by-faculty/${facultyId}`, {
    queryParams: withQueryParams(queryParams)
  })

export const fetchStudentGroupsByFieldOfStudy = (
  fieldOfStudyId: number,
  queryParams: HierarchyListQueryParams = DEFAULT_HIERARCHY_LIST_PARAMS
) =>
  api<PageResponse<StudentGroupDto>>(`/hierarchy/student-groups/by-field-of-study/${fieldOfStudyId}`, {
    queryParams: withQueryParams(queryParams)
  })

export const fetchStudentGroupsList = (queryParams: HierarchyListQueryParams = DEFAULT_HIERARCHY_LIST_PARAMS) =>
  api<PageResponse<StudentGroupDto>>('/hierarchy/student-groups', {
    queryParams: withQueryParams(queryParams)
  })

export const fetchFacultyById = (id: number) => api<FacultyDto>(`/hierarchy/faculties/${id}`)

export const fetchDepartmentById = (id: number) => api<DepartmentDto>(`/hierarchy/departments/${id}`)

export const fetchFieldOfStudyById = (id: number) => api<FieldOfStudyDto>(`/hierarchy/fields-of-study/${id}`)

export const fetchStudentGroupById = (id: number) => api<StudentGroupDto>(`/hierarchy/student-groups/${id}`)

// === POST ===

export const createFaculty = (data: CreateFacultyRequest) =>
  api<FacultyDto>('/hierarchy/faculties', { method: 'POST', body: JSON.stringify(data) })

export const createDepartment = (data: CreateDepartmentRequest) =>
  api<DepartmentDto>('/hierarchy/departments', { method: 'POST', body: JSON.stringify(data) })

export const createFieldOfStudy = (data: CreateFieldOfStudyRequest) =>
  api<FieldOfStudyDto>('/hierarchy/fields-of-study', { method: 'POST', body: JSON.stringify(data) })

export const createStudentGroup = (data: CreateStudentGroupRequest) =>
  api<StudentGroupDto>('/hierarchy/student-groups', { method: 'POST', body: JSON.stringify(data) })

// === PATCH ===

export const updateFaculty = (id: number, data: UpdateFacultyRequest) =>
  api<FacultyDto>(`/hierarchy/faculties/${id}`, { method: 'PATCH', body: JSON.stringify(data) })

export const updateDepartment = (id: number, data: UpdateDepartmentRequest) =>
  api<DepartmentDto>(`/hierarchy/departments/${id}`, { method: 'PATCH', body: JSON.stringify(data) })

export const updateFieldOfStudy = (id: number, data: UpdateFieldOfStudyRequest) =>
  api<FieldOfStudyDto>(`/hierarchy/fields-of-study/${id}`, { method: 'PATCH', body: JSON.stringify(data) })

export const updateStudentGroup = (id: number, data: UpdateStudentGroupRequest) =>
  api<StudentGroupDto>(`/hierarchy/student-groups/${id}`, { method: 'PATCH', body: JSON.stringify(data) })

// === DELETE ===

export const deleteFaculty = (id: number) => api(`/hierarchy/faculties/${id}`, { method: 'DELETE' })

export const deleteDepartment = (id: number) => api(`/hierarchy/departments/${id}`, { method: 'DELETE' })

export const deleteFieldOfStudy = (id: number) =>
  api(`/hierarchy/fields-of-study/${id}`, { method: 'DELETE' })

export const deleteStudentGroup = (id: number) =>
  api(`/hierarchy/student-groups/${id}`, { method: 'DELETE' })
