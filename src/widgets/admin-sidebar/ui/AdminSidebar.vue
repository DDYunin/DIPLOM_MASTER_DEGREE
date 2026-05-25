<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSessionStore } from '@/entities/session'

const { t } = useI18n()
const sessionStore = useSessionStore()

const handleLogout = () => {
  sessionStore.logout()
}
</script>

<template>
  <div class="sidebar-container">
    <div class="sidebar-top">
      <div class="logo">
        <i class="pi pi-graduation-cap logo-icon"></i>
        <span class="logo-text">StudLearn</span>
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
  background: var(--surface-elevated);
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
  color: var(--text-color);
}

.logo-icon {
  color: var(--color-primary);
  font-size: 1.5rem;
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
  color: var(--text-color-muted);
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-item:hover {
  background: var(--surface-ground);
  color: var(--text-color);
}

.nav-item.active {
  background: var(--color-primary-subtle);
  color: var(--color-primary-strong);
  font-weight: 600;
}

.sidebar-bottom {
  padding: 1.5rem;
}

.divider {
  height: 1px;
  background: var(--surface-border-subtle);
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
  color: var(--color-danger);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: var(--color-danger-subtle);
}
</style>
