import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ToastMessage {
  severity: 'success' | 'info' | 'warn' | 'error'
  summary: string
  detail: string
  life?: number
  id?: number // Уникальный ID, чтобы реагировать даже на одинаковые ошибки
}

export const useNotifications = defineStore('notifications', () => {
  // Храним последнее сообщение
  const message = ref<ToastMessage | null>(null)

  const showToast = (severity: ToastMessage['severity'], summary: string, detail: string) => {
    message.value = {
      severity,
      summary,
      detail,
      life: 3000,
      id: Date.now() // Гарантирует, что watch сработает, даже если ошибка повторяется
    }
  }

  return { message, showToast }
})
