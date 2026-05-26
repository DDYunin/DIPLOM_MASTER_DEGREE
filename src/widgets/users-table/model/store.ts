import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'

import { USERS_TABLE_FILTERS, type usersTableFilters } from '@/features/filter-users-by-role'
import {
  type AdminUsersListQueryParams,
  type User,
  mapAdminUserListItemsToUsers,
  userApi
} from '@/entities/user'

export const useAdminUsersTable = defineStore('widget-admin-users-table', () => {
  const searchQuery = ref('')
  const selectedRole = ref(USERS_TABLE_FILTERS.ALL)
  const page = ref(0)
  const rowsPerPage = ref(20)

  const buildSearchFilters = (rawSearch: string): Pick<
    AdminUsersListQueryParams,
    'firstName' | 'lastName' | 'email'
  > => {
    const trimmedSearch = rawSearch.trim()
    if (!trimmedSearch) {
      return {}
    }

    if (trimmedSearch.includes('@')) {
      return { email: trimmedSearch }
    }

    const parts = trimmedSearch.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return {
        firstName: parts[0],
        lastName: parts[1]
      }
    }

    return { firstName: trimmedSearch }
  }

  const queryParams = computed<AdminUsersListQueryParams>(() => {
    const params: AdminUsersListQueryParams = {
      page: page.value,
      size: rowsPerPage.value,
      sort: 'lastName,ASC'
    }

    const apiRole = selectedRole.value
    if (apiRole !== USERS_TABLE_FILTERS.ALL) {
      params.role = apiRole
    }

    return {
      ...params,
      ...buildSearchFilters(searchQuery.value)
    }
  })

  const usersQuery = useQuery({
    queryKey: computed(() => ['admin-users-list', queryParams.value]),
    queryFn: ({ queryKey }) => userApi.fetchUsersList(queryKey[1] as AdminUsersListQueryParams),
    placeholderData: keepPreviousData
  })

  const usersList = computed<User[]>(() => {
    return mapAdminUserListItemsToUsers(usersQuery.data.value?.items ?? [])
  })

  const totalUsers = computed(() => usersQuery.data.value?.totalElements ?? 0)
  const isLoading = computed(() => usersQuery.isFetching.value)

  const loadUsers = async () => {
    await usersQuery.refetch()
  }

  const resetPageAndLoad = () => {
    page.value = 0
  }

  const onPageChange = (event: { page: number; rows: number }) => {
    page.value = event.page
    rowsPerPage.value = event.rows
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
