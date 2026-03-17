<script setup lang="ts">
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import type { TeacherProfile } from '@/entities/user';

defineProps<{ profile: TeacherProfile }>()
const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
</script>

<template>
  <div class="profile-header-card">
    <div class="info-section">
      <!-- Зеленоватый аватар как на макете -->
      <Avatar
        :label="getInitials(profile?.fullName)"
        size="xlarge"
        shape="circle"
        class="custom-avatar"
      />
      <div class="details">
        <h2 class="name">Dr. {{ profile.name }}</h2>
        <div class="meta">
          <span class="employee-id"
            >Employee ID: <Tag severity="secondary" :value="profile.employeeId" class="id-tag"
          /></span>
        </div>
        <div class="status-row">
          <Tag severity="success" value="Active" rounded />
          <span class="last-login"
            ><i class="pi pi-clock"></i> Last Login: {{ profile.lastLogin }}</span
          >
        </div>
      </div>
    </div>

    <div class="actions-section">
      <Button
        label="Deactivate Account"
        icon="pi pi-times-circle"
        outlined
        severity="danger"
        class="btn-block"
      />
    </div>
  </div>
</template>

<style scoped>
/* Стили идентичны шапке студента */
.profile-header-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}
.info-section {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}
.custom-avatar {
  background-color: #dcfce7;
  color: #16a34a;
  font-weight: 700;
  width: 80px;
  height: 80px;
  font-size: 2rem;
}
.details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.name {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}
.meta {
  color: #64748b;
  font-size: 0.875rem;
}
.id-tag {
  font-family: monospace;
  background: #f1f5f9;
  color: #475569;
}
.status-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.25rem;
}
.last-login {
  font-size: 0.875rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.actions-section {
  display: flex;
  gap: 1rem;
}
</style>
