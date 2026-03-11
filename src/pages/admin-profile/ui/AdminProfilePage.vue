<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import { mockAdminProfile } from '@/entities/admin'

import { AdminProfileInfo } from '@/widgets/admin-profile-info'
import { AdminSecurityPassword } from '@/widgets/admin-security-password'

const profileDraft = ref({ ...mockAdminProfile })
const securityRef = ref<InstanceType<typeof AdminSecurityPassword> | null>(null)

const handleSaveChanges = () => {
  const passwordData = securityRef.value?.passwords
  console.log('Saving Profile:', profileDraft.value)
  console.log('Password Changes:', passwordData)
  alert('Settings saved successfully!')
}
</script>

<template>
  <div class="settings-page">
    <!-- Главный заголовок страницы -->
    <div class="page-header">
      <h1 class="page-title">Personal Settings</h1>
    </div>

    <div class="profile-container">
      <div class="sub-header">
        <h2 class="sub-title">General Configuration</h2>
        <p class="sub-desc">Manage your administrative profile.</p>
      </div>

      <div class="content-column">
        <AdminProfileInfo v-model="profileDraft" />
        <AdminSecurityPassword ref="securityRef" />

        <!-- Кнопки действий внизу страницы -->
        <div class="form-actions">
          <Button label="Cancel" outlined class="btn-cancel" />
          <Button label="Save Changes" class="btn-save" @click="handleSaveChanges" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  padding-bottom: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}
.page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.profile-container {
  max-width: 900px;
}

.sub-header {
  margin-bottom: 1.5rem;
}
.sub-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
}
.sub-desc {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
}

.content-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Кнопки в самом низу (справа) */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
.btn-cancel {
  color: #475569;
  border-color: #cbd5e1;
  background: white;
}
.btn-save {
  background: #2563eb;
  border: none;
}
</style>
