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
