<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'

import { useUserStore, type User } from '@/entities/user'
import { useNotifications } from '@/shared/model/useNotifications'

// Импорт виджетов
import { TeacherRolesPermissions } from '@/widgets/teacher-roles-permissions'
import { TeacherAssignedCourses } from '@/widgets/teacher-assigned-courses'
import { ProfileInfoCard } from '@/widgets/profile-info-card'
import { SecuritySettingsCard } from '@/widgets/security-settings-card'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const notifications = useNotifications()

const profileDraft = ref<User | null>(null)

onMounted(async () => {
  const userId = route.params.id as string
  if (userStore.users.length === 0) await userStore.loadUsers()

  const teacherData = userStore.getUserById(userId)
  if (teacherData) {
    profileDraft.value = { ...teacherData }
  } else {
    notifications.showToast('error', t('adminUserProfile.notFoundTitle'), t('adminUserProfile.teacherNotFound'))
    router.push('/admin/users')
  }
})

const handleSaveChanges = async () => {
  if (!profileDraft.value) return
  await userStore.updateUser(profileDraft.value.id, profileDraft.value)
  notifications.showToast('success', t('common.save'), t('adminUserProfile.teacherSaved'))
}
</script>

<template>
  <div class="profile-page">
    <div class="breadcrumbs">
      <span class="crumb">{{ t('adminUserProfile.users') }}</span> <span class="separator">/</span>
      <span class="crumb">{{ t('adminUserProfile.teachers') }}</span> <span class="separator">/</span>
      <span class="crumb active">{{ profileDraft?.fullName || t('common.loading') }}</span>
    </div>

    <div class="page-title-section">
      <h1 class="page-title">{{ t('adminUserProfile.permissions') }}</h1>
    </div>

    <div class="profile-container">
      <div v-if="userStore.isLoading || !profileDraft" class="flex flex-col gap-4">
        <Skeleton width="100%" height="150px" borderRadius="12px" class="mb-4" />
        <Skeleton width="100%" height="300px" borderRadius="12px" />
      </div>

      <div v-else class="content-column">
        <!-- ИСПОЛЬЗУЕМ УНИВЕРСАЛЬНУЮ АНКЕТУ -->
        <ProfileInfoCard v-model="profileDraft" />

        <TeacherRolesPermissions
          :profile="profileDraft"
          @update:groups="profileDraft.groups = $event"
          @update:permissions="profileDraft.permissions = $event"
        />
        <TeacherAssignedCourses :profile="profileDraft" />
        <SecuritySettingsCard v-model="profileDraft" />

        <div class="form-actions">
          <Button :label="t('common.cancel')" outlined @click="router.back()" />
          <Button :label="t('common.saveChanges')" icon="pi pi-check" @click="handleSaveChanges" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  padding-bottom: 2rem;
}
.breadcrumbs {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  margin-bottom: 1.5rem;
}
.separator {
  margin: 0 0.5rem;
  color: var(--surface-border);
}
.crumb.active {
  color: var(--text-color);
  font-weight: 500;
}
.page-title-section {
  margin-bottom: 2rem;
}
.page-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
}
.page-desc {
  margin: 0;
  color: var(--text-color-secondary);
  font-size: 0.875rem;
}
.profile-container {
  max-width: 900px;
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
.mb-4 {
  margin-bottom: 1rem;
}
</style>
