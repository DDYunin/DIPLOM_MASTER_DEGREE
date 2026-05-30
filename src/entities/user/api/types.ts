export interface AdminUserListItemDto {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  middleName?: string
  active: boolean
  roles: string[]
  department?: string
}

export interface AdminUsersPageDto {
  items: AdminUserListItemDto[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}

export interface AdminUsersListQueryParams {
  role?: string
  firstName?: string
  lastName?: string
  email?: string
  active?: boolean
  page?: number
  size?: number
  sort?: string
}

export interface CreateAdminUserRequest {
  username: string
  email: string
  firstName: string
  lastName: string
  middleName?: string
  role: string
  groupId?: number
  departmentId?: number
}

export interface AdminUserResponse {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  middleName?: string
  active: boolean
  roles: string[]
}

export interface AdminUserDetailsResponse {
  firstName: string
  middleName?: string
  lastName: string
  email: string
  roles: string[]
  username: string
  faculty?: string
  fieldOfStudy?: string
  studentGroup?: string
  department?: string
}

export interface UserResponseDto {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  middleName?: string
  active: boolean
  roles: string[]
}

export interface UpdateUserByAdminRequest {
  email?: string
  username?: string
  firstName?: string
  lastName?: string
  middleName?: string
  groupId?: number
  departmentId?: number
  roles?: string[]
}

export interface UpdateOwnProfileRequest {
  email: string
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

export interface ChangeAvatarRequestDto {
  fileId: string
}
