<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'

import { useUserStore, type User } from '@/entities/user'
import { useNotifications } from '@/shared/model'

import { UserProfileHeader } from '@/widgets/user-profile-header'
import { UserAccountInfo } from '@/widgets/user-account-info'
import { UserSecurityAccess } from '@/widgets/user-security-access'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const notifications = useNotifications()

const profileDraft = ref<User | null>(null)

onMounted(async () => {
  const userId = route.params.id as string

  if (userStore.users.length === 0) {
    await userStore.loadUsers()
  }

  const studentData = userStore.getUserById(userId)
  if (studentData) {
    profileDraft.value = { ...studentData }
  } else {
    notifications.showToast('error', 'Not Found', 'Student not found.')
    router.push('/admin/users')
  }
})

const handleSaveChanges = async () => {
  if (!profileDraft.value) return
  // Стор отправит патч на API, а клиент API перехватит ошибки
  await userStore.updateUser(profileDraft.value.id, profileDraft.value)
  notifications.showToast('success', 'Success', 'Student profile updated successfully.')
}
</script>

<template>
  <div class="profile-page">
    <!-- Breadcrumbs (Хлебные крошки) -->
    <div class="breadcrumbs">
      <RouterLink class="crumb" :to="{ name: 'admin-users' }">Users</RouterLink>
      <span class="separator">/</span>
      <span class="crumb">Students</span>
      <span class="separator">/</span>
      <span class="crumb active">{{ profileDraft?.name || 'Loading...' }}</span>
    </div>

    <!-- Ограничиваем максимальную ширину контента, чтобы поля ввода не были бесконечными -->
    <div class="profile-container">
      <div v-if="userStore.isLoading || !profileDraft" class="flex flex-col gap-4">
        <Skeleton width="100%" height="150px" borderRadius="12px" />
        <Skeleton width="100%" height="300px" borderRadius="12px" />
      </div>
      <div v-else class="content-column">
        <UserProfileHeader :profile="profileDraft" />
        <UserAccountInfo :profile="profileDraft" />
        <UserSecurityAccess />
        <div
          class="form-actions"
          style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem"
        >
          <Button label="Cancel" outlined @click="router.back()" />
          <Button label="Save Changes" icon="pi pi-check" @click="handleSaveChanges" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  padding-bottom: 2rem;
}

/* Breadcrumbs */
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}
.crumb {
  color: #64748b;
}
.crumb.active {
  color: #0f172a;
  font-weight: 500;
}
.separator {
  color: #cbd5e1;
}

/* Центрируем и ограничиваем ширину, так как пропала правая колонка */
.profile-container {
  max-width: 900px; /* Идеальная ширина для форм и настроек */
}

/* Располагаем виджеты друг под другом с отступом */
.content-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
