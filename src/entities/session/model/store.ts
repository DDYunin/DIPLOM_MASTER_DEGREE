import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'

import { refreshAccessToken } from '@/shared/api/auth-interceptor'
import { tokenService } from '@/shared/api/token.service'
import { isAccessTokenExpired } from '@/shared/lib/jwt'
import { ROLES, type AppRole } from '@/shared/config/roles'

import * as sessionApi from '../api'
import type { LoginCredentials } from './types'

const resolveRoleFromToken = (accessToken: string): AppRole | null => {
  const decoded = jwtDecode<{ roles?: string[] }>(accessToken)
  const backendRole = decoded.roles?.[0]

  if (backendRole === ROLES.ADMIN) return ROLES.ADMIN
  if (backendRole === ROLES.TEACHER) return ROLES.TEACHER
  if (backendRole === ROLES.STUDENT) return ROLES.STUDENT

  return backendRole as AppRole | null
}

export const useSessionStore = defineStore('session', () => {
  const router = useRouter()

  const userRole = ref<AppRole | null>(null)
  const isAuth = ref(false)
  const isLoading = ref(false)

  const isAdmin = computed(() => userRole.value === ROLES.ADMIN)
  const isTeacher = computed(() => userRole.value === ROLES.TEACHER)
  const isStudent = computed(() => userRole.value === ROLES.STUDENT)

  const applyAccessToken = (accessToken: string) => {
    userRole.value = resolveRoleFromToken(accessToken)
    isAuth.value = true
  }

  const initAuth = async () => {
    isLoading.value = true

    try {
      const token = tokenService.getAccessToken()

      if (token && !isAccessTokenExpired()) {
        applyAccessToken(token)
        return
      }

      if (!token) {
        isAuth.value = false
        userRole.value = null
        return
      }

      await refreshAccessToken()
      const refreshedToken = tokenService.getAccessToken()

      if (!refreshedToken) {
        throw new Error('Access token was not restored after refresh')
      }

      applyAccessToken(refreshedToken)
    } catch {
      tokenService.clearTokens()
      isAuth.value = false
      userRole.value = null
    } finally {
      isLoading.value = false
    }
  }

  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true

    try {
      const response = await sessionApi.loginWithEmail(credentials)
      tokenService.setTokens(response.accessToken, response.refreshToken)
      applyAccessToken(response.accessToken)
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    tokenService.clearTokens()
    isAuth.value = false
    userRole.value = null
    await router.push('/login')
  }

  return { isAuth, isLoading, initAuth, login, logout, isAdmin, isTeacher, isStudent, userRole }
})
