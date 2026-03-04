<script setup lang="ts">
import { RouterView } from 'vue-router'
import AdminLayout from '@/shared/ui/layouts/AdminLayout.vue'
import { AdminSidebar } from '@/widgets/admin-sidebar'
import { AdminHeader } from '@/widgets/admin-header'
</script>

<template>
  <AdminLayout>
    <template #sidebar>
      <AdminSidebar />
    </template>

    <template #header>
      <AdminHeader />
    </template>

    <!-- Сюда будут подставляться страницы (UsersPage, Dashboard и тд) -->
    <RouterView />
  </AdminLayout>
</template>
