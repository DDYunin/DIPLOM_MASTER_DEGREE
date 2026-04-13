export type CourseStatus = 'Active' | 'Draft' | 'Unpublished'

export interface Course {
  id: string
  code: string // Например, MATH-101
  title: string // Например, Advanced Calculus
  description: string
  status: CourseStatus
  term: string // Например, Fall 2023
  studentsCount: number
  nextDueLabel: string // Например, Midterm, Lab 3
  nextDueDate: string // Например, Oct 24
  // Опциональное поле для обложки, если в будущем добавим картинки
  coverUrl?: string
}

export interface Instructor {
  id: string
  name: string
  avatarUrl?: string
}

export interface StudentCourse {
  id: string
  code: string
  title: string
  category: string
  status: 'Active' | 'Completed'
  coverUrl?: string
  instructors: Instructor[]
}

// TODO: похожие типы есть в course-content сущности
export type CourseElementType = 'video' | 'pdf' | 'quiz' | 'assignment'
export type ProgressStatus = 'completed' | 'current' | 'locked'

export interface CourseElement {
  id: string
  title: string
  type: CourseElementType
  meta: string // Например: "Video • 12:45 min" или "15 questions • 50 pts"
  status: ProgressStatus
}

export interface CourseModule {
  id: string
  order: number // Для вывода "MODULE 01"
  title: string
  status: ProgressStatus
  elements: CourseElement[]
}

export interface StudentCourseDetails extends StudentCourse {
  description: string
  gradePercentage: number
  completedElements: number
  totalElements: number
  modules: CourseModule[]
}