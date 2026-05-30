import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, type MaybeRef, unref } from 'vue'

import { organizationApi } from '@/entities/organization'
import {
  mapAdminUserDetailsToUser,
  userApi,
  type User,
  type UserRole
} from '@/entities/user'

import { resolveHierarchyIds } from '../lib/resolve-hierarchy-ids'

export const adminUserProfileQueryKey = ['admin-user-profile'] as const

export const useAdminUserProfile = (
  userId: MaybeRef<string>,
  expectedRole: MaybeRef<UserRole>
) => {
  const queryClient = useQueryClient()

  const profileQuery = useQuery({
    queryKey: computed(() => [...adminUserProfileQueryKey, unref(userId)]),
    queryFn: async () => {
      const id = unref(userId)
      const details = await userApi.fetchAdminUserDetails(id)
      const mappedUser = mapAdminUserDetailsToUser(details, id)
      return resolveHierarchyIds(mappedUser)
    },
    enabled: computed(() => !!unref(userId))
  })

  const departmentsQuery = useQuery({
    queryKey: ['admin-user-profile-departments'],
    queryFn: () =>
      organizationApi.fetchDepartmentsList({ page: 0, size: 500, sort: 'name,ASC' }),
    enabled: computed(() => unref(expectedRole) === 'Teacher')
  })

  const groupsQuery = useQuery({
    queryKey: ['admin-user-profile-groups'],
    queryFn: () =>
      organizationApi.fetchStudentGroupsList({ page: 0, size: 500, sort: 'name,ASC' }),
    enabled: computed(() => unref(expectedRole) === 'Student')
  })

  const updateMutation = useMutation({
    mutationFn: (payload: Parameters<typeof userApi.updateAdminUser>[1]) =>
      userApi.updateAdminUser(unref(userId), payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...adminUserProfileQueryKey, unref(userId)]
      })
      await queryClient.invalidateQueries({ queryKey: ['admin-users-list'] })
    }
  })

  const departmentOptions = computed(() => departmentsQuery.data.value?.items ?? [])
  const groupOptions = computed(() => groupsQuery.data.value?.items ?? [])

  const isRoleMismatch = computed(() => {
    const profile = profileQuery.data.value
    if (!profile) {
      return false
    }

    return profile.role !== unref(expectedRole)
  })

  return {
    profileQuery,
    updateMutation,
    departmentOptions,
    groupOptions,
    isRoleMismatch
  }
}
