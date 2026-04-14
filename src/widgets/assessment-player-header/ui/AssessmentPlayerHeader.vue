<script setup lang="ts">
import { useAssessmentSessionStore } from '@/entities/assessment-session'
const store = useAssessmentSessionStore()
</script>

<template>
  <div class="player-header">
    <div class="header-brand">
      <i class="pi pi-compass text-primary logo-icon"></i>
      <span class="brand-text">StudentPortal</span>
    </div>

    <div class="header-title" v-if="store.session">
      {{ store.session.courseTitle }}
    </div>

    <div class="header-actions">
      <div
        class="timer-badge"
        :class="{ 'timer-warning': (store.session?.timeRemaining || 0) < 300 }"
      >
        <i class="pi pi-clock"></i>
        <span>{{ store.formattedTime }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.player-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--p-text-color);
}

.logo-icon {
  font-size: 1.5rem;
  color: var(--p-primary-500);
}

.header-title {
  font-weight: 600;
  color: var(--p-text-muted-color);
}

.timer-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--p-red-50);
  color: var(--p-red-600);
  padding: 0.5rem 1rem;
  border-radius: var(--p-border-radius-xl);
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 1px;
}

.timer-warning {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}
</style>
