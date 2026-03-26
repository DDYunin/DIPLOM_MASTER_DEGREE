export interface CourseParticipant {
  id: string
  name: string
  email?: string
  avatarInitials: string
  avatarColor: string // Для красивых цветных кружочков
  group: string
  institute: string
  enrollmentDate: string
}
