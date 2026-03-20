<script setup lang="ts">
import Button from 'primevue/button'
import { useThemeStore } from '@/shared/model'

const themeStore = useThemeStore()
</script>

<template>
  <Button
    :icon="themeStore.mode === 'light' ? 'pi pi-moon' : 'pi pi-sun'"
    text
    rounded
    class="theme-toggler-btn"
    @click="themeStore.toggleMode"
    :aria-label="themeStore.mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'"
  />
</template>

<style scoped>
.theme-toggler-btn {
  /* Используем токен цвета текста, чтобы иконка органично смотрелась в хедере */
  color: var(--text-color-secondary, #64748b);
  transition:
    color 0.2s,
    transform 0.3s;
}

.theme-toggler-btn:hover {
  color: var(--text-color);
  transform: rotate(15deg); /* Добавим легкую анимацию при наведении */
}
</style>
