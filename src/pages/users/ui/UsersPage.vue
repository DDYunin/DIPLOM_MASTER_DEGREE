<script setup lang="ts">
import { AdminLayout } from '@/shared/ui'
import { UsersTable } from '@/widgets/users-table'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
</script>

<template>
  <AdminLayout>
    <!-- СЛОТ: SIDEBAR -->
    <template #sidebar>
      <div class="sidebar-content">
        <div class="logo">
          <i class="pi pi-graduation-cap text-blue-600 text-2xl"></i>
          <span class="logo-text">EduTeacher</span>
        </div>
        <nav class="nav-menu">
          <a href="#" class="nav-item"><i class="pi pi-th-large"></i> Dashboard</a>
          <a href="#" class="nav-item"><i class="pi pi-calendar"></i> Calendar</a>
          <a href="#" class="nav-item active"><i class="pi pi-users"></i> Users</a>
          <a href="#" class="nav-item"><i class="pi pi-book"></i> Courses</a>
          <a href="#" class="nav-item"><i class="pi pi-chart-bar"></i> Reports</a>
        </nav>
      </div>
    </template>

    <!-- СЛОТ: HEADER -->
    <template #header>
      <div class="header-content">
        <h2 class="header-title">User Management</h2>
        <div class="header-actions">
          <IconField iconPosition="left">
            <InputIcon class="pi pi-search" />
            <InputText placeholder="Search everywhere..." class="global-search" />
          </IconField>
          <Button icon="pi pi-bell" text rounded class="icon-btn" />
          <Button icon="pi pi-question-circle" text rounded class="icon-btn" />
        </div>
      </div>
    </template>

    <!-- СЛОТ: КОНТЕНТ ПО УМОЛЧАНИЮ -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Users</h1>
        <p class="page-subtitle">Manage access, roles, and status for all university members.</p>
      </div>
      <div class="page-actions">
        <Button label="Import CSV" icon="pi pi-file-excel" outlined class="btn-import" />
        <Button label="Add User" icon="pi pi-plus" class="btn-add" />
      </div>
    </div>

    <!-- Карточки статистики (Заглушки для примера) -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-top">
          <div>
            <p class="stat-title">Total Users</p>
            <h3 class="stat-value">2,450</h3>
          </div>
          <div class="stat-icon bg-blue-100 text-blue-600"><i class="pi pi-users"></i></div>
        </div>
        <p class="stat-trend text-green-600"><i class="pi pi-arrow-up"></i> +12% from last month</p>
      </div>
      <!-- Повторить stat-card для Teachers, Students, Pending Review -->
    </div>

    <!-- Виджет Таблицы -->
    <UsersTable />
  </AdminLayout>
</template>

<style scoped>
/* Стили Sidebar (в реальности в отдельном виджете) */
.sidebar-content {
  padding: 1.5rem;
}
.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #0f172a;
}
.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #475569;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
}
.nav-item:hover {
  background: #f1f5f9;
}
.nav-item.active {
  background: #eff6ff;
  color: var(--p-primary-color);
}

/* Стили Header */
.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.global-search {
  width: 300px;
  border-radius: 20px;
  background: #f8fafc;
  border: none;
}
.icon-btn {
  color: #64748b;
}

/* Стили контента UsersPage */
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
.btn-import {
  border-color: #cbd5e1;
  color: #475569;
}
.btn-add {
  background: var(--p-primary-color);
  border: none;
}

/* Стили статистики */
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
.stat-trend {
  font-size: 0.75rem;
  font-weight: 500;
  margin: 0;
}

/* Утилиты цветов */
.bg-blue-100 {
  background: #dbeafe;
}
.text-blue-600 {
  color: #2563eb;
}
.text-green-600 {
  color: #16a34a;
}
</style>
