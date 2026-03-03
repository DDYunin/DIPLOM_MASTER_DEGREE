import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSessionStore = defineStore('session', () => {
  const isAuth = ref(false)
  const token = ref<string | null>(null)

  // В будущем здесь будет вызов реального API
  const login = async (email: string, password: string, rememberMe: boolean) => {
    console.log('Login payload:', { email, password, rememberMe })
    // Имитация задержки сети
    await new Promise((resolve) => setTimeout(resolve, 1000))
    isAuth.value = true
    token.value = 'fake-jwt-token'
  }

  return { isAuth, token, login }
})
