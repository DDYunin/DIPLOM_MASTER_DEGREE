export type CourseStatus = 'Active' | 'Draft' | 'Unpublished'

export interface Course {
  id: string
  title: string
  description: string
  status: CourseStatus
  studentsCount: number
  ownerUserId?: number
  coverImageId?: string
  createdAt?: string
  updatedAt?: string
  code: string
  term: string
  nextDueLabel: string
  nextDueDate: string
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