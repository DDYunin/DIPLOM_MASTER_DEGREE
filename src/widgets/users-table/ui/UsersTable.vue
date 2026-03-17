<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'

// Импортируем мок-данные сущности
import { useUserStore, type User } from '@/entities/user'

// Импортируем фичи
import { SearchUser } from '@/features/search-user'
import { FilterUsersByRole } from '@/features/filter-users-by-role'

const router = useRouter()
const userStore = useUserStore();

// Локальное состояние для фичей
const searchQuery = ref('')
const selectedRole = ref('All Users')

// Загружаем данные при монтировании таблицы
onMounted(() => {
  if (userStore.users.length === 0) {
    userStore.loadUsers();
  }
});

// Реактивно фильтруем данные из СТОРА
const filteredUsers = computed(() => {
  return userStore.users.filter(user => {
    const matchRole = selectedRole.value === 'All Users' || user.role === selectedRole.value;
    const searchLower = searchQuery.value.toLowerCase();
    const matchSearch = user.fullName.toLowerCase().includes(searchLower) || 
                        user.email.toLowerCase().includes(searchLower);
    
    return matchRole && matchSearch;
  });
});

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

// Утилиты стилизации бейджей
const getRoleClass = (role: string) => ['role-badge', `role-${role.toLowerCase()}`]
const getStatusClass = (status: string) => `status-${status.toLowerCase()}`
</script>

<template>
  <div class="table-widget-card">
    <!-- Toolbar с нашими новыми фичами -->
    <div class="table-toolbar">
      <FilterUsersByRole v-model="selectedRole" />
      <SearchUser v-model="searchQuery" />
    </div>

    <!-- TODO: показывается лоадер + текст No users found. Нужно поправить -->
    <!-- Таблица (клиентская фильтрация и пагинация) -->
    <!-- :value передаем вычисляемое свойство filteredUsers -->
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
        <div class="empty-message">No users found.</div>
      </template>

      <Column field="name" header="USER">
        <template #body="slotProps">
          <div class="user-cell">
            <Avatar :image="slotProps.data.avatar" shape="circle" size="large" />
            <div class="user-info">
              <span class="user-name">{{ slotProps.data.name }}</span>
              <span class="user-email">{{ slotProps.data.email }}</span>
            </div>
          </div>
        </template>
      </Column>

      <Column field="role" header="ROLE">
        <template #body="slotProps">
          <span :class="getRoleClass(slotProps.data.role)">{{ slotProps.data.role }}</span>
        </template>
      </Column>

      <Column field="department" header="DEPARTMENT">
        <template #body="slotProps">
          <div class="dept-cell">
            <span class="dept-name">{{ slotProps.data.department }}</span>
            <span class="dept-sub">{{ slotProps.data.subDepartment }}</span>
          </div>
        </template>
      </Column>

      <Column field="status" header="STATUS">
        <template #body="slotProps">
          <div class="status-cell">
            <span class="status-dot" :class="getStatusClass(slotProps.data.status)"></span>
            <span class="status-text">{{ slotProps.data.status }}</span>
          </div>
        </template>
      </Column>

      <Column header="ACTIONS">
        <template #body>
          <Button icon="pi pi-ellipsis-v" text rounded aria-label="Actions" class="action-btn" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.table-widget-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0.5rem;
}
.empty-message {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}

/* Стили ячеек (идентичны предыдущим) */
.user-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.user-info {
  display: flex;
  flex-direction: column;
}
.user-name {
  font-weight: 600;
  color: #0f172a;
}
.user-email {
  font-size: 0.8rem;
  color: #64748b;
}

.dept-cell {
  display: flex;
  flex-direction: column;
}
.dept-name {
  font-weight: 500;
  color: #334155;
}
.dept-sub {
  font-size: 0.8rem;
  color: #94a3b8;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}
.role-teacher {
  background: #f3e8ff;
  color: #7e22ce;
}
.role-student {
  background: #dcfce7;
  color: #16a34a;
}
.role-admin {
  background: #e0e7ff;
  color: #4338ca;
}
.role-moderator {
  background: #fef08a;
  color: #a16207;
}

.status-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.status-active {
  background: #22c55e;
}
.status-offline {
  background: #94a3b8;
}
.status-blocked {
  background: #ef4444;
}
.status-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
}

.action-btn {
  color: #94a3b8;
}

/* Используем :deep(), так как строки <tr> генерируются внутри дочернего компонента DataTable */
:deep(.clickable-student-row) {
  cursor: pointer;
  transition: background-color 0.2s;
}

:deep(.clickable-student-row:hover) {
  background-color: #f8fafc !important; /* Цвет при наведении (светло-серый) */
}
</style>
