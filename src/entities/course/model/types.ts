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
