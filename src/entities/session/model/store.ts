import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { tokenService } from '@/shared/api'
import * as sessionApi from '../api'
import type { LoginCredentials } from './types'
import { jwtDecode } from 'jwt-decode'
import { ROLES, type AppRole } from '@/shared/config/roles'

export const useSessionStore = defineStore('session', () => {
  const router = useRouter()

  const userRole = ref<AppRole | null>(null)
  const isAuth = ref(false)
  const isLoading = ref(false)

  const isAdmin = computed(() => userRole.value === ROLES.ADMIN)
  const isTeacher = computed(() => userRole.value === ROLES.TEACHER)
  const isStudent = computed(() => userRole.value === ROLES.STUDENT)

  // Инициализация при старте приложения (проверка наличия токена)
  const initAuth = () => {
    const token = tokenService.getAccessToken()
    if (token) {
      try {
        const decoded = jwtDecode<{ roles: AppRole[] }>(token)
        userRole.value = decoded.roles[0] ?? null
        isAuth.value = true
      } catch {
        tokenService.clearTokens()
      }
    }
  }

  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    debugger
    try {
      const response = await sessionApi.loginWithEmail(credentials)

      // Сохраняем токены в localStorage
      tokenService.setTokens(response.accessToken)
      const decoded = jwtDecode<{ roles: AppRole[] }>(response.accessToken)
      if (decoded) {
        userRole.value = decoded.roles[0] ?? null;
      }
      isAuth.value = true
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    // Очищаем локальные данные в любом случае
    tokenService.clearTokens()
    isAuth.value = false
    userRole.value = null;
    router.push('/login')
  }

  return { isAuth, isLoading, initAuth, login, logout, isAdmin, isTeacher, isStudent, userRole }
})
