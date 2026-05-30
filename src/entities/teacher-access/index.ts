export {
  grantTeacherGroupAccess,
  fetchTeacherGroupAccess,
  revokeTeacherGroupAccess,
  fetchTeacherGroupAccessByType,
  fetchTeacherStudentGroups
} from './api'
export type {
  TeacherAccessScopeDisplay,
  TeacherGroupAccessScopeDetailsDto,
  TeacherGroupAccessScopeDto,
  TeacherGroupAccessScopeRequest,
  TeacherScopeType,
  TeacherStudentGroupDto
} from './api/types'
