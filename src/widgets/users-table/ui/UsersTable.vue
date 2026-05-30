<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useConfirm } from 'primevue/useconfirm'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

import { type User, userApi } from '@/entities/user'
import { SearchUser } from '@/features/search-user'
import { FilterUsersByRole } from '@/features/filter-users-by-role'
import { useNotifications } from '@/shared/model'
import { useAdminUsersTable } from '../model/store'

const { t } = useI18n()
const router = useRouter()
const confirm = useConfirm()
const notifications = useNotifications()
const queryClient = useQueryClient()
const adminUsersTableStore = useAdminUsersTable()

const deletingUserId = ref<string | null>(null)

const deleteUserMutation = useMutation({
  mutationFn: (userId: string) => userApi.deleteAdminUser(userId),
  onSuccess: () => {
    notifications.showToast('success', t('common.success'), t('adminUsers.userDeleted'))
    queryClient.invalidateQueries({ queryKey: ['admin-users-list'] })
  },
  onSettled: () => {
    deletingUserId.value = null
  }
})

const onRowClick = (event: { data: User }) => {
  const user = event.data
  if (user.role === 'Student') {
    router.push({
      name: 'admin-student-profile',
      params: { id: user.id }
    })
  }
  if (user.role === 'Teacher') {
    router.push({ name: 'admin-teacher-profile', params: { id: user.id } })
  }
}

const getRowClass = (user: User) => {
  return user.role === 'Student' || user.role === 'Teacher' ? 'clickable-student-row' : ''
}

const getStatusSeverity = (status: string) => {
  if (status === 'Active') return 'success'
  if (status === 'Offline') return 'secondary'
  if (status === 'Blocked') return 'danger'
  if (status === 'Inactive') return 'warn'
  return 'info'
}

const getRoleSeverity = (role: string) => {
  if (role === 'Super Admin') return 'danger'
  if (role === 'Teacher') return 'warn'
  if (role === 'Moderator') return 'info'
  return 'success'
}

const getInitials = (user: User) => {
  return user.avatarInitials || user.fullName.charAt(0)
}

const confirmDeleteUser = (user: User) => {
  confirm.require({
    header: t('adminUsers.deleteUserTitle'),
    message: t('adminUsers.deleteUserConfirm', { name: user.fullName }),
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: t('common.cancel'),
    acceptLabel: t('common.delete'),
    acceptClass: 'p-button-danger',
    accept: () => {
      deletingUserId.value = user.id
      deleteUserMutation.mutate(user.id)
    }
  })
}
</script>

<template>
  <div class="widget-card">
    <div
      class="table-toolbar"
      style="display: flex; justify-content: space-between; margin-bottom: 1.5rem"
    >
      <FilterUsersByRole v-model="adminUsersTableStore.selectedRole" />
      <SearchUser v-model="adminUsersTableStore.searchQuery" />
    </div>

    <DataTable
      :value="adminUsersTableStore.usersList"
      :loading="adminUsersTableStore.isLoading"
      lazy
      paginator
      :rows="adminUsersTableStore.rowsPerPage"
      :totalRecords="adminUsersTableStore.totalUsers"
      :first="adminUsersTableStore.page * adminUsersTableStore.rowsPerPage"
      dataKey="id"
      @page="adminUsersTableStore.onPageChange"
      @row-click="onRowClick"
      :rowClass="getRowClass"
    >
      <template #empty>
        <div class="p-4 text-center text-gray-500">{{ t('adminUsers.noUsers') }}</div>
      </template>

      <Column field="fullName" :header="t('adminUsers.columns.user')">
        <template #body="{ data }">
          <div style="display: flex; gap: 1rem; align-items: center">
            <Avatar
              :label="getInitials(data)"
              shape="circle"
              size="large"
              style="background-color: var(--color-primary-subtle); color: var(--color-primary-strong)"
            />
            <div style="display: flex; flex-direction: column">
              <span style="font-weight: 600; color: var(--text-color)">{{ data.fullName }}</span>
              <span style="font-size: 0.8rem; color: var(--text-color-secondary)">{{
                data.email
              }}</span>
            </div>
          </div>
        </template>
      </Column>

      <Column field="role" :header="t('adminUsers.columns.role')">
        <template #body="{ data }">
          <Tag :severity="getRoleSeverity(data.role)" :value="data.role" rounded />
        </template>
      </Column>

      <Column field="department" :header="t('adminUsers.columns.department')">
        <template #body="{ data }">
          <div style="display: flex; flex-direction: column">
            <span style="font-weight: 500; color: var(--text-color)">{{
              data.department || t('common.dash')
            }}</span>
            <span style="font-size: 0.8rem; color: var(--text-color-secondary)">{{
              data.subDepartment || ''
            }}</span>
          </div>
        </template>
      </Column>

      <Column field="status" :header="t('adminUsers.columns.status')">
        <template #body="{ data }">
          <Tag :severity="getStatusSeverity(data.status)" :value="data.status" rounded />
        </template>
      </Column>

      <Column :header="t('adminUsers.columns.actions')">
        <template #body="{ data }">
          <Button
            icon="pi pi-trash"
            text
            rounded
            severity="danger"
            :aria-label="t('adminUsers.deleteUser')"
            :loading="deletingUserId === data.id && deleteUserMutation.isPending.value"
            @click.stop="confirmDeleteUser(data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.widget-card {
  background: var(--surface-card);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: var(--shadow-sm);
}
:deep(.clickable-row) {
  cursor: pointer;
  transition: background-color 0.2s;
}
:deep(.clickable-row:hover) {
  background-color: var(--surface-hover);
}
</style>
