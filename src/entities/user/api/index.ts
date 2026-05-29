import { api } from '@/shared/api'

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
  api<AdminUsersPageDto>('/admin/users', {
    queryParams: queryParams as Record<string, string | number | boolean | null | undefined>
  })

export const fetchAdminUserDetails = (id: string) =>
  api<AdminUserDetailsResponse>(`/admin/users/${id}`)

export const fetchCurrentUserProfile = () => api<UserResponseDto>('/users/me')

export const createAdminUser = (userData: CreateAdminUserRequest) =>
  api<AdminUserResponse>('/admin/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  })

export const updateOwnProfileEmail = (payload: UpdateOwnProfileRequest) =>
  api<UserResponseDto>('/users/me/email', {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })

export const changeOwnPassword = (payload: ChangePasswordRequest) =>
  api<void>('/users/me/password', {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })

export const changeOwnAvatar = (payload: ChangeAvatarRequestDto) =>
  api<void>('/users/me/avatar', {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })
