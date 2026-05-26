import { ROLES, type AppRole } from '@/shared/config/roles'

export interface AddUserFormState {
  username: string
  email: string
  firstName: string
  lastName: string
  middleName: string
  role: AppRole
  departmentId: number | null
  groupId: number | null
}

export const createInitialFormState = (): AddUserFormState => ({
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  middleName: '',
  role: ROLES.STUDENT,
  departmentId: null,
  groupId: null
})
