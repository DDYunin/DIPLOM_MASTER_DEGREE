<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import { useSessionStore } from '@/entities/session'

const props = defineProps<{
  collapsed: boolean
}>()

const emit = defineEmits<{
  (e: 'update:collapsed', value: boolean): void
}>()

const { t } = useI18n()
const sessionStore = useSessionStore()

const handleLogout = () => {
  sessionStore.logout()
}

const toggleSidebar = () => {
  emit('update:collapsed', !props.collapsed)
}
</script>

<template>
  <div class="sidebar-content" :class="{ 'is-collapsed': collapsed }">
    <div class="sidebar-top">
      <div class="brand-header">
        <div class="logo">
          <i class="pi pi-graduation-cap logo-icon"></i>
          <span v-if="!collapsed" class="logo-text">StudLearn</span>
        </div>
        <!-- Кнопка сворачивания/разворачивания -->
        <Button
          :icon="collapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"
          text
          rounded
          severity="secondary"
          @click="toggleSidebar"
          class="collapse-btn"
        />
      </div>

      <nav class="nav-menu">
        <RouterLink to="/teacher/courses" class="nav-item" active-class="active">
          <i class="pi pi-book nav-icon"></i>
          <span v-if="!collapsed" class="nav-text">{{ t('teacherSidebar.courses') }}</span>
        </RouterLink>
        <RouterLink to="/teacher/question-banks" class="nav-item" active-class="active">
          <i class="pi pi-database nav-icon"></i>
          <span v-if="!collapsed" class="nav-text">{{ t('teacherSidebar.questionBanks') }}</span>
        </RouterLink>
        <RouterLink to="/teacher/profile" class="nav-item" active-class="active">
          <i class="pi pi-user nav-icon"></i>
          <span v-if="!collapsed" class="nav-text">{{ t('teacherSidebar.profile') }}</span>
        </RouterLink>
      </nav>
    </div>

    <div class="sidebar-bottom">
      <div class="divider"></div>
      <button class="logout-btn" @click="handleLogout" :title="t('teacherSidebar.logout')">
        <i class="pi pi-sign-out logout-icon"></i>
        <span v-if="!collapsed" class="logout-text">{{ t('teacherSidebar.logout') }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.sidebar-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  background-color: var(--surface-elevated);
  transition: all 0.3s ease;
}

.sidebar-top {
  padding: 1.5rem 1rem;
}

.brand-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
}

/* Центрируем логотип, если сайдбар свернут */
.is-collapsed .brand-header {
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-color);
}

.logo-icon {
  color: var(--color-primary);
  font-size: 1.5rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  white-space: nowrap;
}

.collapse-btn {
  width: 2rem;
  height: 2rem;
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
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all 0.2s;
  overflow: hidden;
}

.is-collapsed .nav-item {
  justify-content: center;
  padding: 0.75rem 0;
}

.nav-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.nav-text {
  white-space: nowrap;
}

.nav-item:hover {
  background-color: var(--surface-hover);
  color: var(--text-color);
}

.nav-item.active {
  background-color: var(--color-primary-subtle);
  color: var(--color-primary);
  font-weight: 600;
}

.sidebar-bottom {
  padding: 1.5rem 1rem;
}

.divider {
  height: 1px;
  background-color: var(--surface-border);
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
  border-radius: var(--radius-md);
  transition: background 0.2s;
  overflow: hidden;
}

.is-collapsed .logout-btn {
  justify-content: center;
  padding: 0.75rem 0;
}

.logout-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.logout-text {
  white-space: nowrap;
}

.logout-btn:hover {
  background-color: var(--color-danger-subtle);
}
</style>
