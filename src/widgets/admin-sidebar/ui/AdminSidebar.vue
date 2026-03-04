<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="sidebar-content">
    <div class="logo">
      <i class="pi pi-graduation-cap text-blue-600 text-2xl"></i>
      <span class="logo-text">EduTeacher</span>
    </div>

    <nav class="nav-menu">
      <RouterLink to="/admin" class="nav-item" exact-active-class="active">
        <i class="pi pi-th-large"></i> Dashboard
      </RouterLink>
      <RouterLink to="/admin/users" class="nav-item" active-class="active">
        <i class="pi pi-users"></i> Users
      </RouterLink>
      <!-- Заглушки для будущих страниц -->
      <a href="#" class="nav-item"><i class="pi pi-calendar"></i> Calendar</a>
      <a href="#" class="nav-item"><i class="pi pi-book"></i> Courses</a>
    </nav>
  </div>
</template>

<style scoped>
.sidebar-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
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
  transition: all 0.2s;
}
.nav-item:hover {
  background: #f1f5f9;
}
.nav-item.active {
  background: #eff6ff;
  color: var(--p-primary-color);
}
</style>
