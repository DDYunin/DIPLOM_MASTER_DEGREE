import type { User, StudentProfile, TeacherProfile } from './model/types'
import { mockUsers, mockStudentProfile, mockTeacherProfile } from './api/mock'
import { useUserStore } from './model/store'

export {
  type User,
  type StudentProfile,
  type TeacherProfile,
  mockUsers,
  mockStudentProfile,
  mockTeacherProfile,
  useUserStore
}
