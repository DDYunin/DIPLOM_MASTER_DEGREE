<script setup lang="ts">
import { ref } from 'vue'
import { mockTeacherProfile } from '@/entities/user'

// Импорт виджетов
import { TeacherProfileHeader } from '@/widgets/teacher-profile-header'
import { TeacherRolesPermissions } from '@/widgets/teacher-roles-permissions'
import { TeacherAssignedCourses } from '@/widgets/teacher-assigned-courses'
import { TeacherSecurityAccess } from '@/widgets/teacher-security-access'
import { TeacherAccountInfo } from '@/widgets/teacher-account-Info'
// *Представь, что здесь также импортирован TeacherAccountInfo*

const profile = ref(mockTeacherProfile)
</script>

<template>
  <div class="profile-page">
    <div class="breadcrumbs">
      <RouterLink class="crumb" :to="{ name: 'admin-users' }">Users</RouterLink>
      <span class="separator">/</span>
      <span class="crumb">Teachers</span>
      <span class="separator">/</span>
      <span class="crumb active">{{ profile.name }}</span>
    </div>

    <!-- Тот самый layout-контейнер (одна колонка, ограничение ширины) -->
    <div class="profile-container">
      <TeacherProfileHeader :profile="profile" />

      <div class="content-column">
        <TeacherAccountInfo :profile="profile" />
        <TeacherRolesPermissions :profile="profile" />
        <TeacherAssignedCourses :profile="profile" />
        <TeacherSecurityAccess :profile="profile" />
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
</style>
