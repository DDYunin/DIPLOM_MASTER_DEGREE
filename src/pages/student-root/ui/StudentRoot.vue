<script setup lang="ts">
import { ref } from 'vue'
import StudentLayout from '@/shared/ui/layouts/StudentLayout.vue'
import { StudentSidebar } from '@/widgets/student-part-sidebar'
import { StudentHeader } from '@/widgets/student-part-header'

// Состояние сворачивания сайдбара
const isSidebarCollapsed = ref(false)
</script>

<template>
  <StudentLayout :is-collapsed="isSidebarCollapsed">
    <!-- Левое меню -->
    <template #sidebar>
      <StudentSidebar v-model:collapsed="isSidebarCollapsed" />
    </template>

    <!-- Верхняя панель -->
    <template #header>
      <StudentHeader />
    </template>

    <!-- Роутер для вложенных страниц (например, StudentCoursesPage) -->
    <router-view />
  </StudentLayout>
</template>
