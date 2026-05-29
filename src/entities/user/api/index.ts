import { api } from '@/shared/api'
import { usersApiPath } from '@/shared/config/api-routes'

import type {
  AdminUserDetailsResponse,
  AdminUsersListQueryParams,
  AdminUsersPageDto,
  AdminUserResponse,
  ChangeAvatarRequestDto,
  ChangePasswordRequest,
  CreateAdminUserRequest,
  UpdateOwnProfileRequest,
  UserResponseDto
} from './types'

export const fetchUsersList = (queryParams: AdminUsersListQueryParams = {}) =>
  api<AdminUsersPageDto>(usersApiPath('/admin/users'), {
    queryParams: queryParams as Record<string, string | number | boolean | null | undefined>
  })

export const fetchAdminUserDetails = (id: string) =>
  api<AdminUserDetailsResponse>(usersApiPath(`/admin/users/${id}`))

export const fetchCurrentUserProfile = () => api<UserResponseDto>(usersApiPath('/users/me'))

export const createAdminUser = (userData: CreateAdminUserRequest) =>
  api<AdminUserResponse>(usersApiPath('/admin/users'), {
    method: 'POST',
    body: JSON.stringify(userData)
  })

export const updateOwnProfileEmail = (payload: UpdateOwnProfileRequest) =>
  api<UserResponseDto>(usersApiPath('/users/me/email'), {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })

export const changeOwnPassword = (payload: ChangePasswordRequest) =>
  api<void>(usersApiPath('/users/me/password'), {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })

export const changeOwnAvatar = (payload: ChangeAvatarRequestDto) =>
  api<void>(usersApiPath('/users/me/avatar'), {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })
