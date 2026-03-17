<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'

import { useUserStore, type User } from '@/entities/user'
import { useNotifications } from '@/shared/model/useNotifications'


// Импорт виджетов
import { TeacherProfileHeader } from '@/widgets/teacher-profile-header'
import { TeacherRolesPermissions } from '@/widgets/teacher-roles-permissions'
import { TeacherAssignedCourses } from '@/widgets/teacher-assigned-courses'
import { TeacherSecurityAccess } from '@/widgets/teacher-security-access'
import { TeacherAccountInfo } from '@/widgets/teacher-account-Info'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const notifications = useNotifications()

const profileDraft = ref<User | null>(null)

onMounted(async () => {
  const userId = route.params.id as string
  if (userStore.users.length === 0) await userStore.loadUsers()

  debugger
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
      <RouterLink class="crumb" :to="{ name: 'admin-users' }">Users</RouterLink>
      <span class="separator">/</span>
      <span class="crumb">Teachers</span>
      <span class="separator">/</span>
      <span class="crumb active">{{ profileDraft?.fullName ?? 'Loading...' }}</span>
    </div>

    <!-- Тот самый layout-контейнер (одна колонка, ограничение ширины) -->
    <div class="profile-container">
      <div v-if="userStore.isLoading || !profileDraft" class="flex flex-col gap-4">
        <Skeleton width="100%" height="300px" borderRadius="12px" />
        <Skeleton width="100%" height="200px" borderRadius="12px" />
      </div>

      <div class="content-column">
        <TeacherProfileHeader :profile="profileDraft" />
        <TeacherAccountInfo :profile="profileDraft" />
        <TeacherRolesPermissions :profile="profileDraft" />
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
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

.page-title-section {
  margin-bottom: 2rem;
}
.page-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
}
.page-desc {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
}

/* Ограничиваем ширину, чтобы было как у студента */
.profile-container {
  max-width: 900px;
}

/* Виджеты идут друг под другом */
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
