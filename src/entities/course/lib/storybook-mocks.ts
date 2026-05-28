import type { Course, StudentCourse } from '../model/types'

export const mockTeacherCourseActive: Course = {
  id: 'course-1',
  code: 'MATH-101',
  title: 'Advanced Calculus',
  description: 'Limits, derivatives, integrals and applications in engineering problems.',
  status: 'Active',
  term: 'Fall 2026',
  studentsCount: 42,
  nextDueLabel: 'Midterm',
  nextDueDate: 'Oct 24'
}

export const mockTeacherCourseDraft: Course = {
  id: 'course-2',
  code: 'CS-204',
  title: 'Data Structures',
  description: 'Arrays, trees, graphs and algorithmic complexity analysis.',
  status: 'Draft',
  term: 'Spring 2026',
  studentsCount: 0,
  nextDueLabel: 'Lab 1',
  nextDueDate: '—'
}

export const mockStudentCourseSingleInstructor: StudentCourse = {
  id: 'student-course-1',
  code: 'WEB-301',
  title: 'Modern Web Development',
  category: 'Computer Science',
  status: 'Active',
  instructors: [{ id: 't-1', name: 'Dr. Anna Petrova' }]
}

export const mockStudentCourseMultipleInstructors: StudentCourse = {
  id: 'student-course-2',
  code: 'DB-210',
  title: 'Database Systems',
  category: 'Information Technology',
  status: 'Active',
  instructors: [
    { id: 't-2', name: 'Prof. Ivanov' },
    { id: 't-3', name: 'Dr. Smirnova' },
    { id: 't-4', name: 'Dr. Lee' }
  ]
}
