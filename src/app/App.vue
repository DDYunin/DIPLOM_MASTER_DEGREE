<script setup lang="ts">
import { watch } from 'vue'
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import ConfirmDialog from 'primevue/confirmdialog'

import { useNotifications } from '@/shared/model'
import { useThemeStore } from '@/shared/model'

const toast = useToast()
const notifications = useNotifications()
const themeStore = useThemeStore() // Инициализируем стор темы

// Следим за изменениями переменной message в сторе
watch(
  () => notifications.message,
  (newMsg) => {
    if (newMsg) {
      toast.add(newMsg) // Передаем объект в PrimeVue Toast
    }
  }
)
</script>

<template>
  <div class="app">
    <Toast position="bottom-right" />
    <ConfirmDialog />
    <RouterView />
  </div>
</template>

<style>
@import '/node_modules/modern-normalize/modern-normalize.css';
@import './styles/main.css';
</style>
