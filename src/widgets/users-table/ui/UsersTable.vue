<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

// Импортируем мок-данные сущности
import { useUserStore, type User } from '@/entities/user'

// Импортируем фичи
import { SearchUser } from '@/features/search-user'
import { FilterUsersByRole } from '@/features/filter-users-by-role'

const router = useRouter()
const userStore = useUserStore()

// Локальное состояние для фичей
const searchQuery = ref('')
const selectedRole = ref('All Users')

// Загружаем данные при монтировании таблицы
onMounted(() => {
  if (userStore.users.length === 0) {
    userStore.loadUsers()
  }
})

// Реактивно фильтруем данные из СТОРА
const filteredUsers = computed(() => {
  return userStore.users.filter((user) => {
    const matchRole = selectedRole.value === 'All Users' || user.role === selectedRole.value
    const searchLower = searchQuery.value.toLowerCase()
    const matchSearch =
      user.fullName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)

    return matchRole && matchSearch
  })
})

// Обработчик клика по строке
const onRowClick = (event: { data: User }) => {
  const user = event.data
  // Проверяем, что это студент, прежде чем делать переход
  if (user.role === 'Student') {
    // Используем именованный роут для надежности
    router.push({
      name: 'admin-student-profile',
      params: { id: user.id }
    })
  }
  if (user.role === 'Teacher') {
    router.push({ name: 'admin-teacher-profile', params: { id: user.id } }) // <--- Добавили переход
  }
}

// Динамический класс для строки (добавляем класс, если это студент)
const getRowClass = (user: User) => {
  return user.role === 'Student' || user.role === 'Teacher' ? 'clickable-student-row' : ''
}

// Функция для красивых бейджей статуса (избавимся от самописных кружков, возьмем Tag из PrimeVue)
const getStatusSeverity = (status: string) => {
  if (status === 'Active') return 'success'
  if (status === 'Offline') return 'secondary'
  if (status === 'Blocked') return 'danger'
  if (status === 'Inactive') return 'warn'
  return 'info'
}

// Функция для цветов ролей
const getRoleSeverity = (role: string) => {
  if (role === 'Super Admin') return 'danger'
  if (role === 'Teacher') return 'warn'
  if (role === 'Moderator') return 'info'
  return 'success' // Student
}

// Генерация инициалов
const getInitials = (user: User) => {
  return user.avatarInitials || user.fullName.charAt(0)
}
</script>

<template>
  <div class="widget-card">
    <div
      class="table-toolbar"
      style="display: flex; justify-content: space-between; margin-bottom: 1.5rem"
    >
      <FilterUsersByRole v-model="selectedRole" />
      <SearchUser v-model="searchQuery" />
    </div>

    <DataTable
      :value="filteredUsers"
      :loading="userStore.isLoading"
      paginator
      :rows="5"
      dataKey="id"
      @row-click="onRowClick"
      :rowClass="getRowClass"
    >
      <template #empty>
        <div class="p-4 text-center text-gray-500">No users found.</div>
      </template>

      <!-- ИСПОЛЬЗУЕМ fullName ВМЕСТО name -->
      <Column field="fullName" header="USER">
        <template #body="{ data }">
          <div style="display: flex; gap: 1rem; align-items: center">
            <Avatar
              :label="getInitials(data)"
              shape="circle"
              size="large"
              style="background-color: var(--p-primary-50); color: var(--p-primary-600)"
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

      <Column field="role" header="ROLE">
        <template #body="{ data }">
          <!-- Используем компонент Tag для ролей -->
          <Tag :severity="getRoleSeverity(data.role)" :value="data.role" rounded />
        </template>
      </Column>

      <Column field="department" header="DEPARTMENT">
        <template #body="{ data }">
          <div style="display: flex; flex-direction: column">
            <span style="font-weight: 500; color: var(--text-color)">{{
              data.department || '—'
            }}</span>
            <span style="font-size: 0.8rem; color: var(--text-color-secondary)">{{
              data.subDepartment || ''
            }}</span>
          </div>
        </template>
      </Column>

      <Column field="status" header="STATUS">
        <template #body="{ data }">
          <Tag :severity="getStatusSeverity(data.status)" :value="data.status" rounded />
        </template>
      </Column>

      <Column header="ACTIONS">
        <template #body>
          <Button icon="pi pi-ellipsis-v" text rounded @click.stop />
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
:deep(.clickable-row) {
  cursor: pointer;
  transition: background-color 0.2s;
}
:deep(.clickable-row:hover) {
  background-color: var(--surface-hover);
}
</style>
