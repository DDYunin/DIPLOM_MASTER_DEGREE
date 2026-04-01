import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { StudentGradeRow } from './types'

export const useCourseGradeStore = defineStore('course-grade', () => {
  // Мок-данные строго по твоему второму макету
  const gradebook = ref<StudentGradeRow[]>([
    {
      id: '1',
      student: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatarInitials: 'JD',
        avatarColor: 'var(--p-blue-100)'
      },
      group: 'CS-2023-A',
      grades: {
        quiz1: { score: 85, maxScore: 100 },
        midterm: { score: 92, maxScore: 100 },
        essay: { score: 45, maxScore: 50 },
        final: { score: '--', maxScore: 100 }
      },
      totalPercent: 92
    },
    {
      id: '2',
      student: {
        name: 'Sarah Smith',
        email: 'sarah.s@example.com',
        avatarInitials: 'SS',
        avatarColor: 'var(--p-orange-100)'
      },
      group: 'CS-2023-A',
      grades: {
        quiz1: { score: 98, maxScore: 100 },
        midterm: { score: 88, maxScore: 100 },
        essay: { score: 48, maxScore: 50 },
        final: { score: '--', maxScore: 100 }
      },
      totalPercent: 95
    },
    {
      id: '3',
      student: {
        name: 'Alexey Kuznetsov',
        email: 'alexey.k@example.com',
        avatarInitials: 'AK',
        avatarColor: 'var(--p-purple-100)'
      },
      group: 'CS-2023-B',
      grades: {
        quiz1: { score: 65, maxScore: 100 },
        midterm: { score: 72, maxScore: 100 },
        essay: { score: 38, maxScore: 50 },
        final: { score: '--', maxScore: 100 }
      },
      totalPercent: 74
    },
    {
      id: '4',
      student: {
        name: 'Michael Chen',
        email: 'm.chen@example.com',
        avatarInitials: 'MC',
        avatarColor: 'var(--p-gray-100)'
      },
      group: 'CS-2023-A',
      grades: {
        quiz1: { score: 45, maxScore: 100 },
        midterm: { score: 55, maxScore: 100 },
        essay: { score: 'Late', maxScore: 50 },
        final: { score: '--', maxScore: 100 }
      },
      totalPercent: 42
    },
    {
      id: '5',
      student: {
        name: 'Elena Sokolova',
        email: 'elena.s@example.com',
        avatarInitials: 'ES',
        avatarColor: 'var(--p-green-100)'
      },
      group: 'CS-2023-C',
      grades: {
        quiz1: { score: 90, maxScore: 100 },
        midterm: { score: 89, maxScore: 100 },
        essay: { score: 49, maxScore: 50 },
        final: { score: '--', maxScore: 100 }
      },
      totalPercent: 93
    }
  ])

  return { gradebook }
})
