<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'

import { useSessionStore } from '@/entities/session'
import { LanguageSwitcher } from '@/features/change-language'
import { ThemeToggler } from '@/features/toggle-theme'

const { t } = useI18n()
const router = useRouter()
const sessionStore = useSessionStore()

const homeRoute = computed(() => {
  if (!sessionStore.isAuth) {
    return { name: 'login' as const }
  }
  if (sessionStore.isAdmin) {
    return { name: 'admin-empty-page' as const }
  }
  if (sessionStore.isTeacher) {
    return { name: 'teacher-empty-page' as const }
  }
  if (sessionStore.isStudent) {
    return { name: 'student-empty-page' as const }
  }
  return { name: 'login' as const }
})

const goHome = () => {
  router.push(homeRoute.value)
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }
  goHome()
}
</script>

<template>
  <div class="not-found-layout">
    <header class="not-found-toolbar">
      <LanguageSwitcher />
      <ThemeToggler />
    </header>

    <main class="not-found-main">
      <div class="not-found-card">
        <div class="logo-box">
          <i class="pi pi-graduation-cap logo-icon" aria-hidden="true"></i>
        </div>

        <p class="error-code" aria-hidden="true">404</p>
        <h1 class="title">{{ t('notFound.title') }}</h1>
        <p class="subtitle">{{ t('notFound.subtitle') }}</p>

        <div class="actions">
          <Button
            :label="t('notFound.goHome')"
            icon="pi pi-home"
            class="action-btn"
            @click="goHome"
          />
          <Button
            :label="t('notFound.goBack')"
            icon="pi pi-arrow-left"
            severity="secondary"
            outlined
            class="action-btn"
            @click="goBack"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.not-found-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--surface-ground);
  font-family: var(--font-family);
}

.not-found-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
}

.not-found-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 1.5rem 2.5rem;
}

.not-found-card {
  width: 100%;
  max-width: 480px;
  text-align: center;
  background: var(--surface-card);
  padding: 2.5rem 2rem;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  border-bottom: 4px solid var(--color-primary-strong);
}

.logo-box {
  background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.logo-icon {
  font-size: 1.5rem;
  color: var(--color-primary);
}

.error-code {
  margin: 0 0 0.75rem;
  font-size: 4rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--color-primary);
  opacity: 0.9;
}

.title {
  margin: 0 0 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}

.subtitle {
  margin: 0 0 2rem;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--text-color-secondary);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-btn {
  width: 100%;
  font-weight: 600;
}

@media (min-width: 480px) {
  .actions {
    flex-direction: row;
  }

  .action-btn {
    flex: 1;
  }
}
</style>
