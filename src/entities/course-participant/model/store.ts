import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CourseParticipant } from './types'

export const useCourseParticipantStore = defineStore('course-participant', () => {
  // Мок-данные по макету
  const participants = ref<CourseParticipant[]>([
    {
      id: '1',
      name: 'John Doe',
      avatarInitials: 'JD',
      avatarColor: 'var(--p-blue-100)',
      group: 'CS-2023-A',
      institute: 'Engineering',
      enrollmentDate: 'Oct 24, 2023'
    },
    {
      id: '2',
      name: 'Sarah Smith',
      avatarInitials: 'SS',
      avatarColor: 'var(--p-orange-100)',
      group: 'CS-2023-A',
      institute: 'Engineering',
      enrollmentDate: 'Oct 23, 2023'
    },
    {
      id: '3',
      name: 'Alexey Kuznetsov',
      avatarInitials: 'AK',
      avatarColor: 'var(--p-purple-100)',
      group: 'CS-2023-B',
      institute: 'Science',
      enrollmentDate: 'Oct 20, 2023'
    },
    {
      id: '4',
      name: 'Michael Chen',
      avatarInitials: 'MC',
      avatarColor: 'var(--p-gray-100)',
      group: 'CS-2023-A',
      institute: 'Engineering',
      enrollmentDate: 'Oct 18, 2023'
    },
    {
      id: '5',
      name: 'Elena Sokolova',
      avatarInitials: 'ES',
      avatarColor: 'var(--p-green-100)',
      group: 'CS-2023-C',
      institute: 'Mathematics',
      enrollmentDate: 'Oct 15, 2023'
    }
  ])

  const totalStudents = computed(() => participants.value.length)
  const activeGroups = computed(() => new Set(participants.value.map((p) => p.group)).size)

  const removeParticipant = (id: string) => {
    participants.value = participants.value.filter((p) => p.id !== id)
  }

  return { participants, totalStudents, activeGroups, removeParticipant }
})
