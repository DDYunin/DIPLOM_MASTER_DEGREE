<script setup lang="ts">
import Button from 'primevue/button'
import Message from 'primevue/message'
import Tag from 'primevue/tag'
</script>

<template>
  <div class="widget-card">
    <div class="card-header">
      <h3 class="card-title"><i class="pi pi-shield"></i> Security & Access</h3>
    </div>

    <!-- Предупреждение о пароле -->
    <Message severity="warn" :closable="false" class="mb-4">
      User last changed password 45 days ago. Password policy requires change every 90 days.
    </Message>

    <div class="action-buttons">
      <Button label="Generate New Password" icon="pi pi-key" class="btn-primary" />
      <Button
        label="Send Credentials Reset Link"
        icon="pi pi-send"
        outlined
        class="btn-secondary"
      />
    </div>

    <div class="divider"></div>

    <div class="two-factor-section">
      <h4 class="section-subtitle">Two-Factor Authentication</h4>
      <div class="two-factor-status">
        <div class="status-info">
          <Tag severity="success" value="✓" rounded class="check-tag" />
          <span class="status-text">2FA is enabled via Authenticator App</span>
        </div>
        <Button label="Reset 2FA" text severity="danger" />
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
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}
.card-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.card-title i {
  color: #3b82f6;
}
.mb-4 {
  margin-bottom: 1.5rem;
}
.action-buttons {
  display: flex;
  gap: 1rem;
}
.btn-primary {
  flex: 1;
  background: #2563eb;
  border: none;
}
.btn-secondary {
  flex: 1;
  color: #0f172a;
  border-color: #cbd5e1;
}
.divider {
  height: 1px;
  background: #f1f5f9;
  margin: 1.5rem 0;
}
.section-subtitle {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
}
.two-factor-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.status-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.check-tag {
  background: #dcfce7;
  color: #16a34a;
}
.status-text {
  color: #475569;
  font-size: 0.875rem;
}
</style>
