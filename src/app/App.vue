<script setup lang="ts">
import { watch } from 'vue'
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import ConfirmDialog from 'primevue/confirmdialog'

import { useNotifications, useThemeStore } from '@/shared/model'
import { setSessionExpiredHandler } from '@/shared/api'
import { useSessionStore } from '@/entities/session'

const toast = useToast()
const notifications = useNotifications()
useThemeStore()

const sessionStore = useSessionStore()

setSessionExpiredHandler(() => {
  void sessionStore.logout()
})

void sessionStore.initAuth()

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
