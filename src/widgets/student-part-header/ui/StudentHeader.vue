<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import { LanguageSwitcher } from '@/features/change-language'
import { ThemeToggler } from '@/features/toggle-theme'

const { t } = useI18n()
</script>

<template>
  <div class="header-content">
    <div class="header-actions">
      <!-- Переиспользуемые фичи -->
      <LanguageSwitcher />
      <ThemeToggler />

      <!-- Кнопки действий из макета студента -->
      <Button
        icon="pi pi-bell"
        text
        rounded
        class="icon-btn"
        :aria-label="t('aria.notifications')"
      />
      <Button
        icon="pi pi-question-circle"
        text
        rounded
        class="icon-btn"
        :aria-label="t('aria.help')"
      />
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
  color: var(--text-color-muted);
}
</style>
