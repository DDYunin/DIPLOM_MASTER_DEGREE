import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from './types'
import * as userApi from '../api'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const isLoading = ref(false)

  // Геттеры...
  const students = computed(() => users.value.filter((u) => u.role === 'Student'))

  // ЭКШЕНЫ
  const loadUsers = async () => {
    isLoading.value = true
    try {
      users.value = await userApi.fetchUsersList()
      // Ошибки перехватит клиент и покажет Toast!
    } finally {
      isLoading.value = false
    }
  }

  const addUser = async (user: User) => {
    // Можно обернуть в try/finally для включения лоадера кнопки,
    // но try/catch для ошибки больше не обязателен
    const createdUser = await userApi.createUser(user)
    users.value.unshift(createdUser)
  }

  const updateUser = async (id: string, updatedData: Partial<User>) => {
    const updatedUser = await userApi.updateUserById(id, updatedData)
    const index = users.value.findIndex((u) => u.id === id)
    if (index !== -1) {
      users.value[index] = updatedUser
    }
  }

  const getUserById = (id: string) => users.value.find((user) => user.id === id)

  return { users, isLoading, students, loadUsers, addUser, updateUser, getUserById }
})
