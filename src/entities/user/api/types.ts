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
  page?: number
  size?: number
  search?: string
  role?: string
}
