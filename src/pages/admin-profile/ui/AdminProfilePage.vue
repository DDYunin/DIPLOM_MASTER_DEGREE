<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'

import { useUserStore, type User } from '@/entities/user'
import { useNotifications } from '@/shared/model/useNotifications'

import { ProfileInfoCard } from '@/widgets/profile-info-card'
import { SecuritySettingsCard } from '@/widgets/security-settings-card'

const userStore = useUserStore()
const notifications = useNotifications()

// Черновик формы. Изначально null, пока данные не загрузятся.
const profileDraft = ref<User | null>(null)

onMounted(async () => {
  // 1. Убеждаемся, что пользователи загружены
  // (В реальном приложении здесь был бы запрос профиля текущего пользователя: await userStore.fetchMe())
  if (userStore.users.length === 0) {
    await userStore.loadUsers()
  }

  // 2. Ищем админа (ID 'admin-1' мы задали в mock-данных)
  const adminData = userStore.getUserById('admin-1')

  // 3. Создаем ЛОКАЛЬНУЮ КОПИЮ для редактирования
  if (adminData) {
    profileDraft.value = { ...adminData }
  }
})

const handleSaveChanges = async () => {
  if (!profileDraft.value) return

  // Вызываем экшен стора. Если будет ошибка сети — API клиент сам выбросит Toast с ошибкой.
  await userStore.updateUser(profileDraft.value.id, profileDraft.value)

  // Если код дошел сюда, значит запрос успешен! Показываем Toast.
  notifications.showToast('success', 'Success', 'System settings have been updated.')
}
</script>

<template>
  <div class="settings-page">
    <div class="page-header">
      <h1 class="page-title">System Settings</h1>
    </div>

    <div class="profile-container">
      <div class="sub-header">
        <h2 class="sub-title">General Configuration</h2>
        <p class="sub-desc">Manage your administrative profile and monitor system integrity.</p>
      </div>

      <div v-if="userStore.isLoading || !profileDraft" class="content-column">
        <Skeleton width="100%" height="300px" borderRadius="12px" />
        <Skeleton width="100%" height="200px" borderRadius="12px" />
      </div>

      <div v-else class="content-column">
        <!-- ИСПОЛЬЗУЕМ УНИВЕРСАЛЬНУЮ АНКЕТУ -->
        <ProfileInfoCard v-model="profileDraft" />

        <SecuritySettingsCard v-model="profileDraft" mode="self" />

        <div class="form-actions">
          <Button label="Cancel" outlined class="btn-cancel" />
          <Button
            label="Save Changes"
            class="btn-save"
            icon="pi pi-check"
            @click="handleSaveChanges"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  padding-bottom: 2rem;
}
.page-header {
  margin-bottom: 2rem;
}
.page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}
.profile-container {
  max-width: 900px;
}
.sub-header {
  margin-bottom: 1.5rem;
}
.sub-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
}
.sub-desc {
  margin: 0;
  color: var(--text-color-secondary);
  font-size: 0.875rem;
}
.content-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
