<script setup lang="ts">
import { UsersTable } from '@/widgets/users-table'
import { ImportCSV } from '@/features/import-csv'
import Button from 'primevue/button'
</script>

<template>
  <div class="users-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Users</h1>
        <p class="page-subtitle">Manage access, roles, and status for all university members.</p>
      </div>
      <div class="page-actions">
        <!-- Интегрированная фича импорта CSV -->
        <ImportCSV />

        <!-- Кнопка "Add User" пока остаётся просто UI-элементом страницы, 
             но в будущем её тоже можно вынести в фичу 'create-user' -->
        <Button label="Add User" icon="pi pi-plus" class="btn-add" />
      </div>
    </div>

    <!-- Карточки статистики (Заглушки) -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-top">
          <div>
            <p class="stat-title">Total Users</p>
            <h3 class="stat-value">6</h3>
          </div>
          <div class="stat-icon bg-blue-100 text-blue-600"><i class="pi pi-users"></i></div>
        </div>
      </div>
      <!-- Другие карточки -->
    </div>

    <!-- Виджет Таблицы -->
    <UsersTable />
  </div>
</template>

<style scoped>
/* Стили только для контентной части страницы (из предыдущего ответа) */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}
.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
}
.page-subtitle {
  color: #64748b;
  margin: 0;
}
.page-actions {
  display: flex;
  gap: 1rem;
}
.btn-add {
  background: var(--p-primary-color);
  border: none;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.stat-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}
.stat-title {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
}
.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}
.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-blue-100 {
  background: #dbeafe;
}
.text-blue-600 {
  color: #2563eb;
}
</style>
