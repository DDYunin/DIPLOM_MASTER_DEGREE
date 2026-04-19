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

      <!-- Кнопки действий из макета студента -->
      <Button icon="pi pi-bell" text rounded class="icon-btn" aria-label="Notifications" />
      <Button icon="pi pi-question-circle" text rounded class="icon-btn" aria-label="Help" />
    </div>
  </div>
</template>

<style scoped>
.header-content {
  width: 100%;
  display: flex;
  justify-content: flex-end; /* Поиск пока не делаем, следуем логике Teacher */
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-btn {
  color: var(--p-text-muted-color);
}
</style>
