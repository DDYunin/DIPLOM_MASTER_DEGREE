import { api } from '@/shared/api'
import type {
  DepartmentDTO,
  FacultyDTO,
  FieldOfStudyDTO,
  HierarchyListQueryParams,
  PageResponse,
  StudentGroupDTO
} from '../model/types'

// === GET (Ленивая загрузка) ===

// Получить список факультетов
export const fetchFaculties = () => api<FacultyDTO[]>('/hierarchy/faculties')

// Получить список кафедр по факультету (ленивая загрузка дерева)
export const fetchDepartments = (facultyId: number) =>
  api<DepartmentDTO[]>(`/hierarchy/departments?facultyId=${facultyId}`)

// Плоский paginated список кафедр
export const fetchDepartmentsList = (queryParams: HierarchyListQueryParams = {}) =>
  api<PageResponse<DepartmentDTO>>('/hierarchy/departments', {
    queryParams: queryParams as Record<string, string | number | boolean | null | undefined>
  })

// Получить список учебных направлений
export const fetchFieldsOfStudy = (facultyId: number) =>
  api<FieldOfStudyDTO[]>(`/hierarchy/fields-of-study?facultyId=${facultyId}`)

// Получить список студенческих групп по направлению (ленивая загрузка дерева)
export const fetchStudentGroups = (fieldOfStudyId: number) =>
  api<StudentGroupDTO[]>(`/hierarchy/student-groups?fieldOfStudyId=${fieldOfStudyId}`)

// Плоский paginated список студенческих групп
export const fetchStudentGroupsList = (queryParams: HierarchyListQueryParams = {}) =>
  api<PageResponse<StudentGroupDTO>>('/hierarchy/student-groups', {
    queryParams: queryParams as Record<string, string | number | boolean | null | undefined>
  })



// === POST (Создание новых узлов) ===

export const createFaculty = (data: Partial<FacultyDTO>) => 
  api<FacultyDTO>('/hierarchy/faculties', { method: 'POST', body: JSON.stringify(data) });

export const createDepartment = (data: Partial<DepartmentDTO>) => 
  api<DepartmentDTO>('/hierarchy/departments', { method: 'POST', body: JSON.stringify(data) });

export const createFieldOfStudy = (data: Partial<FieldOfStudyDTO>) => 
  api<FieldOfStudyDTO>('/hierarchy/fields-of-study', { method: 'POST', body: JSON.stringify(data) });

export const createStudentGroup = (data: Partial<StudentGroupDTO>) => 
  api<StudentGroupDTO>('/hierarchy/student-groups', { method: 'POST', body: JSON.stringify(data) });



// === PATCH (Обновление существующих узлов) ===

export const updateFaculty = (id: number, data: Partial<FacultyDTO>) => 
  api<FacultyDTO>(`/hierarchy/faculties/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

export const updateDepartment = (id: number, data: Partial<DepartmentDTO>) => 
  api<DepartmentDTO>(`/hierarchy/departments/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

export const updateFieldOfStudy = (id: number, data: Partial<FieldOfStudyDTO>) => 
  api<FieldOfStudyDTO>(`/hierarchy/fields-of-study/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

export const updateStudentGroup = (id: number, data: Partial<StudentGroupDTO>) => 
  api<StudentGroupDTO>(`/hierarchy/student-groups/${id}`, { method: 'PATCH', body: JSON.stringify(data) });



// === DELETE (Удаление узлов) ===
export const deleteFaculty = (id: number) => 
  api(`/hierarchy/faculties/${id}`, { method: 'DELETE' });

export const deleteDepartment = (id: number) => 
  api(`/hierarchy/departments/${id}`, { method: 'DELETE' });

export const deleteFieldOfStudy = (id: number) => 
  api(`/hierarchy/fields-of-study/${id}`, { method: 'DELETE' });

export const deleteStudentGroup = (id: number) => 
  api(`/hierarchy/student-groups/${id}`, { method: 'DELETE' });