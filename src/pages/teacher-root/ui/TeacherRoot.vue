<script setup lang="ts">
import { ref } from 'vue'
import TeacherLayout from '@/shared/ui/layouts/TeacherLayout.vue'
import { TeacherSidebar } from '@/widgets/teacher-part-sidebar'
import { TeacherHeader } from '@/widgets/teacher-part-header'

// Состояние сворачивания сайдбара
const isSidebarCollapsed = ref(false)
</script>

<template>
  <TeacherLayout :is-collapsed="isSidebarCollapsed">
    <!-- Левое меню (передаем состояние через v-model) -->
    <template #sidebar>
      <TeacherSidebar v-model:collapsed="isSidebarCollapsed" />
    </template>

    <!-- Верхняя панель -->
    <template #header>
      <TeacherHeader />
    </template>

    <!-- Дефолтный контент (рендерится TeacherCoursesPage) -->
    <router-view />
  </TeacherLayout>
</template>
