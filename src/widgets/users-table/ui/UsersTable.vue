<script setup lang="ts">
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import { mockUsers } from '@/entities/user'

const users = ref(mockUsers)
const selectedUsers = ref()

// Утилита для стилизации бейджей ролей
const getRoleClass = (role: string) => {
  const map: Record<string, string> = {
    Teacher: 'role-teacher',
    Student: 'role-student',
    Admin: 'role-admin',
    Moderator: 'role-moderator'
  }
  return ['role-badge', map[role]]
}

// Утилита для статусов
const getStatusClass = (status: string) => {
  return status === 'Active'
    ? 'status-active'
    : status === 'Offline'
      ? 'status-offline'
      : 'status-blocked'
}
</script>

<template>
  <div class="table-widget-card">
    <!-- Toolbar (Вкладки и поиск) -->
    <div class="table-toolbar">
      <div class="tabs">
        <button class="tab active">All Users</button>
        <button class="tab">Admins</button>
        <button class="tab">Teachers</button>
        <button class="tab">Students</button>
        <div class="divider"></div>
        <button class="tab more-filters"><i class="pi pi-filter"></i> More Filters</button>
      </div>

      <IconField iconPosition="left">
        <InputIcon class="pi pi-search" />
        <InputText placeholder="Search by name, email..." class="search-input" />
      </IconField>
    </div>

    <!-- Сама таблица -->
    <DataTable
      :value="users"
      v-model:selection="selectedUsers"
      dataKey="id"
      class="custom-table"
      :rows="5"
      paginator
    >
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 1rem;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0.5rem;
}

.tabs {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.tab {
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
}
.tab.active {
  color: #0f172a;
  font-weight: 600;
}
.divider {
  width: 1px;
  height: 1.5rem;
  background: #e2e8f0;
  margin: 0 0.5rem;
}
.more-filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #475569;
}

.search-input {
  width: 280px;
  border-radius: 8px;
}

/* Кастомные стили ячеек таблицы */
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
</style>
