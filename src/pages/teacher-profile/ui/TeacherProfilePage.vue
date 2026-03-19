<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'

import { useUserStore, type User } from '@/entities/user'
import { useNotifications } from '@/shared/model/useNotifications'

// Импорт виджетов
import { TeacherRolesPermissions } from '@/widgets/teacher-roles-permissions'
import { TeacherAssignedCourses } from '@/widgets/teacher-assigned-courses'
import { TeacherSecurityAccess } from '@/widgets/teacher-security-access'
import { ProfileInfoCard } from '@/widgets/profile-info-card'

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
    notifications.showToast('error', 'Not Found', 'Teacher not found.')
    router.push('/admin/users')
  }
})

const handleSaveChanges = async () => {
  if (!profileDraft.value) return
  await userStore.updateUser(profileDraft.value.id, profileDraft.value)
  notifications.showToast('success', 'Success', 'Teacher profile updated successfully.')
}
</script>

<template>
  <div class="profile-page">
    <div class="breadcrumbs">
      <span class="crumb">Users</span> <span class="separator">/</span>
      <span class="crumb">Teachers</span> <span class="separator">/</span>
      <span class="crumb active">Dr. {{ profileDraft?.fullName || 'Loading...' }}</span>
    </div>

    <div class="page-title-section">
      <h1 class="page-title">Permissions & Account</h1>
      <p class="page-desc">
        Manage profile details, access rights, and security for Dr. {{ profileDraft?.fullName }}.
      </p>
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
        <TeacherSecurityAccess :profile="profileDraft" />

        <div class="form-actions">
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
