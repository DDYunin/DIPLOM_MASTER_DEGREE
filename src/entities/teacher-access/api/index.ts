import { api } from '@/shared/api'
import { usersApiPath } from '@/shared/config/api-routes'

import type {
  TeacherGroupAccessListQueryParams,
  TeacherGroupAccessPageDto,
  TeacherGroupAccessScopeDto,
  TeacherGroupAccessScopeRequest,
  TeacherScopeType,
  TeacherStudentGroupsPageDto,
  TeacherStudentGroupsQueryParams
} from './types'

export const grantTeacherGroupAccess = (teacherId: string, payload: TeacherGroupAccessScopeRequest) =>
  api<TeacherGroupAccessScopeDto>(usersApiPath(`/admin/teachers/${teacherId}/group-access`), {
    method: 'POST',
    body: JSON.stringify(payload)
  })

export const fetchTeacherGroupAccessByType = (
  teacherId: string,
  scopeType: TeacherScopeType,
  queryParams: TeacherGroupAccessListQueryParams = { page: 0, size: 500, sort: 'scopeId,ASC' }
) =>
  api<TeacherGroupAccessPageDto>(
    usersApiPath(`/admin/teachers/${teacherId}/group-access/by-type/${scopeType}`),
    {
      queryParams: queryParams as Record<string, string | number | boolean | null | undefined>
    }
  )

export const fetchTeacherStudentGroups = (
  queryParams: TeacherStudentGroupsQueryParams = { page: 0, size: 500, sort: 'name,ASC' }
) =>
  api<TeacherStudentGroupsPageDto>(usersApiPath('/teachers/me/student-groups'), {
    queryParams: queryParams as Record<string, string | number | boolean | null | undefined>
  })
