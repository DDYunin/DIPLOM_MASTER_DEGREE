import type { User } from './model/types'
import type {
  AdminUserListItemDto,
  AdminUserResponse,
  AdminUsersPageDto,
  AdminUsersListQueryParams,
  CreateAdminUserRequest
} from './api/types'
import * as userApi from './api'
import {
  mapAdminUserDetailsToUser,
  mapAdminUserListItemToUser,
  mapAdminUserListItemsToUsers,
  mapUserResponseToUser
} from './lib/mappers'
import { useUserStore } from './model/store'

export {
  type User,
  type AdminUserListItemDto,
  type AdminUserResponse,
  type AdminUsersPageDto,
  type AdminUsersListQueryParams,
  type CreateAdminUserRequest,
  type UpdateUserByAdminRequest,
  useUserStore,
  mapAdminUserListItemToUser,
  mapAdminUserListItemsToUsers,
  mapUserResponseToUser,
  mapAdminUserDetailsToUser,
  userApi
}
