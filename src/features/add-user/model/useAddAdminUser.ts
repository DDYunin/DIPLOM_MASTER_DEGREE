import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

import { userApi, type CreateAdminUserRequest } from '@/entities/user'
import { useNotifications } from '@/shared/model'

export const useAddAdminUser = () => {
  const queryClient = useQueryClient()
  const notifications = useNotifications()
  const { t } = useI18n()

  return useMutation({
    mutationFn: (payload: CreateAdminUserRequest) => userApi.createAdminUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] })
      notifications.showToast('success', t('common.success'), t('addUser.success'))
    }
  })
}
