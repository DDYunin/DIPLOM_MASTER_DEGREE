<script setup lang="ts">
import { StudentProfileInfo } from '@/widgets/student-profile-info'
</script>

<template>
  <div class="student-profile-page">
    <header class="page-header">
      <h1 class="page-title">Profile</h1>
      <p class="page-subtitle">Manage your personal information, email, and security settings.</p>
    </header>

    <main class="page-content">
      <StudentProfileInfo />
    </main>
  </div>
</template>

<style scoped>
.student-profile-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem 0;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.page-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--p-text-color);
}

.page-subtitle {
  margin: 0;
  font-size: 1rem;
  color: var(--p-text-muted-color);
}
</style>
