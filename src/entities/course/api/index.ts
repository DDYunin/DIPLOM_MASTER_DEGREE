import { api } from '@/shared/api'
import type { Course, StudentCourse } from '../model/types'

// === GET ===
// Получить список курсов преподавателя
export const fetchCoursesList = () => api<Course[]>('/teacher/courses')

// === POST / PATCH ===
// (Предполагаю синтаксис передачи body для вашей обертки нативного fetch)

// Создать новый курс
export const createCourse = (courseData: Partial<Course>) =>
  api<Course>('/teacher/courses', {
    method: 'POST',
    body: JSON.stringify(courseData)
  })

// Обновить данные курса по ID
export const updateCourseById = (id: string, updatedData: Partial<Course>) =>
  api<Course>(`/teacher/courses/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updatedData)
  })

// Методы для студента

// === GET ===
export const fetchStudentCoursesList = () => api<StudentCourse[]>('/student/courses')