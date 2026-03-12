<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n';

const router = useRouter()
const { t } = useI18n();

const handleLogout = () => {
  // Очистка сессии (Pinia, localStorage) будет здесь
  router.push('/login')
}
</script>

<template>
  <div class="sidebar-container">
    <div class="sidebar-top">
      <div class="logo">
        <i class="pi pi-graduation-cap text-blue-600 text-2xl"></i>
        <span class="logo-text">EduAdmin</span>
      </div>

      <nav class="nav-menu">
        <RouterLink to="/admin/users" class="nav-item" active-class="active">
          <i class="pi pi-users"></i> {{ t('sidebar.users') }}
        </RouterLink>
        <RouterLink to="/admin/organization" class="nav-item" active-class="active">
          <i class="pi pi-sitemap"></i> {{ t('sidebar.organization') }}
        </RouterLink>
        <RouterLink to="/admin/profile" class="nav-item" active-class="active">
          <i class="pi pi-cog"></i> {{ t('sidebar.profile') }}
        </RouterLink>
      </nav>
    </div>

    <div class="sidebar-bottom">
      <div class="divider"></div>
      <button class="logout-btn" @click="handleLogout">
        <i class="pi pi-sign-out"></i> {{ t('sidebar.logout') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  background: white;
}
.sidebar-top {
  padding: 1.5rem;
}
.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
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
  background: #f8fafc;
  color: #0f172a;
}

/* Активный пункт меню как на макете (синий фон, синий текст) */
.nav-item.active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

/* Нижняя часть с логаутом */
.sidebar-bottom {
  padding: 1.5rem;
}
.divider {
  height: 1px;
  background: #f1f5f9;
  margin-bottom: 1rem;
}
.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: #ef4444; /* Красный цвет */
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;
}
.logout-btn:hover {
  background: #fef2f2;
}
</style>
