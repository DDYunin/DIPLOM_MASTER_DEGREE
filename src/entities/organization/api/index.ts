import { api } from '@/shared/api'
import type { FacultyDTO, DepartmentDTO, FieldOfStudyDTO, StudentGroupDTO } from '../model/types'

// === GET (Ленивая загрузка) ===
// Получить список факультетов
export const fetchFaculties = () => api<FacultyDTO[]>('/hierarchy/faculties')

// Получить список кафедр
export const fetchDepartments = (facultyId: number) =>
  api<DepartmentDTO[]>(`/hierarchy/departments?facultyId=${facultyId}`)

// Получить список учебных направлений
export const fetchFieldsOfStudy = (facultyId: number) =>
  api<FieldOfStudyDTO[]>(`/hierarchy/fields-of-study?facultyId=${facultyId}`)

// Получить список студеческих групп
export const fetchStudentGroups = (fieldOfStudyId: number) =>
  api<StudentGroupDTO[]>(`/hierarchy/student-groups?fieldOfStudyId=${fieldOfStudyId}`)

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
