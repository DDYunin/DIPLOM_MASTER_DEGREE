<script setup lang="ts">
import Button from 'primevue/button'
import { LanguageSwitcher } from '@/features/change-language'
import { ThemeToggler } from '@/features/toggle-theme'
</script>

<template>
  <div class="header-content">
    <div class="header-actions">
      <!-- Переиспользуемые фичи -->
      <LanguageSwitcher />
      <ThemeToggler />

      <!-- Кнопка уведомлений -->
      <Button icon="pi pi-bell" text rounded class="icon-btn" aria-label="Notifications" />
    </div>
  </div>
</template>

<style scoped>
.header-content {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-btn {
  /* Заменяем #64748b на токен Aura */
  color: var(--p-text-muted-color);
}
</style>
