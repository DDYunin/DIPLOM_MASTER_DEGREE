import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { ROLES } from '@/shared/config/roles'
import {
  type User,
  type AdminUsersListQueryParams,
  useUserStore,
  userApi,
  mapAdminUserListItemsToUsers
} from '@/entities/user'

const ALL_USERS_ROLE = 'All Users'

const UI_ROLE_TO_API_ROLE: Record<string, string | undefined> = {
  [ALL_USERS_ROLE]: undefined,
  Admin: ROLES.ADMIN,
  Teacher: ROLES.TEACHER,
  Student: ROLES.STUDENT
}

export const useAdminUsersTable = defineStore('widget-admin-users-table', () => {
  const usersStore = useUserStore()

  const isLoading = ref(false)
  const totalUsers = ref(0)
  const userIds = ref<string[]>([])

  const searchQuery = ref('')
  const selectedRole = ref(ALL_USERS_ROLE)
  const page = ref(0)
  const rowsPerPage = ref(5)

  const usersList = computed(() => {
    return userIds.value
      .map((id) => usersStore.getUserById(id))
      .filter((user): user is User => Boolean(user))
  })

  const buildQueryParams = (): AdminUsersListQueryParams => {
    const params: AdminUsersListQueryParams = {
      page: page.value,
      size: rowsPerPage.value
    }

    const trimmedSearch = searchQuery.value.trim()
    if (trimmedSearch) {
      params.search = trimmedSearch
    }

    const apiRole = UI_ROLE_TO_API_ROLE[selectedRole.value]
    if (apiRole) {
      params.role = apiRole
    }

    return params
  }

  const loadUsers = async () => {
    isLoading.value = true
    try {
      const response = await userApi.fetchUsersList(buildQueryParams())
      const users = mapAdminUserListItemsToUsers(response.items)

      usersStore.upsertUsers(users)
      userIds.value = users.map((user) => user.id)
      totalUsers.value = response.totalElements
      page.value = response.page
      rowsPerPage.value = response.size || rowsPerPage.value
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  const resetPageAndLoad = () => {
    page.value = 0
    loadUsers()
  }

  const onPageChange = (event: { page: number; rows: number }) => {
    page.value = event.page
    rowsPerPage.value = event.rows
    loadUsers()
  }

  watch(selectedRole, () => {
    resetPageAndLoad()
  })

  watchDebounced(searchQuery, () => {
    resetPageAndLoad()
  }, { debounce: 300 })

  return {
    isLoading,
    totalUsers,
    usersList,
    searchQuery,
    selectedRole,
    page,
    rowsPerPage,
    loadUsers,
    onPageChange
  }
})
