import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

import {
  mapAdminUserDetailsToUser,
  mapUserResponseToUser,
  userApi,
  type User
} from '@/entities/user'
import { getCurrentUserId } from '@/shared/lib/jwt'

export const ownProfileQueryKey = ['own-profile'] as const

const fetchOwnProfile = async (userId: string): Promise<User> => {
  try {
    const response = await userApi.fetchCurrentUserProfile()
    return mapUserResponseToUser(response)
  } catch {
    const details = await userApi.fetchAdminUserDetails(userId)
    return mapAdminUserDetailsToUser(details, userId)
  }
}

export const useOwnProfile = () => {
  const queryClient = useQueryClient()
  const userId = computed(() => getCurrentUserId())

  const profileQuery = useQuery({
    queryKey: computed(() => [...ownProfileQueryKey, userId.value]),
    queryFn: () => fetchOwnProfile(userId.value!),
    enabled: computed(() => !!userId.value)
  })

  const updateEmailMutation = useMutation({
    mutationFn: (email: string) => userApi.updateOwnProfileEmail({ email }),
    onSuccess: (response) => {
      queryClient.setQueryData(
        [...ownProfileQueryKey, userId.value],
        mapUserResponseToUser(response)
      )
    }
  })

  const changePasswordMutation = useMutation({
    mutationFn: (payload: { oldPassword: string; newPassword: string }) =>
      userApi.changeOwnPassword(payload)
  })

  return {
    userId,
    profileQuery,
    updateEmailMutation,
    changePasswordMutation
  }
}
