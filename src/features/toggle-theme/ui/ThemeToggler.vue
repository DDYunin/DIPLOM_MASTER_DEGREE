<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import { useThemeStore } from '@/shared/model'

const { t } = useI18n()
const themeStore = useThemeStore()
</script>

<template>
  <Button
    :icon="themeStore.mode === 'light' ? 'pi pi-moon' : 'pi pi-sun'"
    text
    rounded
    class="theme-toggler-btn"
    @click="themeStore.toggleMode"
    :aria-label="themeStore.mode === 'light' ? t('aria.darkMode') : t('aria.lightMode')"
  />
</template>

<style scoped>
.theme-toggler-btn {
  color: var(--text-color-secondary);
  transition:
    color 0.2s,
    transform 0.3s;
}

.theme-toggler-btn:hover {
  color: var(--text-color);
  transform: rotate(15deg);
}
</style>
