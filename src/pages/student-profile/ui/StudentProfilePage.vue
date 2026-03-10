<script setup lang="ts">
import { ref } from 'vue'
import { mockStudentProfile } from '@/entities/user'
import { UserProfileHeader } from '@/widgets/user-profile-header'
import { UserAccountInfo } from '@/widgets/user-account-info'
import { UserSecurityAccess } from '@/widgets/user-security-access'

// В реальном проекте здесь был бы запрос к API: fetchStudent(route.params.id)
const profile = ref(mockStudentProfile)
</script>

<template>
  <div class="profile-page">
    <!-- Breadcrumbs (Хлебные крошки) -->
    <div class="breadcrumbs">
      <RouterLink class="crumb" :to="{ name: 'admin-users' }">Users</RouterLink>
      <span class="separator">/</span>
      <span class="crumb">Students</span>
      <span class="separator">/</span>
      <span class="crumb active">{{ profile.name }}</span>
    </div>

    <!-- Ограничиваем максимальную ширину контента, чтобы поля ввода не были бесконечными -->
    <div class="profile-container">
      <!-- Шапка профиля -->
      <UserProfileHeader :profile="profile" />

      <!-- Основной контент (Теперь это просто вертикальный список виджетов) -->
      <div class="content-column">
        <UserAccountInfo :profile="profile" />
        <UserSecurityAccess />
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
