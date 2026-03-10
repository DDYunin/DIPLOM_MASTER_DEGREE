<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import ToggleSwitch from 'primevue/toggleswitch'
import type { TeacherProfile } from '@/entities/user'

const props = defineProps<{ profile: TeacherProfile }>()
const mfaEnabled = ref(props.profile.twoFactorEnabled)
</script>

<template>
  <div class="widget-card">
    <div class="card-header">
      <h3 class="card-title"><i class="pi pi-shield"></i> Security & Access</h3>
    </div>

    <div class="security-grid">
      <!-- Карточка Password Reset -->
      <div class="security-box">
        <div class="box-icon bg-blue"><i class="pi pi-key"></i></div>
        <div class="box-content">
          <span class="box-title">Password Reset</span>
          <span class="box-desc">Send a password reset link to the user's email address.</span>
          <Button label="Send Link" outlined class="action-btn" />
        </div>
      </div>

      <!-- Карточка 2FA -->
      <div class="security-box">
        <div class="box-icon bg-blue"><i class="pi pi-mobile"></i></div>
        <div class="box-content">
          <span class="box-title">Multi-Factor Auth</span>
          <span class="box-desc">Enforce 2FA on next login.</span>
          <div class="toggle-row">
            <ToggleSwitch v-model="mfaEnabled" />
            <span class="toggle-label">{{ mfaEnabled ? 'Enabled' : 'Disabled' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.widget-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.card-header {
  margin-bottom: 1.5rem;
}
.card-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.card-title i {
  color: #3b82f6;
}

.security-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.security-box {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}
.box-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}
.bg-blue {
  background: #eff6ff;
  color: #3b82f6;
}
.box-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.box-title {
  font-weight: 600;
  color: #0f172a;
  font-size: 1rem;
}
.box-desc {
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.4;
}
.action-btn {
  margin-top: 0.5rem;
  width: max-content;
  padding: 0.4rem 1rem;
  font-size: 0.875rem;
}
.toggle-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
.toggle-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
}
</style>
